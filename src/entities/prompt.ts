import { type OpenAITool, type OpenAIToolChoice, type OpenAIToolCall } from './openai'

export type Role = 'system' | 'user' | 'assistant' | 'tool'

export interface SystemMessage {
  /**
   * The role of the messages author
   */
  role: 'system'
  /**
   * The contents of the message
   */
  content?: string
}

export interface UserMEssage {
  /**
   * The role of the messages author
   */
  role: 'user'
  /**
   * The contents of the message
   */
  content?: string
}

export type Tool = OpenAITool

export type ToolCall = OpenAIToolCall

export type ToolChoice = OpenAIToolChoice

export interface AssistantMessage {
  /**
   * The role of the messages author
   */
  role: 'assistant'
  /**
   * The contents of the message
   */
  content?: string
  toolCalls?: ToolCall[]
}

export interface ToolMessage {
  role: 'tool'
  content?: string
  toolCallId: string
}

export type Message = SystemMessage | UserMEssage | AssistantMessage | ToolMessage

export interface Variable {
  id: string
  key: string
  value: string
}

export interface PromptFunction {
  /**
   * The identity of the completion function
   */
  id: string
  /**
   * The name of the function to be called. support [a-zA-Z0-9_.] and a maximum length of 64.
   */
  name: string
  /**
   * A description of what the function does, used by the model to choose when and how to call the function.
   */
  description?: string
  /**
   * Follow https://json-schema.org/understanding-json-schema/ format
   */
  parameters: Record<string, any>
  /**
   * Set mock value that function response
   */
  mock: string
}

export interface PromptParameters {
  /**
   * ID of the model to use.
   */
  model: string
  /**
   * What sampling temperature to use, between 0 and 2. Higher values like 0.8 will make the output more random, while lower values like 0.2 will make it more focused and deterministic.
   */
  temperature: number
  /**
   * An alternative to sampling with temperature, called nucleus sampling, where the model considers the results of the tokens with top_p probability mass. So 0.1 means only the tokens comprising the top 10% probability mass are considered.
   * We generally recommend altering this or temperature but not both.
   */
  topP: number
  /**
   * How many chat completion choices to generate for each input message.
   */
  n: number
  /**
   * The maximum number of tokens to generate in the chat completion.
   */
  maxTokens: number
  /**
   * Number between -2.0 and 2.0.
   * Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.
   */
  frequencyPenalty: number
  /**
   * Number between -2.0 and 2.0.
   * Positive values penalize new tokens based on whether they appear in the text so far, increasing the model's likelihood to talk about new topics.
   */
  presencePenalty: number
  /**
   * An object specifying the format that the model must output.
   * Must be one of text or json_object.
   */
  responseFormat?: string
  /**
   * This feature is in Beta. If specified, our system will make a best effort to sample deterministically, such that repeated requests with the same seed and parameters should return the same result.
   * Determinism is not guaranteed, and you should refer to the system_fingerprint response parameter to monitor changes in the backend.
   */
  seed?: number
}

export interface BatchConfig extends Partial<Omit<PromptConfig, 'messages'>> {
  id: string
  /**
   * use Record<index, message> to store message index in messages
   */
  messages?: Record<string, Message>
}

export interface PromptConfig {
  parameters: PromptParameters
  /**
   * A list of messages comprising the conversation so far.
   */
  messages: Message[]
  /**
   * Store variables and their mappings in message
   */
  variables: Variable[]
  /**
   * Controls how the model responds to function calls.
   * `none`: function not work
   * `auto`: the model will calling a function automatically
   * `${id}`: Specifiy a function that the model calling
   */
  toolChoice?: string
  functions: PromptFunction[]
}

export interface Prompt extends PromptConfig {
  /**
   * prompt id
   */
  id: string
  /**
   * prompt name
   */
  name: string
  /**
   * prompt created time
   */
  created: number
  /**
    * prompt last updated time
    */
  updated: number
  /**
   * suite id of the prompt belong to
   */
  suiteId: string
  /**
   * suite name of the prompt belong to
   */
  suiteName: string
  /**
   * store current prompt batch config
   */
  batchConfigs: BatchConfig[]
}
