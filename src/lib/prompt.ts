import { type Completion } from '@/entities/completion'
import { type PromptFunction, type PromptConfig, type BatchConfig, type Variable } from '@/entities/prompt'
import cloneDeep from 'lodash.clonedeep'
import { nanoid } from 'nanoid'

/**
 * merge prompt config and batch config to generate a new prompt config
 * @param config
 * @param batchConfig
 */
export function mergeConfig (config: PromptConfig, batchConfig: BatchConfig): PromptConfig {
  const { parameters, messages, variables } = batchConfig
  const mergedConfig = Object.assign(cloneDeep(config), parameters)
  if (variables) {
    variables.forEach(v => {
      const old = mergedConfig.variables.find(old => old.id === v.id)
      if (old) Object.assign(old, v)
    })
    for (const [key, value] of Object.entries(variables)) {
      mergedConfig.variables[Number(key)] = value
    }
  }
  if (messages) {
    for (const [key, value] of Object.entries(messages)) {
      mergedConfig.messages[Number(key)] = value
    }
  }
  return mergedConfig
}

export function createCompletion (config: PromptConfig, createTime: number): Completion {
  return {
    id: nanoid(),
    config,
    executions: [],
    createTime
  }
}

export function createBatchConfigId () {
  return nanoid()
}

export function createDefaultBatchConfig (): BatchConfig {
  return {
    id: createBatchConfigId()
  }
}

export function createCompletionFunctionId () {
  return nanoid(5)
}

export function createVaribleId () {
  return nanoid(5)
}

export function createVarible (): Variable {
  return {
    id: createVaribleId(),
    key: '',
    value: ''
  }
}

export function createDefaultCompletionFunction (): PromptFunction {
  return {
    id: createCompletionFunctionId(),
    name: '',
    parameters: {
      type: 'object',
      properties: {},
      required: []
    },
    mock: ''
  }
}
