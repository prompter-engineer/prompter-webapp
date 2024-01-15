import { type Message, type Role } from '@/entities/prompt'
import { usePromptStore } from '@/store/prompt'
import { BlockContainer, BlockTitleBar, BlockVariableTextarea, type BlockVariableTextareaProps } from '../../components/block'
import BatchIconButton from '../../components/batch-icon-button'
import { cn } from '@/lib/utils'

export const PROMPT_PLACEHOLDERS: Record<Role, string> = {
  system: 'You are a helpful assistant...',
  user: 'Enter a user message here...',
  assistant: '',
  tool: ''
}

const MessageBlock: React.FC<Omit<BlockVariableTextareaProps, 'value' | 'disabled' | 'placeholder'> & {
  index: number
  message: Message
}> = ({ message, index, ...props }) => {
  const insertPromptBatchConfigMessage = usePromptStore(state => state.insertPromptBatchConfigMessage)
  const removePromptBatchConfigMessage = usePromptStore(state => state.removePromptBatchConfigMessage)
  const n = usePromptStore(state => state.prompt.parameters.n)
  const updatePromptMessage = usePromptStore(state => state.updatePromptMessage)
  const isActiveInBatchConfig = usePromptStore(state => {
    const messages = state.prompt.batchConfigs?.[0]?.messages
    if (messages) {
      return Reflect.has(messages, index)
    }
    return false
  })

  const onBatchChange = (expand: boolean) => {
    if (expand) {
      insertPromptBatchConfigMessage(index, message)
    } else {
      removePromptBatchConfigMessage(index)
    }
  }

  return (
    <BlockContainer className={cn('group space-y-1')}>
      <BlockTitleBar
        title={<span className={cn('capitalize', isActiveInBatchConfig ? 'text-gray-300 opacity-50' : null)}>{message.role}</span>}
        Suffix={(
          <>
            <BatchIconButton expand={isActiveInBatchConfig} onBatchChange={onBatchChange} disabled={n > 1} />
          </>
        )}
        SuffixClass={cn(isActiveInBatchConfig ? null : 'invisible group-hover:visible')}
      />
      <BlockVariableTextarea
        value={message.content}
        onChange={(e) => { updatePromptMessage(index, e.target.value) }}
        disabled={isActiveInBatchConfig}
        placeholder={PROMPT_PLACEHOLDERS[message.role]}
        {...props}
      />
    </BlockContainer>
  )
}

export default MessageBlock
