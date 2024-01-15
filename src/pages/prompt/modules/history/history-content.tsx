import HistoryFilter from './history-filter'
import IconButton from '@/components/icon-button'
import { useMessage } from '@/components/message/provider'
import { clearPromptHistoryList, retrieveHistoryListOfPrompt } from '@/request/history'
import { type HISTORY_LABEL, type PromptHistory } from '@/entities/history'
import { useSettingStore } from '@/store/setting'
import { type ResponseError } from '@/request/fetcher'
import HistoryList from './history-list'
import HistoryDetail from './history-detail'
import { useUpdateEffect } from 'ahooks'
import { toast } from '@/components/ui/use-toast'
import { DialogClose } from '@radix-ui/react-dialog'
import Delete from '@/assets/icons/delete.svg?react'
import ArrowRight from '@/assets/icons/arrow-right.svg?react'

const DEFAULT_PAGE_SIZE = 10

const HistoryContent = () => {
  const { promptId } = useParams()
  if (promptId === undefined) throw new Error('TODO: ...')

  const message = useMessage()
  const filter = useSettingStore(state => state.history.filter)
  const params = useRef({
    pageSize: DEFAULT_PAGE_SIZE,
    pageIndex: 1
  })
  const [list, setList] = useState<PromptHistory[]>([])
  const status = useRef({
    limited: false,
    finished: false,
    loading: false
  })
  const [completion, setCompletion] = useState<PromptHistory>()

  const onLoad = async () => {
    const { loading, limited, finished } = status.current
    if (loading || limited || finished) return
    try {
      status.current.loading = true
      const label =
        [filter.unmarked, filter.liked, filter.disliked]
          .map((item, index) => item ? index : undefined)
          .filter(item => item !== undefined) as number[]
      const { reachLimit, histories } = await retrieveHistoryListOfPrompt({
        promptId,
        pageSize: params.current.pageSize,
        pageIndex: params.current.pageIndex,
        filter: {
          label
        }
      })
      setList(old => {
        // 数据去重
        const arr = [...old, ...histories]
        const map = arr.reduce((pre, cur) => {
          pre.set(cur.id, cur)
          return pre
        }, new Map<string, PromptHistory>())
        return [...map.values()]
      })
      if (histories.length < DEFAULT_PAGE_SIZE) {
        status.current.finished = true
      }
      if (reachLimit) {
        status.current.limited = true
      }
      params.current.pageIndex += 1
    } catch (error) {
      toast({
        variant: 'destructive',
        description: (error as ResponseError).message
      })
    } finally {
      status.current.loading = false
    }
  }

  const onReset = () => {
    setList([])
    status.current = {
      limited: false,
      finished: false,
      loading: false
    }
    params.current = {
      pageSize: DEFAULT_PAGE_SIZE,
      pageIndex: 1
    }
  }

  useUpdateEffect(() => {
    onReset()
    void onLoad()
  }, [filter])

  useUpdateEffect(() => {
    if (completion === undefined || !list.some(h => h.id === completion.id)) {
      setCompletion(list[0])
    }
  }, [list])

  const onHistoryClear = () => {
    message.open({
      title: 'Confirm delete',
      content: 'Are you sure you want to delete all?',
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          await clearPromptHistoryList({
            promptId
          })
          setList([])
          status.current = {
            loading: false,
            finished: true,
            limited: false
          }
        } catch (error) {
          toast({
            variant: 'destructive',
            description: (error as ResponseError).message
          })
          throw error
        }
      }
    })
  }

  const onItemLabelChange = (historyId: string, label: HISTORY_LABEL) => {
    const labels =
      [filter.unmarked, filter.liked, filter.disliked]
        .map((item, index) => item ? index : undefined)
        .filter(item => item !== undefined) as number[]
    if (!labels.includes(label)) {
      setList(old => old.filter(item => item.id !== historyId))
    }
  }

  return (
    <>
      <div className='flex items-center p-4'>
        <p>History</p>
        <div className='ml-auto flex gap-1.5'>
          <IconButton Icon={Delete} onClick={onHistoryClear} />
          <HistoryFilter />
          <DialogClose asChild>
            <IconButton Icon={ArrowRight} strokeWidth={1} />
          </DialogClose>
        </div>
      </div>
      <div className='flex flex-1 overflow-hidden'>
        <HistoryList
          className='flex-1 w-1/2 shrink-0 overflow-y-auto'
          list={list}
          limited={status.current.limited}
          finished={status.current.finished}
          loading={status.current.loading}
          onLoad={onLoad}
          selected={completion}
          onItemClick={setCompletion}
          onItemLabelChange={onItemLabelChange}
        />
        {completion !== undefined ? <HistoryDetail className='w-1/2 shrink-0' completion={completion} /> : null}
      </div>
    </>
  )
}

export default HistoryContent
