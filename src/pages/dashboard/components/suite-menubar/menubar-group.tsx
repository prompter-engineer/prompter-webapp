import { type Prompt } from '@/entities/prompt'
import { useMessage } from '@/components/message/provider'
import IconButton from '@/components/icon-button'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { deletePromptSuite, updatePromptSuite } from '@/request/suite'
import { type PromptSuite } from '@/entities/suite'
import { toast } from '@/components/ui/use-toast'
import { type ResponseError } from '@/request/fetcher'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import Loading from '@/components/loading'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button, buttonVariants } from '@/components/ui/button'
import { createPrompt, retrievePromptListOfSuite } from '@/request/prompt'
import SuiteMenubarItem from './menubar-item'
import { cn } from '@/lib/utils'
import { useUserStore } from '@/store/user'
import TooltipPro from '@/components/tooltip-pro'
import Delete from '@/assets/icons/delete.svg?react'
import New from '@/assets/icons/new.svg?react'
import Down from '@/assets/icons/down.svg?react'
import Edit from '@/assets/icons/edit.svg?react'

export interface SuiteGroup {
  id: string
  name: string
  items: Prompt[]
}

const EditPromptSuiteButton: React.FC<{
  suite: PromptSuite
}> = ({ suite }) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(suite.name)

  const { isPending: loading, mutate } = useMutation({
    mutationFn: updatePromptSuite,
    onSuccess: (_, variables) => {
      setOpen(false)
      queryClient.setQueryData<PromptSuite[]>(['/suite/list'], (old) => {
        if (old) {
          return old.map(s => {
            if (s.id === suite.id) {
              s = { ...s, ...variables }
            }
            return s
          })
        }
      })
      const prompts = queryClient.getQueryData<Prompt[]>(['/prompt/list', suite.id])
      prompts?.forEach(prompt => {
        const state = queryClient.getQueryState(['/prompt/get', prompt.id])
        if (state !== undefined) {
          queryClient.setQueryData<Prompt>(['/prompt/get', prompt.id], (old) => {
            if (old) return { ...old, suiteName: variables.name }
          })
        }
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
    mutate({ id: suite.id, name })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton Icon={Edit} />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onConfirm} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Edit project</DialogTitle>
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

const CreatePromptButton: React.FC<{
  suite: PromptSuite
}> = ({ suite }) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const { isPending: loading, mutate } = useMutation({
    mutationFn: createPrompt,
    onSuccess: (data) => {
      setOpen(false)
      // inital state for user next create
      setName('')
      queryClient.setQueryData<Prompt[]>(['/prompt/list', suite.id], (old) => {
        if (old) return [...old, data]
      })
    },
    onError: (e) => {
      const error = e as ResponseError
      let action
      if (error.code === 1201) {
        action = (
          <a className={buttonVariants({ size: 'sm' })} href='/pricing'>Upgrade</a>
        )
      }
      toast({
        variant: 'destructive',
        description: error.message,
        action
      })
    }
  })
  const disabled = loading || name.trim() === ''

  const onConfirm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (disabled) return
    mutate({ suiteId: suite.id, name })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton Icon={New} />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onConfirm} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Create prompt</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right">
            Name
            </Label>
            <Input
              defaultValue={name}
              onChange={(e) => { setName(e.target.value) }}
              className="col-span-3"
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

const RemovePromptSuiteButton: React.FC<{
  suite: PromptSuite
}> = ({ suite }) => {
  const queryClient = useQueryClient()
  const message = useMessage()

  const onDelete = (e: React.MouseEvent) => {
    e.stopPropagation()

    message.open({
      title: 'Confirm delete',
      content: `Are you sure you want to delete “${suite.name}”?`,
      confirmText: 'Delete',
      onConfirm: async () => {
        await deletePromptSuite({ id: suite.id })
        const state = queryClient.getQueryState(['/suite/list'])
        if (state !== undefined) {
          queryClient.setQueryData<PromptSuite[]>(['/suite/list', suite.id], (old) => {
            if (old) return old.filter(s => s.id !== suite.id)
          })
        }
      }
    })
  }

  return <IconButton Icon={Delete} onClick={onDelete} />
}

const SuiteMenubarGroup: React.FC<{
  suite: PromptSuite
}> = ({ suite }) => {
  const currentPromptSuiteId = useUserStore(state => state.lastPrompt?.suiteId)
  const [open, setOpened] = useState(currentPromptSuiteId === suite.id)
  const { data: list } = useQuery({
    queryKey: ['/prompt/list', suite.id],
    queryFn: async () => await retrievePromptListOfSuite(suite.id),
    enabled: open
  })
  const deletable = currentPromptSuiteId !== suite.id

  const onSwitch = () => {
    setOpened(old => !old)
  }

  return (
    <div>
      <div className='group flex items-center justify-between gap-2 h-12 px-2 cursor-pointer' onClick={onSwitch}>
        <Down
          className={cn('shrink-0 transition-transform duration-200', open ? null : '-rotate-90')}
          width={14}
          height={14}
          strokeWidth={1.5}
        />
        <TooltipPro message={suite.name}>
          <p className='text-gray-300 font-bold truncate'>{suite.name}</p>
        </TooltipPro>
        <div className='flex items-center gap-1.5 ml-auto invisible group-hover:visible' onClick={(e) => { e.stopPropagation() }}>
          <EditPromptSuiteButton suite={suite} />
          <CreatePromptButton suite={suite} />
          {deletable ? <RemovePromptSuiteButton suite={suite} /> : null}
        </div>
      </div>
      {open && list
        ? (
          <div>
            {list.map(prompt => (
              <SuiteMenubarItem key={prompt.id} prompt={prompt} />
            ))}
          </div>
        )
        : null}
    </div>
  )
}

export default SuiteMenubarGroup
