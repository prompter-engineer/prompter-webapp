import { createContext } from 'react'
import { createStore, useStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import cloneDeep from 'lodash.clonedeep'
import { type ArrayType, type PromptStoreState, type State } from './interface/prompt'
import { createDefaultBatchConfig, createVarible } from '@/lib/prompt'
import { subscribeWithSelector } from 'zustand/middleware'
import { debounce } from 'lodash-es'
import { updatePrompt } from '@/request/prompt'
import { useUserStore } from './user'
import { DEFAULT_FUNCTION_CALL } from '@/composables/config'
import { queryClient } from '@/lib/react-query'
import { type Prompt, type BatchConfig, type Variable } from '@/entities/prompt'

const createPromptStore = (state: State) => {
  const store = createStore(subscribeWithSelector(immer<PromptStoreState>((set) => ({
    prompt: state.prompt,
    // ------------------------- Config ---------------------------------------
    updatePromptParameter: (key, value) => {
      set((draft: State) => {
        draft.prompt.parameters[key] = value
      })
    },
    updatePromptMessage: (index, value) => {
      set((draft: State) => {
        draft.prompt.messages[index].content = value
      })
    },
    createPromptVariable: () => {
      set((draft: State) => {
        const variable = createVarible()
        draft.prompt.variables.push(variable)
      })
    },
    updatePromptVariable: (variable) => {
      set((draft: State) => {
        const v = draft.prompt.variables.find(v => v.id === variable.id)
        if (v) Object.assign(v, variable)
      })
    },
    removePromptVariable: (variableId) => {
      set((draft: State) => {
        const variables = draft.prompt.variables
        const index = variables.findIndex(v => v.id === variableId)
        if (index !== undefined) {
          variables.splice(index, 1)
        } else {
          draft.prompt.variables = []
        }
      })
    },
    updatePromptFunctionCall: (functionCall) => {
      set((draft: State) => {
        draft.prompt.toolChoice = functionCall
      })
    },
    createPromptFunction: (PromptFunction) => {
      set((draft: State) => {
        draft.prompt.toolChoice = DEFAULT_FUNCTION_CALL
        draft.prompt.functions.push(PromptFunction)
      })
    },
    updatePromptFunction: (index, key, value) => {
      set((draft: State) => {
        draft.prompt.functions[index][key] = value
      })
    },
    removePromptFunction: (index) => {
      set((draft: State) => {
        const functions = draft.prompt.functions
        if (index !== undefined) {
          functions.splice(index, 1)
        } else {
          draft.prompt.functions = []
        }
      })
    },
    // ------------------------ Batch Config ----------------------------------------
    createPromptBatchConfig: (template, insertToIndex) => {
      set((draft: State) => {
        const batchConfigs = draft.prompt.batchConfigs
        const config = cloneDeep(template ?? batchConfigs[0])
        if (config === undefined) {
          console.warn('[usePromptStore]: need use `insertPromptBatchConfig` create BatchConfigs before `createPromptBatchConfig`')
        } else {
          // generate a new `id`
          const newConfig = Object.assign(config, createDefaultBatchConfig())
          if (!template) {
            if (newConfig.messages) {
              Object.keys(newConfig.messages).forEach(key => {
                newConfig.messages![key].content = ''
              })
            }
            if (newConfig.variables) {
              newConfig.variables.forEach(variable => {
                variable.value = ''
              })
            }
          }
          if (insertToIndex === undefined) {
            batchConfigs.push(newConfig)
          } else {
            batchConfigs.splice(insertToIndex, 0, newConfig)
          }
        }
      })
    },
    removePromptBatchConfig: (index) => {
      set((draft: State) => {
        const batchConfigs = draft.prompt.batchConfigs
        if (index !== undefined) {
          batchConfigs.splice(index, 1)
        } else {
          draft.prompt.batchConfigs = []
        }
      })
    },
    updatePromptBatchConfigChild: (index, key, value) => {
      set((draft: State) => {
        const batchConfig = draft.prompt.batchConfigs[index]
        batchConfig[key] = value
      })
    },
    insertPromptBatchConfigChild: <K extends keyof BatchConfig>(key: K, value: K extends 'variables' ? ArrayType<BatchConfig[K]> : BatchConfig[K]) => {
      set((draft: State) => {
        // init batch configs before insert batch config
        let batchConfigs = draft.prompt.batchConfigs
        if (batchConfigs.length === 0) {
          batchConfigs = [createDefaultBatchConfig(), createDefaultBatchConfig()]
        }
        draft.prompt.batchConfigs = batchConfigs.map((config) => {
          if (key === 'variables') {
            if (!config.variables) config.variables = []
            config.variables.push(value as Variable)
          } else {
            config[key] = value as BatchConfig[K]
          }
          return config
        })
      })
    },
    insertPromptBatchConfigMessage: (messageIndex, value) => {
      set((draft: State) => {
        // init batch configs before insert batch config
        let batchConfigs = draft.prompt.batchConfigs
        if (batchConfigs.length === 0) {
          batchConfigs = [createDefaultBatchConfig(), createDefaultBatchConfig()]
        }
        draft.prompt.batchConfigs = batchConfigs.map(batchConfig => {
          const messages = batchConfig.messages ?? {}
          messages[messageIndex] = value
          batchConfig.messages = messages
          return batchConfig
        })
      })
    },
    removePromptBatchConfigMessage: (messageIndex) => {
      set((draft: State) => {
        const batchConfigs = draft.prompt.batchConfigs
        batchConfigs.forEach((batchConfig) => {
          if (batchConfig.messages) {
            Reflect.deleteProperty(batchConfig.messages, messageIndex)
            // if messages is {} (empty-object), auto delete it.
            const lens = Object.keys(batchConfig.messages).length
            if (lens === 0) {
              Reflect.deleteProperty(batchConfig, 'messages')
            }
          }
        })
        // if batchConfig is only contain auto delete it.
        const isExistProperty = Object.keys(batchConfigs[0]).length > 1
        if (!isExistProperty) {
          draft.prompt.batchConfigs = []
        }
      })
    },
    removePromptBatchConfigVariable: (variableId) => {
      set((draft: State) => {
        const batchConfigs = draft.prompt.batchConfigs
        batchConfigs.forEach((batchConfig) => {
          if (batchConfig.variables) {
            const index = batchConfig.variables.findIndex(v => v.id === variableId)
            if (index !== undefined) {
              batchConfig.variables.splice(index, 1)
            }
            // if variables is [], auto delete it.
            if (batchConfig.variables.length === 0) {
              Reflect.deleteProperty(batchConfig, 'variables')
            }
          }
        })
        // if batchConfig is only contain auto delete it.
        const isExistProperty = Object.keys(batchConfigs[0]).length > 1
        if (!isExistProperty) {
          draft.prompt.batchConfigs = []
        }
      })
    }
  }))))

  store.subscribe(
    (state) => state.prompt,
    (prompt: Prompt) => { queryClient.setQueryData<Prompt>(['/prompt/get', prompt.id], prompt) }
  )

  store.subscribe(
    (state) => state.prompt,
    debounce(async prompt => { console.log('syncing'); await updatePrompt(prompt) }, 5000, { maxWait: 1000 * 10 })
  )

  return store
}

type PromptStore = ReturnType<typeof createPromptStore>

export const PromptContext = createContext<PromptStore | null>(null)

export const PromptProvider: React.FC<React.PropsWithChildren<State>> = ({
  children,
  ...props
}) => {
  const storeRef = useRef<PromptStore>(createPromptStore(props))
  const updateUserLastPrompt = useUserStore(state => state.updateUserLastPrompt)

  useEffect(() => {
    if (storeRef.current !== undefined) {
      storeRef.current.setState(props)
    }
    updateUserLastPrompt({
      id: props.prompt.id,
      suiteId: props.prompt.suiteId
    })
  })

  return (
    <PromptContext.Provider value={storeRef.current}>
      {children}
    </PromptContext.Provider>
  )
}

export const usePromptStore = <T,>(selector: (state: PromptStoreState) => T): T => {
  const store = useContext(PromptContext)
  if (!store) throw new Error('[Store]: Missing Prompt.Provider in the tree')
  return useStore(store, selector)
}

export const usePromptStoreInstance = () => {
  const store = useContext(PromptContext)
  if (!store) throw new Error('[Store]: Missing Prompt.Provider in the tree')
  return store
}
