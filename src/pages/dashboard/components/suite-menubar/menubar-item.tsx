import IconButton from '@/components/icon-button'
import Loading from '@/components/loading'
import { useMessage } from '@/components/message/provider'
import TooltipPro from '@/components/tooltip-pro'
import { Button, buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from '@/components/ui/use-toast'
import { type Prompt } from '@/entities/prompt'
import { cn } from '@/lib/utils'
import { type ResponseError } from '@/request/fetcher'
import { duplicatePrompt, removePrompt, updatePromptName } from '@/request/prompt'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dot } from 'lucide-react'
import Duplicate from '@/assets/icons/duplicate.svg?react'
import Edit from '@/assets/icons/edit.svg?react'
import Delete from '@/assets/icons/delete.svg?react'

const EditPromptButton: React.FC<{
  prompt: Prompt
}> = ({ prompt }) => {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState(prompt.name)
  const { isPending: loading, mutate } = useMutation({
    mutationFn: updatePromptName,
    onSuccess: (_, variables) => {
      setOpen(false)
      queryClient.setQueryData<Prompt[]>(['/prompt/list', prompt.suiteId], (old) => {
        if (old) {
          return old.map(p => {
            if (p.id === prompt.id) {
              p = { ...p, ...variables }
            }
            return p
          })
        }
      })
      const state = queryClient.getQueryState(['/prompt/get', prompt.id])
      if (state !== undefined) {
        queryClient.setQueryData<Prompt>(['/prompt/get', prompt.id], (old) => {
          if (old) {
            return {
              ...old,
              name: variables.name
            }
          }
        })
      }
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
    mutate({ id: prompt.id, name })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <IconButton Icon={Edit} />
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={onConfirm} className="space-y-6">
          <DialogHeader>
            <DialogTitle>Edit prompt</DialogTitle>
          </DialogHeader>
          <div className="flex items-center gap-4">
            <Label htmlFor="name" className="text-right">
            Name
            </Label>
            <Input
              value={name}
              onChange={(e) => { setName(e.target.value.trim()) }}
              className="col-span-3"
              maxLength={64}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={disabled}>
              {loading ? <Loading /> : 'Confirm'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

const DuplicatePrompt: React.FC<{
  prompt: Prompt
}> = ({ prompt }) => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isPending: loading, mutate } = useMutation({
    mutationFn: duplicatePrompt,
    onSuccess: (data) => {
      queryClient.setQueryData<Prompt[]>(['/prompt/list', prompt.suiteId], (old) => {
        if (old) return [...old, data]
      })
      navigate(`/prompt/${data.id}`)
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

  const onDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation()
    mutate({ promptId: prompt.id })
  }

  return <IconButton Icon={loading ? Loading : Duplicate} disabled={loading} onClick={onDuplicate} />
}

const RemovePromptButton: React.FC<{
  prompt: Prompt
}> = ({ prompt }) => {
  const queryClient = useQueryClient()
  const message = useMessage()

  const onRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    message.open({
      title: 'Confirm delete',
      content: `Are you sure you want to delete “${prompt.name}”?`,
      confirmText: 'Delete',
      onConfirm: async () => {
        await removePrompt({ id: prompt.id })
        queryClient.setQueryData<Prompt[]>(['/prompt/list', prompt.suiteId], (old) => {
          if (old) return old.filter(s => s.id !== prompt.id)
        })
      }
    })
  }

  return <IconButton Icon={Delete} onClick={onRemove} />
}

const SuiteMenubarItem: React.FC<{
  prompt: Prompt
}> = ({ prompt }) => {
  const { promptId } = useParams()
  const navigate = useNavigate()
  const active = promptId === prompt.id

  return (
    <div
      className={cn(
        'group/item flex items-center h-12 px-2 gap-2 rounded cursor-pointer transition-colors',
        active ? 'bg-gray-500' : null
      )}
      onClick={() => { navigate(`/prompt/${prompt.id}`) }}
    >
      <Dot className='shrink-0' size={14} />
      <TooltipPro message={prompt.name}>
        <p className='truncate group-hover/item:text-purple-500'>{prompt.name}</p>
      </TooltipPro>
      <div className='flex gap-1.5 ml-auto group-hover/item:visible invisible' onClick={(e) => { e.stopPropagation() }}>
        <EditPromptButton prompt={prompt} />
        <DuplicatePrompt prompt={prompt} />
        {active ? null : <RemovePromptButton prompt={prompt} />}
      </div>
    </div>
  )
}

export default SuiteMenubarItem
