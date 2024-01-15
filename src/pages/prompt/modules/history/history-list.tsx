import HistoryItem from './history-item'
import HistoryEmptyImage from '@/assets/history-empty.png'
import { cn } from '@/lib/utils'
import { useHotkeys } from 'react-hotkeys-hook'
import type React from 'react'
import useInfiniteScroll from '@/composables/hooks/use-infinite-scroll'
import { type HISTORY_LABEL, type PromptHistory } from '@/entities/history'
import Loading from '@/components/loading'
import useEffectOnce from '@/composables/hooks/use-effect-once'

const HistoryEmpty = () => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <img className='h-[72px] w-[72px]' src={HistoryEmptyImage} alt='history empty' />
      <p className='mt-4 text-center text-sm text-gray-300'>- No history records found -</p>
    </div>
  )
}

const HistoryFinished = () => {
  return (
    <p className='p-4 text-sm text-center text-muted-foreground'>
      - EOF for history records -
    </p>
  )
}

const HistoryLimited = () => {
  return (
    <a className='block m-5 p-4 bg-purple-200 rounded text-purple-900' href='/pricing' target='_blank'>
      <p>Basic users can only view and filter the latest 100 history records. Please upgrade to Plus Plan for unlimited history access.</p>
      <div className='text-right'>
        <div className='inline-block mt-3 px-3 py-2 bg-white rounded-md'>Go Plus</div>
      </div>
    </a>
  )
}

const HistoryLoading = () => {
  return (
    <div className='flex items-center justify-center p-4'>
      <Loading />
    </div>
  )
}

const HistoryList: React.FC<{
  className?: string
  list: PromptHistory[]
  onLoad: () => Promise<any>
  selected?: PromptHistory
  onItemClick?: (item: PromptHistory) => void
  onItemLabelChange?: (historyId: string, label: HISTORY_LABEL) => void
  loading?: boolean
  limited?: boolean
  finished?: boolean
}> = ({ className, list, loading, finished, limited, selected, onLoad, onItemClick, onItemLabelChange }) => {
  const listRef = useRef<HTMLDivElement>(null)
  const isFetching = useRef(false)

  const onTrigger = async () => {
    if (isFetching.current) return
    try {
      isFetching.current = true
      await onLoad()
    } finally {
      isFetching.current = false
    }
  }

  useEffectOnce(() => {
    void onTrigger()
  })

  useInfiniteScroll(listRef, onTrigger, { disabled: !!loading || !!finished || limited })

  const selectItemRef = useRef<HTMLDivElement | null>(null)

  useHotkeys('up', () => {
    if (!selected) return
    const index = list.indexOf(selected)
    if (index > 0) onItemClick?.(list[index - 1])
  })
  useHotkeys('down', () => {
    if (!selected) return
    const index = list.indexOf(selected)
    if (index < list.length - 1) onItemClick?.(list[index + 1])
  })

  useEffect(() => {
    selectItemRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [selected])

  const Footer = () => {
    if (limited) {
      return <HistoryLimited />
    }
    if (finished) {
      return list.length === 0 ? <HistoryEmpty /> : <HistoryFinished />
    }
    return <HistoryLoading />
  }

  return (
    <div ref={listRef} className={className}>
      {list.map((item) => (
        <HistoryItem
          ref={selected === item ? selectItemRef : null}
          key={item.id}
          className={cn('cursor-pointer', selected === item ? 'bg-gray-500' : undefined)}
          completion={item}
          onClick={() => { onItemClick?.(item) }}
          onItemLabelChange={onItemLabelChange}
        />
      ))}
      <Footer />
    </div>
  )
}

export default HistoryList
