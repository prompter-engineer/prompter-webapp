import { usePromptStore, usePromptStoreInstance } from '@/store/prompt'
import TitleBar from '../../components/title-bar'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import BatchItem from './batch-item'
import { useBatchConfig } from './hooks/use-batch-request'
import { mergeConfig } from '@/lib/prompt'
import NewButtonWithDivider from '@/components/new-button-with-divider'
import SendWhite from '@/assets/icons/send-white.svg?react'

const ConfigurationBatchNew: React.FC = () => {
  const createPromptBatchConfig = usePromptStore(state => state.createPromptBatchConfig)

  const onCreate = () => {
    createPromptBatchConfig()
  }

  return (
    <NewButtonWithDivider className='pt-6' onClick={onCreate} />
  )
}

const BatchModule: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const promptStore = usePromptStoreInstance()
  const batchConfigs = usePromptStore(state => state.prompt.batchConfigs)
  const [loading, setLoading] = useState(false)
  const { trigger } = useBatchConfig()

  if (batchConfigs.length === 0) return null

  const onTrigger = async () => {
    setLoading(true)
    try {
      const prompt = promptStore.getState().prompt
      let i = 0; const len = batchConfigs.length
      while (i < len) {
        const mergedConfig = mergeConfig(
          {
            parameters: prompt.parameters,
            messages: prompt.messages,
            variables: prompt.variables,
            toolChoice: prompt.toolChoice,
            functions: prompt.functions
          },
          batchConfigs[i]
        )
        await trigger(i, mergedConfig)
        i++
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col', className)} {...props}>
      <TitleBar
        className='pl-3 pr-6 h-14 text-sm'
        title="Batch Request"
        Suffix={(
          <Button
            variant='primary'
            size='sm'
            onClick={onTrigger}
            disabled={loading}
          >
            <SendWhite className='mr-1.5 w-4 h-4' strokeWidth={1.5} />
            Run
          </Button>
        )}
      />
      <div className='flex flex-col flex-grow h-0 overflow-y-auto px-3 pb-3 gap-2'>
        {batchConfigs?.map((batchConfig, batchConfigIndex) => (
          <BatchItem
            key={batchConfig.id}
            batchConfig={batchConfig}
            batchConfigIndex={batchConfigIndex}
          />
        ))}
        <ConfigurationBatchNew />
      </div>
    </div>
  )
}

export default BatchModule
