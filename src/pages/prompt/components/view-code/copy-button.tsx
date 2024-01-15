import IconButton from '@/components/icon-button'
import Duplicate from '@/assets/icons/duplicate.svg?react'
import copy from 'copy-to-clipboard'
import { type ComponentProps } from 'react'
import { Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface CopyButtonProps extends Omit<ComponentProps<typeof IconButton>, 'Icon'> {
  text: string
}

const CopyButton: React.FC<CopyButtonProps> = ({ text, ...props }) => {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const onCopy = () => {
    if (copied) return
    const result = copy(text)
    if (result) {
      setCopied(true)
      toast({
        description: 'Code successfully copied to clipboard.'
      })
      setTimeout(() => {
        setCopied(false)
      }, 3000)
    }
  }

  return (
    <IconButton Icon={copied ? Check : Duplicate} onClick={onCopy} {...props} />
  )
}

export default CopyButton
