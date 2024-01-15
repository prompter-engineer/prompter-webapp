import { DEFAULT_API_ENDPOINT, MODEL_SUPPORT_FUNCTION_MAP, MODEL_SUPPORT_RESPONSE_FORMAT_MAP } from '@/composables/config'
import { type Message, type PromptConfig } from '@/entities/prompt'
import { type OpenAIAssistantMessage, type OpenAIChatCompletionRequest, type OpenAIChatCompletionResponse, type OpenAIMessage } from '@/entities/openai'
import { escapeRegExp } from '@/lib/utils'
import { useUserStore } from '@/store/user'
import { defineMap } from '@preflower/utils'
import cloneDeep from 'lodash.clonedeep'
import { useCompletionStore } from '@/store/completion'
import { FUNCTION_STATUS } from '@/entities/completion'
import { createPromptHistory } from './history'
import Ajv from 'ajv'

const ajv = new Ajv()

const handleCompletionMessage = (message: Message): OpenAIMessage => {
  if (message.role === 'assistant') {
    return {
      role: message.role,
      content: message.content,
      tool_calls: message.toolCalls
    }
  } else if (message.role === 'tool') {
    return {
      role: message.role,
      content: message.content,
      tool_call_id: message.toolCallId
    }
  } else {
    return {
      role: message.role,
      content: message.content
    }
  }
}

export const filterPromptConfig = (config: PromptConfig): PromptConfig => {
  const filtered = cloneDeep(config)
  const isSupportResponseFormat = MODEL_SUPPORT_RESPONSE_FORMAT_MAP[filtered.parameters.model]

  if (!isSupportResponseFormat) {
    Reflect.deleteProperty(filtered.parameters, 'responseFormat')
  }

  const isSupportTool = MODEL_SUPPORT_FUNCTION_MAP[filtered.parameters.model]

  if (!isSupportTool) {
    filtered.functions = []
  }

  return filtered
}

export const transformPromptConfig = (config: PromptConfig): OpenAIChatCompletionRequest => {
  const { parameters: rawParameters, messages: rawMessages, variables, toolChoice: rawToolChoice, functions: rawFunctions } = cloneDeep(config)

  const parameters: Omit<OpenAIChatCompletionRequest, 'messages'> = {
    model: rawParameters.model,
    temperature: rawParameters.temperature,
    top_p: rawParameters.topP,
    n: rawParameters.n,
    // if maxTokens = 0, we think it unlimited
    max_tokens: rawParameters.maxTokens === 0 ? undefined : rawParameters.maxTokens,
    frequency_penalty: rawParameters.frequencyPenalty,
    presence_penalty: rawParameters.presencePenalty,
    seed: rawParameters.seed,
    response_format: rawParameters.responseFormat != null ? { type: rawParameters.responseFormat } : undefined
  }
  for (const key in parameters) {
    const value = parameters[key as keyof typeof parameters]
    if (value == null) {
      Reflect.deleteProperty(parameters, key)
    }
  }

  const messages = rawMessages.map(message => handleCompletionMessage(message))

  // format message with variable
  if (variables.length) {
    variables.forEach((variable) => {
      const VARIABLE_REGEXP = new RegExp(`({{\\s*(?:${escapeRegExp(variable.key)})\\s*}})`, 'g')
      messages.forEach(message => {
        if ((message.role === 'system' || message.role === 'user') && message.content != null) {
          message.content = message.content.replace(VARIABLE_REGEXP, variable.value)
        }
      })
    })
  }

  let toolMaps = {}
  if (rawFunctions.length && rawToolChoice !== undefined) {
    // format function_call, if name belongs to functions, use { name } to instead of it
    // reference: https://platform.openai.com/docs/api-reference/chat/create#function_call
    const FUNCTION_MAP = defineMap(rawFunctions, 'id', ['name', 'description', 'parameters'])
    const toolChoice = FUNCTION_MAP[rawToolChoice] !== undefined ? { type: 'function', function: { name: FUNCTION_MAP[rawToolChoice].name } } : rawToolChoice

    const tools = Object.values(FUNCTION_MAP).map(functionCall => ({
      type: 'function',
      function: functionCall
    }))

    toolMaps = {
      tool_choice: toolChoice,
      tools
    }
  }

  return {
    messages,
    ...parameters,
    ...toolMaps
  }
}

