import copy from 'copy-to-clipboard'
import { useToast } from '@/components/ui/use-toast'

export function useClipboard () {
  const { toast } = useToast()

  function _copy (value: string) {
    const result = copy(String(value))
    if (result) {
      toast({
        description: 'Content successfully copied to clipboard.'
      })
    }
  }

  return [_copy]
}
