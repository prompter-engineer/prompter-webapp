import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import IconButton from '@/components/icon-button'
import Back from '@/assets/icons/back.svg?react'
import { useUserStore } from '@/store/user'
import Loading from '@/components/loading'
import { useRetrieveManage } from '@/composables/hooks/use-retrieve-manage'
import { useMessage } from '@/components/message/provider'
import { type ServerUser, retrieveUserProfile, updateUserProfile } from '@/request/user'
import { toast } from '@/components/ui/use-toast'
import { type ResponseError } from '@/request/fetcher'
import LayoutFallback from '@/components/layout-fallback'
import { type ChangeEvent } from 'react'
import './index.css'
import { Input } from '@/components/ui/input'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import LayoutErrorBoundary from '@/components/layout-error-boundary'
import RequireAuth from '@/components/require-auth'
import Edit from '@/assets/icons/edit.svg?react'

const BackButton: React.FC<{
  className?: string
}> = ({ className }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const onBack = () => {
    const doesAnyHistoryEntryExist = location.key !== 'default'

    if (doesAnyHistoryEntryExist) {
      navigate(-1)
    } else {
      navigate('/')
    }
  }

  return (
    <div className={cn('flex items-center cursor-pointer text-gray-300', className)} onClick={onBack}>
      <Back
        className='mr-2 w-4 h-4'
        strokeWidth={1}
      />
      Back
    </div>
  )
}

const UpgradeBlock: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const navigate = useNavigate()

  const onClick = () => {
    navigate('/pricing')
  }

  return (
    <div className={cn('cursor-pointer', className)} onClick={onClick} {...props}>
      <p className='text-[32px] font-bold text-right'>
        Go <span className='profile-plus__title'>Plus</span>
      </p>
      <p>
        Get unlimited usage &gt;
      </p>
    </div>
  )
}

const ManageBlock: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  const { loading, retrieve } = useRetrieveManage()

  return (
    <div className={cn('cursor-pointer', className)} onClick={() => { retrieve() }} {...props}>
      {loading
        ? <Loading className='mx-auto' />
        : (
          <>
            <p className='text-[32px] font-bold text-right'>
              <span className='profile-plus__title'>Plus</span>
            </p>
            <p>Manage on Stripe &gt;</p>
          </>
        )
      }
    </div>
  )
}

const NameEditField: React.FC<{
  name?: string
}> = ({ name: rawName }) => {
  const logout = useUserStore(state => state.logout)
  const message = useMessage()
  const [isEdit, setEdit] = useState(false)
  const [name, setName] = useState(rawName)
  const onLogout = () => {
    message.open({
      title: 'Confirm Logout',
      content: 'Are you sure to logout?',
      onConfirm: () => {
        logout()
      }
    })
  }
  const queryClient = useQueryClient()
  const { isPending: loading, mutateAsync } = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (_, variables) => {
      queryClient.setQueryData<ServerUser>(['/user/me'], (old) => {
        if (old) return { ...old, ...variables }
      })
      const updateUserInfo = useUserStore.getState().updateUserInfo
      if (variables.name != null) {
        updateUserInfo('name', variables.name)
      }
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: (error as ResponseError).message
      })
    }
  })

  async function onSave () {
    await mutateAsync({
      name
    })
    toast({
      description: 'User information has been updated'
    })
    setEdit(false)
  }

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
  }

  return (
    <div className='px-4 py-6'>
      <p className='mb-2 font-bold'>Name</p>
      <div className='relative'>
        <Input
          className='px-4 py-[14px] h-auto'
          value={name}
          onChange={onNameChange}
          disabled={!isEdit}
        />
        <IconButton className='absolute top-1/2 right-4 transform -translate-y-1/2 text-[#717e88]' Icon={Edit} onClick={() => { setEdit(old => !old) }} />
      </div>
      <div className='mt-6 space-x-3'>
        <Button className='w-[98px] h-11' onClick={onLogout}>Log out</Button>
        <Button
          className='w-[98px] h-11'
          variant='primary'
          disabled={name === '' || name == null || name === rawName || loading}
          onClick={onSave}
        >
          {loading ? <Loading /> : 'Save'}
        </Button>
      </div>
    </div>
  )
}

const Page = () => {
  const { isPending: loading, data: user, error, refetch } = useQuery({
    queryKey: ['/user/me'],
    queryFn: retrieveUserProfile
  })

  useEffect(() => {
    document.title = 'Profile'
  }, [])

  if (loading) return <LayoutFallback />

  if (error) {
    return (
      <LayoutErrorBoundary>
        <Button variant='outline' onClick={async () => { await refetch() }}>Retry</Button>
      </LayoutErrorBoundary>
    )
  }

  return (
    <div className="w-full h-full">
      <header className='flex justify-center items-center h-12 border-b border-gray-900'>
        Profile
      </header>
      <BackButton className='absolute top-20 left-10' />
      <div className="mt-5 mx-auto p-3 pb-[66px] max-w-[796px] bg-gradient-to-b from-[hsl(0,0%,0%)] to-[hsl(225,6%,13%)] rounded-md">
        <div className={cn('flex flex-col px-4 py-5 rounded', `profile-card__${user.membership}`)}>
          <div className='flex items-center gap-2.5'>
            <span className='inline-flex justify-center items-center w-[66px] h-[66px] bg-gray-100 rounded-full capitalize text-gray-900 text-3xl font-bold'>{user.email.at(0)}</span>
            <div>
              <p className='font-bold mb-1'>{user.name}</p>
              <p className='text-sm text-gray-300'>{user.email}</p>
            </div>
          </div>
          {user.membership === 'basic' ? <UpgradeBlock className='ml-auto' /> : <ManageBlock className='ml-auto' />}
        </div>
        <NameEditField name={user.name} />
      </div>
    </div>
  )
}

export const Component = () => {
  return (
    <RequireAuth>
      <Page />
    </RequireAuth>
  )
}