/**
 * Limited to openAI, we must send the request with serial to avoid request failed
 */
let sequence: Promise<unknown> = Promise.resolve()
export const getChatCompletion = async (data: OpenAIChatCompletionRequest) => {
  const request = async () => {
    const api = useUserStore.getState().user!.openaiSettings
    const headers: HeadersInit = {
      'Content-Type': 'application/json'
    }
    if (api.apiKey !== undefined) headers.Authorization = `Bearer ${api.apiKey}`

    const response = await window.fetch(api.isCustom ? api.customEndpoint! : DEFAULT_API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    })
    if (!response.ok) {
      const { error } = await response.json()
      throw error
    }
    return await response.json() as OpenAIChatCompletionResponse
  }
  sequence = sequence.then(async _ => await request(), async _ => await request())
  return await (sequence as Promise<OpenAIChatCompletionResponse>)
}

export const handleCompletionResponse = async (
  promptId: string,
  completionId: string,
  request: OpenAIChatCompletionRequest,
  message: OpenAIAssistantMessage,
  response: OpenAIChatCompletionResponse
) => {
  const insertCompletionExecution = useCompletionStore.getState().insertCompletionExecution
  const bindCompletionWithHistory = useCompletionStore.getState().bindCompletionWithHistory
  if (!message.tool_calls) {
    insertCompletionExecution(completionId, { type: 'text', content: message.content })
    const completion = useCompletionStore.getState().completions[completionId]
    const history = await createPromptHistory({
      promptId,
      history: {
        executionTime: completion.createTime,
        config: completion.config,
        systemFingerprint: response.system_fingerprint,
        executions: completion.executions
      }
    })
    bindCompletionWithHistory(completionId, { id: history.id, label: history.label, systemFingerprint: history.systemFingerprint })
    return
  }

  /**
   * handle function response
   */
  const nextRequest: OpenAIChatCompletionRequest = Object.assign(cloneDeep(request), {
    // limit n = 1 to return only one completion
    n: 1,
    // set function_call is 'none' to prevent openAI infinite loop return function_call
    tool_choice: 'none'
  })
  nextRequest.messages.push(message)
  const { functions } = useCompletionStore.getState().completions[completionId].config
  for (const toolCall of message.tool_calls) {
    if (toolCall.type !== 'function') return
    const fn = functions.find(f => f.name === toolCall.function.name)
    insertCompletionExecution(
      completionId,
      {
        type: 'function',
        function: toolCall.function,
        content: fn?.mock,
        status: fn === undefined ? FUNCTION_STATUS.FAILED : FUNCTION_STATUS.SUCCEED
      }
    )
    if (!fn) {
      insertCompletionExecution(completionId, { type: 'error', content: 'Return function name not in pre-defined list' })
      // throw new error and prevent function continue
      return
    }
    const validate = ajv.compile(fn.parameters)
    try {
      const args = JSON.parse(toolCall.function.arguments)
      const valid = validate(args)
      if (!valid) {
        insertCompletionExecution(completionId, { type: 'error', content: 'The parameters of the return function do not match the predefined' })
        // throw new error and prevent function continue
        return
      }
    } catch {
      insertCompletionExecution(completionId, { type: 'error', content: 'Parsing function arguments failed' })
      // throw new error and prevent function continue
      return
    }
    nextRequest.messages.push({
      role: 'tool',
      content: fn.mock,
      tool_call_id: toolCall.id
    })
  }
  const data = await getChatCompletion(nextRequest)
  void handleCompletionResponse(promptId, completionId, nextRequest, data.choices[0].message, data)
}

export const getCompletion = async ({
  promptId,
  config: rawConfig
}: {
  promptId: string
  config: PromptConfig
}) => {
  const config = filterPromptConfig(rawConfig)
  const request = transformPromptConfig(config)
  const data = await getChatCompletion(request)
  return data.choices.map(choice => {
    const createCompletion = useCompletionStore.getState().createCompletion
    /**
       * Openai use seconds as unit, so we need to *1000 when receive it.
       */
    const completion = createCompletion(config, data.created * 1000)
    void handleCompletionResponse(promptId, completion.id, request, choice.message, data)
    return completion
  })
}
