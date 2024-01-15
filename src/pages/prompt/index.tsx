import { PromptProvider, usePromptStore } from '@/store/prompt'
import HistoryToggle from './modules/history/history-toggle'
import { cn } from '@/lib/utils'
import BatchModule from './modules/batch'
import ResultModule from './modules/result'
import ConfigurationModule from './modules/configuration'
import LayoutErrorBoundary from '@/components/layout-error-boundary'
import { useQuery } from '@tanstack/react-query'
import { retrievePrompt } from '@/request/prompt'
import LayoutFallback from '@/components/layout-fallback'
import { Button } from '@/components/ui/button'
import UpgradeButton from './components/upgrade-button'
import NewcomerGuide from './components/newcomer-guide'
import ExampleButton from './components/example-button'

const PromptHeader = () => {
  const suiteName = usePromptStore(state => state.prompt.suiteName)
  const promptName = usePromptStore(state => state.prompt.name)

  return (
    <div className='relative flex flex-col shrink-0 justify-center h-14 px-3 border-b border-gray-900  text-sm'>
      <p className='pr-[420px] font-bold text-left truncate'>
        <span className='text-gray-300'>{suiteName}</span> / {promptName}
      </p>
      <div className='flex items-center gap-4 absolute right-5' >
        <UpgradeButton />
        <ExampleButton />
        <HistoryToggle />
      </div>
    </div>
  )
}

function PromptPage () {
  const { promptId } = useParams()
  if (promptId === undefined) throw new Error('Params must be included promptId, please check it.')

  useEffect(() => {
    document.title = 'Prompter'
  }, [])

  const { isPending, data, error, refetch } = useQuery({
    queryKey: ['/prompt/get', promptId],
    queryFn: async () => { return await retrievePrompt({ id: promptId }) },
    gcTime: 0,
    refetchOnWindowFocus: false
  })

  if (isPending) return <LayoutFallback />

  if (data === undefined || error) {
    return (
      <LayoutErrorBoundary>
        <Button variant='outline' onClick={async () => { await refetch() }}>Retry</Button>
      </LayoutErrorBoundary>
    )
  }

  return (
    <PromptProvider prompt={data}>
      <div className='flex flex-col w-[calc(100%-60px)] h-full'>
        <PromptHeader />
        <div className='flex-1 flex'>
          <ConfigurationModule
            className={cn(
              'grow w-0 border-r border-gray-900'
            )}
          />
          <BatchModule className='grow-[2] w-0' />
          <ResultModule className="grow w-0 g-divider-r" />
        </div>
      </div>
      <NewcomerGuide />
    </PromptProvider>
  )
}

export default PromptPage
