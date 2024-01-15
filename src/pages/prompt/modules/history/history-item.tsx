import { cn } from '@/lib/utils'
import React from 'react'
import { ExecutionsCard, ResultHeader } from '../../components/result-card'
import { updatePromptHistoryLabel } from '@/request/history'
import { type HISTORY_LABEL, type PromptHistory } from '@/entities/history'
import { useCompletionStore } from '@/store/completion'
import { debounce } from 'lodash-es'

export interface HistoryItemProps extends React.HTMLAttributes<HTMLDivElement> {
  completion: PromptHistory
  onItemLabelChange?: (historyId: string, label: HISTORY_LABEL) => void
}

const HistoryItem = React.forwardRef<HTMLDivElement, HistoryItemProps>(
  ({ completion, className, onItemLabelChange, ...props },
    ref
  ) => {
    const updateCompletionHistoryLabel = useCompletionStore(state => state.updateCompletionHistoryLabel)
    const [label, setLabel] = useState(completion.label)

    const debounced = useMemo(() => {
      return debounce(updatePromptHistoryLabel, 1000)
    }, [])

    const onLikeClick = (label: HISTORY_LABEL) => {
      setLabel(label)
      updateCompletionHistoryLabel(completion.id, label)
      void debounced({
        id: completion.id,
        label
      })
      onItemLabelChange?.(completion.id, label)
    }

    return (
      <div ref={ref} className={cn('p-5', className)} {...props}>
        <ResultHeader
          createTime={completion.executionTime}
          systemFingerprint={completion.systemFingerprint}
          currentLike={label}
          onLikeClick={onLikeClick}
          isShowLikeIcon
        />
        <ExecutionsCard executions={completion.executions} />
      </div>
    )
  }
)
HistoryItem.displayName = 'HistoryItem'

export default React.memo(HistoryItem)
