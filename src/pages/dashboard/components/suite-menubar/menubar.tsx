import SuiteMenubarGroup from './menubar-group'
import NewButtonWithDivider from '@/components/new-button-with-divider'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createPromptSuite, retrievePromptSuiteList } from '@/request/suite'
import LayoutFallback from '@/components/layout-fallback'
import LayoutErrorBoundary from '@/components/layout-error-boundary'
import { Button } from '@/components/ui/button'
import { type ResponseError } from '@/request/fetcher'
import { toast } from '@/components/ui/use-toast'
import { type PromptSuite } from '@/entities/suite'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Loading from '@/components/loading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const CreateSuiteButton = () => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const { isPending: loading, mutate } = useMutation({
    mutationFn: createPromptSuite,
    onSuccess: (data) => {
      setOpen(false)
      queryClient.setQueryData<PromptSuite[]>(['/suite/list'], (old) => {
        if (old) return [...old, data]
      })
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: (error as ResponseError).message
      })
    }
  })
  const disabled = loading || name.trim() === ''

  const onConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (disabled) return
    mutate({ name })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <NewButtonWithDivider />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onConfirm} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Create project</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right">
            Name
            </Label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value.trim()) }}
              maxLength={64}
            />
          </div>
          <DialogFooter>
            <Button type='submit' disabled={disabled}>
              {loading ? <Loading /> : 'Confirm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const SuiteMenubar = () => {
  const { isPending, data, error, refetch } = useQuery({
    queryKey: ['/suite/list'],
    queryFn: retrievePromptSuiteList
  })
  const suites = data ?? []

  if (error) {
    return (
      <LayoutErrorBoundary>
        <Button variant='outline' onClick={async () => { await refetch() }}>Retry</Button>
      </LayoutErrorBoundary>
    )
  }

  if (isPending) return <LayoutFallback />

  return (
    <div>
      <div className='py-9'>
        {suites.map(suite => (
          <SuiteMenubarGroup key={suite.id} suite={suite} />
        ))}
      </div>
      <CreateSuiteButton />
    </div>
  )
}

export default SuiteMenubar
