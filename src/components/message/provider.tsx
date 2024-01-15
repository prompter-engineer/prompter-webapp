import { createContext } from 'react'
import Message, { type MessageProps } from '.'
import { produce } from 'immer'

interface MessageContextValue {
  open: (props: Partial<MessageProps>) => void
}

const MessageContext = createContext<MessageContextValue | null>(null)

export const MessageProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [props, setProps] = useState<MessageProps>({
    open: false
  })
  const onClose = useCallback(() => {
    setProps(produce((draft: MessageProps) => { draft.open = false }))
  }, [setProps])
  const onCancelRef = useRef(onClose)
  const onConfirmRef = useRef(onClose)

  const contextValue = useMemo(() => ({
    open: (props: Partial<MessageProps>) => {
      const { onCancel, onConfirm, ...rest } = props
      setProps(Object.assign({
        open: true
      }, rest))
      onCancelRef.current = () => {
        onCancel?.()
        onClose()
      }
      onConfirmRef.current = async () => {
        await Promise.all([onConfirm?.()])
        onClose()
      }
    }
  }), [onClose, setProps])

  return (
    <MessageContext.Provider value={contextValue}>
      {children}
      <Message
        onOpenChange={onClose}
        onCancel={onCancelRef.current}
        onConfirm={onConfirmRef.current}
        {...props}
      />
    </MessageContext.Provider>
  )
}

export function useMessage () {
  const messageContext = useContext(MessageContext)

  if (!messageContext) {
    throw new Error('useMessage must be used within a MessageProvider.')
  }
  return messageContext
}
