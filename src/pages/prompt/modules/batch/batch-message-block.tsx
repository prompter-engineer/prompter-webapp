import { usePromptStore, usePromptStoreInstance } from '@/store/prompt'
import { BlockVariableTextarea } from '../../components/block'
import { produce } from 'immer'
import { type Message } from '@/entities/prompt'

interface BatchMessageBlockProps extends React.ComponentProps<typeof BlockVariableTextarea> {
  batchConfigIndex: number
  messageIndex: number
  title: string
  content?: string
}

export const BatchMessageBlock: React.FC<BatchMessageBlockProps> = ({ batchConfigIndex, messageIndex, title, content, ...props }) => {
  const promptStore = usePromptStoreInstance()
  const updatePromptBatchConfigChild = usePromptStore(state => state.updatePromptBatchConfigChild)

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = promptStore.getState().prompt
    const messages = prompt.batchConfigs?.[batchConfigIndex].messages
    if (messages) {
      const updatedMessages = produce(messages, (draft: Record<string, Message>) => {
        draft[messageIndex].content = e.target.value
      })
      updatePromptBatchConfigChild(batchConfigIndex, 'messages', updatedMessages)
    } else {
      console.warn(`batch config index: ${batchConfigIndex} messages is undefined, please check is correct.`)
    }
  }

  return (
    <div>
      <p className='pb-1 font-bold text-gray-300 capitalize'>
        <span className='text-purple-500'>&gt; </span>
        {title}
      </p>
      <BlockVariableTextarea
        value={content}
        onChange={onTextChange}
        placeholder='Enter a message here...'
        {...props}
      />
    </div>
  )
}
