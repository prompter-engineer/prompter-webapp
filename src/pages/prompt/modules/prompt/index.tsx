import { usePromptStore } from '@/store/prompt'
import MessageBlock from './message-block'

function PromptModule () {
  const messages = usePromptStore(state => state.prompt.messages)

  return (
    <div className="flex flex-col gap-2 px-3 pb-3">
      {messages.map((message, index) => (
        <MessageBlock
          className={`message-${message.role}`}
          key={index}
          index={index}
          message={message}
        />
      ))}
    </div>
  )
}

export default PromptModule
