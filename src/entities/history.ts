import { type Execution } from './completion'
import { type PromptConfig } from './prompt'

export enum HISTORY_LABEL {
  DEFAULT,
  LIKED,
  DISLIKE
}

export interface PromptHistory {
  /**
   * history id
   */
  id: string
  /**
   * completion execution time
   */
  executionTime: number
  /**
   * history last updated time
   */
  updated?: number
  /**
   * mark the current completion
   */
  label?: HISTORY_LABEL
  /**
   * prompt request completion detail
   */
  config: PromptConfig
  systemFingerprint?: string
  executions: Execution[]
}
