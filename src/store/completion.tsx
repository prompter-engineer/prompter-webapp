import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { type Execution, type Completion } from '@/entities/completion'
import { createCompletion } from '@/lib/prompt'

interface State {
  completions: Record<string, Completion>
}

interface Action {
  createCompletion: (config: Completion['config'], createTime: Completion['createTime']) => Completion
  insertCompletionExecution: (completionId: string, execution: Execution) => void
  bindCompletionWithHistory: (completionId: string, history: NonNullable<Completion['history']>) => void
  updateCompletionHistoryLabel: (historyId: string, label: NonNullable<Completion['history']>['label']) => void
}

export const useCompletionStore = create(
  immer<State & Action>(
    (set) => ({
      completions: {},
      createCompletion: (config, createTime) => {
        const completion = createCompletion(config, createTime)
        set((draft: State) => {
          draft.completions[completion.id] = completion
        })
        return completion
      },
      insertCompletionExecution: (completionId, execution) => {
        set((draft: State) => {
          const completion = draft.completions[completionId]
          completion.executions.push(execution)
        })
      },
      bindCompletionWithHistory: (completionId, history) => {
        set((draft: State) => {
          draft.completions[completionId].history = history
        })
      },
      updateCompletionHistoryLabel: (historyId, label) => {
        set((draft: State) => {
          const completion = Object.values(draft.completions).find(completion => completion.history?.id === historyId)
          if (completion) {
            completion.history!.label = label
          }
        })
      }
    })
  )
)
