import { type PromptHistory } from './history'
import { type OpenAIToolCallFunction } from './openai'
import { type PromptConfig } from './prompt'

export enum FUNCTION_STATUS {
  SUCCEED,
  FAILED
}

export interface FunctionExecution {
  type: 'function'
  function: OpenAIToolCallFunction
  content?: string
  status?: FUNCTION_STATUS
}

export interface TextExecution {
  type: 'text'
  content?: string
}

export interface ErrorExecution {
  type: 'error'
  content: string
}

export type Execution = FunctionExecution | TextExecution | ErrorExecution

export interface Completion {
  id: string
  /**
   * Prompt config
   */
  config: PromptConfig
  /**
   * Store function call execution stack with Message response
   */
  executions: Execution[]
  /**
   * Chat completion create time (use milliseconds as unit)
   * Openai use seconds as unit, so we need to *1000 when receive it.
   */
  createTime: number
  /**
   * save history id and label update label when label change
   */
  history?: Pick<PromptHistory, 'id' | 'label' | 'systemFingerprint'>
}
