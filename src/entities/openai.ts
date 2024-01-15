export interface OpenAISystemMessage {
  role: 'system'
  content?: string
  name?: string
}

export interface OpenAIUserMessage {
  role: 'user'
  content?: string
  name?: string
}

export interface OpenAIAssistantMessage {
  role: 'assistant'
  content?: string
  name?: string
  tool_calls?: OpenAIToolCall[]
}

export interface OpenAIToolMessage {
  role: 'tool'
  content?: string
  tool_call_id: string
}

export type OpenAIMessage = OpenAISystemMessage | OpenAIUserMessage | OpenAIAssistantMessage | OpenAIToolMessage

export interface OpenAIToolFunction {
  description: string
  name: string
  parameters: Record<string, any>
}

export interface OpenAITool {
  type: 'function'
  function: OpenAIToolFunction
}

export interface OpenAIToolCallFunction {
  name: string
  arguments: string
}

export interface OpenAIToolCall {
  id: string
  type: 'function'
  function: OpenAIToolCallFunction
}

export type OpenAIToolChoice =
  'auto' |
  'none' |
  {
    type: 'function'
    function: { name: string }
  }

export interface OpenAIChatCompletionRequest {
  model: string
  temperature?: number
  top_p?: number
  n?: number
  max_tokens?: number
  frequency_penalty?: number
  presence_penalty?: number
  messages: OpenAIMessage[]
  response_format?: { type: string }
  seed?: number
  stop?: string
  stream?: boolean
  tools?: OpenAITool[]
  tool_choice?: OpenAIToolChoice
  user?: string
}

export interface OpenAIChatCompletionResponse {
  /**
   * A unique identifier for the chat completion.
   */
  id: string
  /**
   * The object type, which is always chat.completion
   */
  object: string
  /**
   * A unix timestamp of when the chat completion was created
   */
  created: number
  /**
   * The model used for the chat completion.
   */
  model: string
  /**
   * This fingerprint represents the backend configuration that the model runs with.
   * Can be used in conjunction with the seed request parameter to understand when backend changes have been made that might impact determinism.
   */
  system_fingerprint: string
  /**
   * A list of chat completion choices. Can be more than one if n is greater than 1.
   */
  choices: Array<{
    index: string
    message: OpenAIAssistantMessage
    /**
     * The reason the model stopped generating tokens. This will be stop if the model hit a natural stop point or a provided stop sequence, length if the maximum number of tokens specified in the request was reached, or function_call if the model called a function
     */
    finish_reason: string
  }>
  /**
   * Usage statistics for the completion request.
   */
  usage: {
    /**
     * Number of tokens in the prompt.
     */
    prompt_tokens: number
    /**
     * Number of tokens in the generated completion.
     */
    completion_tokens: number
    /**
     * Total number of tokens used in the request (prompt + completion).
     */
    total_tokens: number
  }
}
