import { type BatchConfig } from '@/entities/prompt'
import { cn } from '@/lib/utils'
import { BatchMessageBlock } from './batch-message-block'
import { BatchVariableBlock } from './batch-variable-block'
import { BlockContainer } from '../../components/block'
import TooltipPro from '@/components/tooltip-pro'
import { usePromptStore, usePromptStoreInstance } from '@/store/prompt'
import { useBatchConfig } from './hooks/use-batch-request'
import { mergeConfig } from '@/lib/prompt'
import BatchItemResult from './batch-item-result'
import IconButton from '@/components/icon-button'
import SendPurple from '@/assets/icons/send-purple.svg?react'
import Delete from '@/assets/icons/delete.svg?react'
import Duplicate from '@/assets/icons/duplicate.svg?react'
import { ViewCodeDialog } from '../../components/view-code'
import { DialogTrigger } from '@/components/ui/dialog'
import Code from '@/assets/icons/code.svg?react'

interface BatchItemProps extends React.HTMLAttributes<HTMLDivElement> {
  batchConfig: BatchConfig
  batchConfigIndex: number
}

const BatchItemMessages: React.FC<{
  batchConfigIndex: number
  messages: BatchConfig['messages']
}> = ({ batchConfigIndex, messages = {} }) => {
  const lens = Object.keys(messages).length

  if (!lens) return null

  return (
    <>
      {Object.entries(messages ?? {}).map(([messageIndex, message]) => (
        <BatchMessageBlock
          key={messageIndex}
          batchConfigIndex={batchConfigIndex}
          messageIndex={Number(messageIndex)}
          title={`${message.role}`}
          content={message.content}
        />
      ))}
    </>
  )
}

const BatchItemVariables: React.FC<{
  batchConfigIndex: number
  variables: BatchConfig['variables']
}> = ({ batchConfigIndex, variables = [] }) => {
  const lens = Object.keys(variables).length

  if (!lens) return null

  return (
    <>
      {variables.map(variable => (
        <BatchVariableBlock
          key={variable.id}
          batchConfigIndex={batchConfigIndex}
          variable={variable}
        />
      ))}
    </>
  )
}

const BatchItem: React.FC<BatchItemProps> = ({
  batchConfig,
  batchConfigIndex,
  className,
  ...props
}) => {
  const promptStore = usePromptStoreInstance()
  const removePromptBatchConfig = usePromptStore(state => state.removePromptBatchConfig)
  const createPromptBatchConfig = usePromptStore(state => state.createPromptBatchConfig)
  const { trigger } = useBatchConfig()
  const batchItemContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (batchItemContentRef.current) {
      const firstTextarea = batchItemContentRef.current?.getElementsByTagName('textarea')[0]
      if (firstTextarea !== undefined) {
        const end = firstTextarea.value.length
        firstTextarea.setSelectionRange(end, end)
        firstTextarea.focus()
      }
    }
  }, [])

  const onTrash = () => {
    removePromptBatchConfig(batchConfigIndex)
  }

  const onDuplicateConfig = () => {
    const batchConfigs = promptStore.getState().prompt.batchConfigs
    createPromptBatchConfig(batchConfigs[batchConfigIndex], batchConfigIndex + 1)
  }

  const onTrigger = () => {
    const prompt = promptStore.getState().prompt
    const mergedConfig = mergeConfig(
      {
        parameters: prompt.parameters,
        messages: prompt.messages,
        variables: prompt.variables,
        toolChoice: prompt.toolChoice,
        functions: prompt.functions
      },
      batchConfig
    )
    void trigger(batchConfigIndex, mergedConfig)
  }

  return (
    <BlockContainer className={cn('flex gap-8', className)} {...props}>
      <div ref={batchItemContentRef} className={cn('flex flex-col flex-1 group space-y-6')}>
        <div className='flex items-center gap-1.5'>
          <p className='px-2 py-1.5 bg-background rounded font-medium text-xs text-yellow-600'>{`Config #${batchConfigIndex + 1}`}</p>
          <TooltipPro message='Duplicate'>
            <IconButton Icon={Duplicate} onClick={onDuplicateConfig} />
          </TooltipPro>
          <IconButton Icon={Delete} onClick={onTrash} />
          <ViewCodeDialog batchConfig={batchConfig}>
            <TooltipPro message='Preview'>
              <DialogTrigger asChild>
                <IconButton Icon={Code} />
              </DialogTrigger>
            </TooltipPro>
          </ViewCodeDialog>
          <IconButton Icon={SendPurple} onClick={onTrigger} />
        </div>
        <BatchItemMessages batchConfigIndex={batchConfigIndex} messages={batchConfig.messages} />
        <BatchItemVariables batchConfigIndex={batchConfigIndex} variables={batchConfig.variables} />
      </div>
      <BatchItemResult batchConfigIndex={batchConfigIndex} />
    </BlockContainer>
  )
}

export default BatchItem
