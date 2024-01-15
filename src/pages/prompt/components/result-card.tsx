import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import Divider from '@/components/divider'
import { useCompletionStore } from '@/store/completion'
import { FUNCTION_STATUS, type ErrorExecution, type FunctionExecution, type TextExecution, type Execution } from '@/entities/completion'
import LikeIcon from './like-icon'
import { type HISTORY_LABEL } from '@/entities/history'
import { useDebounceFn } from 'ahooks'
import { updatePromptHistoryLabel } from '@/request/history'
import TooltipPro from '@/components/tooltip-pro'
import Time from '@/assets/icons/time.svg?react'
import ErrorCard from '@/components/error-card'

const AnimationDot: React.FC<{
  className?: string
  animate?: boolean
}> = ({ className, animate }) => {
  return (
    <span className={cn('relative inline-flex h-2 w-2', className)}>
      {animate
        ? <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-current"></span>
        : null}
      <span className="relative inline-flex rounded-full h-full w-full bg-current"></span>
    </span>
  )
}

const FunctionResultCard: React.FC<{
  execution: FunctionExecution
}> = ({ execution }) => {
  return (
    <Popover>
      <PopoverTrigger className={cn('mb-2.5 px-2 py-1.5 w-full rounded bg-gray-900 text-sm text-gray-300 text-left truncate')}>
        <AnimationDot className={execution.status === FUNCTION_STATUS.FAILED ? 'text-destructive' : 'text-[#28c840]'} />
        <span className={cn('mx-2', execution.status === FUNCTION_STATUS.FAILED ? 'text-destructive' : 'text-[#28c840]')}>&fnof;{'('}&#119909;{')'}</span>
        <span>{execution.function.name}</span>
      </PopoverTrigger>
      <PopoverContent className='w-auto max-w-lg break-all' align='start'>
        <p className='text-sm text-gray-300'>Function</p>
        <p>{execution.function.name}</p>
        <Divider className='my-4' />
        <p className='text-sm text-gray-300'>Arguments</p>
        <p className='whitespace-pre-wrap'>{execution.function.arguments}</p>
        {execution.content !== undefined
          ? (
            <>
              <Divider className='my-4' />
              <p className='text-sm text-gray-300'>Result</p>
              <p>{execution.content}</p>
            </>
          )
          : null}
      </PopoverContent>
    </Popover>
  )
}

const TextResultCard: React.FC<{
  execution: TextExecution
}> = ({ execution }) => {
  return (
    <p className='whitespace-pre-line hyphens-auto'>{execution.content}</p>
  )
}

const ErrorResultCard: React.FC<{
  execution: ErrorExecution
}> = ({ execution }) => {
  return (
    <ErrorCard>
      {execution.content}
    </ErrorCard>
  )
}

export const ExecutionsCard: React.FC<{
  executions: Execution[]
}> = ({ executions }) => {
  return executions.map((execution, index) => {
    if (execution.type === 'function') {
      return <FunctionResultCard key={index} execution={execution} />
    } else if (execution.type === 'text') {
      return <TextResultCard key={index} execution={execution} />
    } else if (execution.type === 'error') {
      return <ErrorResultCard key={index} execution={execution} />
    }
    return null
  })
}

export const ResultHeader: React.FC<{
  createTime: number
  systemFingerprint?: string
  isShowLikeIcon?: boolean
  currentLike?: HISTORY_LABEL
  onLikeClick?: (label: HISTORY_LABEL) => void
}> = ({ createTime, systemFingerprint, isShowLikeIcon, currentLike, onLikeClick }) => {
  const formattedTime = dayjs(createTime).format('YYYY/MM/DD HH:mm:ss')

  return (
    <div className='flex items-center pb-2'>
      <div className='flex items-center text-sm text-gray-300 font-normal'>
        <Time
          className='mr-1'
          width={14}
          height={14}
          strokeWidth={1.5}
        />
        {formattedTime}
      </div>
      {systemFingerprint != null
        ? (
          <TooltipPro message='System fingerprint' asChild={false}>
            <div className='ml-2 px-1.5 py-1 rounded-sm border text-xs font-medium leading-none border-gray-300 bg-gray-400'>{systemFingerprint}</div>
          </TooltipPro>
        )
        : null}
      <div className='flex gap-1.5 ml-auto'>
        {isShowLikeIcon ? <LikeIcon label={currentLike} onClick={onLikeClick} /> : null}
      </div>
    </div>
  )
}

const ResultCard: React.FC<{
  completionId: string
}> = ({ completionId }) => {
  const completion = useCompletionStore(state => state.completions[completionId])
  const updateCompletionHistoryLabel = useCompletionStore(state => state.updateCompletionHistoryLabel)
  const { run } = useDebounceFn(updatePromptHistoryLabel)

  if (completion === undefined) return null

  const onLikeClick = (label: HISTORY_LABEL) => {
    updateCompletionHistoryLabel(completion.history!.id, label)
    void run({ id: completion.history!.id, label })
  }

  return (
    <div key={completion.id}>
      <ResultHeader
        createTime={completion.createTime}
        isShowLikeIcon={completion.history != null}
        currentLike={completion.history?.label}
        systemFingerprint={completion.history?.systemFingerprint}
        onLikeClick={onLikeClick}
      />
      <ExecutionsCard executions={completion.executions} />
    </div>
  )
}

export default ResultCard
