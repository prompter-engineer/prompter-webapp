import { useToast } from '@/components/ui/use-toast'
import { type ResponseError } from '@/request/fetcher'
import { retrieveStripeManageLink } from '@/request/user'
import { useMutation } from '@tanstack/react-query'

export function useRetrieveManage () {
  const { toast } = useToast()
  const { isPending: loading, mutate: retrieve } = useMutation({
    mutationFn: retrieveStripeManageLink,
    onSuccess: ({ url }) => {
      window.open(url)
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: (error as ResponseError).message
      })
    }
  })

  return {
    loading,
    retrieve
  }
}
