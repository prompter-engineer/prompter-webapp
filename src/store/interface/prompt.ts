import type { Variable, PromptFunction, PromptParameters, BatchConfig, Prompt, Message } from '@/entities/prompt'

export type ArrayType<T> = T extends Array<infer U> ? U : T

export interface State {
  prompt: Prompt
}

export interface Action {
  /**
   * Update specified prompt config
   * @param promptId specified prompt id
   * @param key prompt config key that need to be updated
   * @param value prompt config value
   * @returns void
   */
  updatePromptParameter: <T extends keyof PromptParameters>(key: T, value: PromptParameters[T]) => void
  /**
   * Update specified prompt config message
   * @param promptId specified prompt id
   * @param index the index that message in messages queue
   * @param value new message content
   * @returns void
   */
  updatePromptMessage: (index: number, value: string) => void
  createPromptVariable: () => void
  /**
   * Update specified prompt config variable
   * @param variable variable name
   * @param value new message content
   * @returns void
   */
  updatePromptVariable: (variable: Variable) => void
  removePromptVariable: (variableId?: string) => void
  updatePromptFunctionCall: (functionCall: string) => void
  createPromptFunction: (PromptFunction: PromptFunction) => void
  updatePromptFunction: <T extends keyof PromptFunction>(index: number, key: T, value: PromptFunction[T]) => void
  removePromptFunction: (index?: number) => void
  /**
   * create a new prompt batch config
   * @param promptId specified prompt id
   * @param template based on template, if undefined we will use the first batch config and clear all value
   * @param insertToIndex created be inserted index, if not provide, we will insert to end
   * @returns void
   */
  createPromptBatchConfig: (template?: BatchConfig, insertToIndex?: number) => void
  removePromptBatchConfig: (index?: number) => void
  /**
   * Update specified prompt batch config child
   * @param promptId specified prompt id
   * @param batchConfigIndex specified batch config index
   * @param key prompt batch config key that need to be updated
   * @returns void
   */
  updatePromptBatchConfigChild: <T extends keyof BatchConfig>(batchConfigIndex: number, key: T, value: BatchConfig[T]) => void
  /**
   * Insert prompt batch config child into all batchConfigs.
   * @param promptId specified prompt id
   * @param key prompt batch config key that need to be inserted
   * @param value prompt batch config key that need to be inserted
   * @returns void
   */
  insertPromptBatchConfigChild: <K extends keyof BatchConfig>(key: K, value: K extends 'variables' ? ArrayType<BatchConfig[K]> : BatchConfig[K]) => void
  /**
   * Insert specified prompt config message
   * @param promptId specified prompt id
   * @param batchConfigIndex specified batch config index
   * @param value new message content
   * @returns void
   */
  insertPromptBatchConfigMessage: (messageIndex: number, value: Message) => void
  removePromptBatchConfigMessage: (messageIndex: number) => void
  removePromptBatchConfigVariable: (variableId: string) => void
}

export type PromptStoreState = State & Action
