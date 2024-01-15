import { cn } from '@/lib/utils'
import ResultEmptyImage from '@/assets/result-empty.png'
import { usePromptStore, usePromptStoreInstance } from '@/store/prompt'
import { Button } from '@/components/ui/button'
import { getCompletion } from '@/request/completion'
import ResultCard from '../../components/result-card'
import { useMutation } from '@tanstack/react-query'
import LayoutFallback from '@/components/layout-fallback'
import SendWhite from '@/assets/icons/send-white.svg?react'
import Loading from '@/components/loading'
import ErrorCard from '@/components/error-card'
import { ViewCodeDialog } from '../../components/view-code'
import { DialogTrigger } from '@/components/ui/dialog'
import Code from '@/assets/icons/code.svg?react'

const ResultEmpty = () => {
  return (
    <div className='flex flex-col justify-center items-center h-full'>
      <img className='h-[72px] w-[72px]' src={ResultEmptyImage} alt='result empty' />
      <p className='mt-4 text-center text-sm text-gray-300'>Click run to get a result.</p>
    </div>
  )
}

const ResultModule: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const { promptId } = useParams()
  const promptStore = usePromptStoreInstance()
  const isBatchConfigMode = usePromptStore(state => state.prompt.batchConfigs.length > 0)
  const {
    data,
    error,
    mutate,
    isPending
  } = useMutation({
    mutationFn: getCompletion
  })

  if (isBatchConfigMode) return null

  const Content = () => {
    if (isPending) {
      return <LayoutFallback />
    } else if (error != null) {
      return (
        <ErrorCard>
          {error.message}
        </ErrorCard>
      )
    } else if (data) {
      return (
        data?.map(completion => (
          <div key={completion.id} className='px-4 py-3 bg-card rounded'>
            <ResultCard completionId={completion.id} />
          </div>
        ))
      )
    } else {
      return <ResultEmpty />
    }
  }

  const onSubmit = () => {
    const prompt = promptStore.getState().prompt
    mutate({
      promptId: promptId!,
      config: {
        parameters: prompt.parameters,
        messages: prompt.messages,
        variables: prompt.variables,
        toolChoice: prompt.toolChoice,
        functions: prompt.functions
      }
    })
  }

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <div className='flex items-center h-14 gap-4 p-3 pr-6'>
        <p className='text-sm'>Result</p>
        <ViewCodeDialog>
          <DialogTrigger asChild>
            <Button className='ml-auto' variant='ghost' size='sm'>
              <Code className='mr-1.5 h-4 w-4' />
              Preview
            </Button>
          </DialogTrigger>
        </ViewCodeDialog>
        <Button
          id="result-run-button"
          variant='primary'
          size='sm'
          disabled={isPending}
          onClick={onSubmit}
        >
          {isPending ? <Loading className="mr-1.5 h-4 w-4" /> : <SendWhite className='mr-1.5 h-4 w-4' strokeWidth={1.5} />}
            Run
        </Button>
      </div>
      <div className='flex flex-col flex-grow h-0 overflow-y-auto gap-2 px-4'>
        <Content />
      </div>
    </div>
  )
}

export default ResultModule
