import type * as DialogPrimitive from '@radix-ui/react-dialog'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import Loading from '../loading'
import { useHotkeys } from 'react-hotkeys-hook'

export interface MessageProps extends DialogPrimitive.DialogProps {
  title?: string
  content?: React.ReactNode
  cancelText?: string
  onCancel?: () => void
  confirmText?: string
  onConfirm?: (() => void) | (() => Promise<void>)
}

const Message: React.FC<MessageProps> = ({ title, content, cancelText = 'Cancel', confirmText = 'Confirm', onConfirm, onCancel, ...props }) => {
  const [loading, setLoading] = useState(false)

  const _onConfirm = async () => {
    if (!onConfirm) return
    setLoading(true)
    try {
      await onConfirm()
    } finally {
      setLoading(false)
    }
  }

  useHotkeys('enter', () => {
    void _onConfirm()
  }, [_onConfirm])

  return (
    <Dialog {...props}>
      <DialogContent>
        <DialogHeader>
          {title !== undefined ? <DialogTitle>{title}</DialogTitle> : null}
          <DialogDescription>
            {content}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant='ghost' onClick={onCancel}>{cancelText}</Button>
          <Button onClick={_onConfirm} disabled={loading}>
            {loading ? <Loading /> : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default Message
