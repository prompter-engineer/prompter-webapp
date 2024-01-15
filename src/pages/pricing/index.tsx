import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import './index.css'
import { cn } from '@/lib/utils'
import { Button, type ButtonProps } from '@/components/ui/button'
import { createStripePayment, retrieveUserProfile } from '@/request/user'
import Loading from '@/components/loading'
import { useToast } from '@/components/ui/use-toast'
import { type ResponseError } from '@/request/fetcher'
import { useRetrieveManage } from '@/composables/hooks/use-retrieve-manage'
import LayoutFallback from '@/components/layout-fallback'
import RequireAuth from '@/components/require-auth'
import { useMutation, useQuery } from '@tanstack/react-query'
import Back from '@/assets/icons/back.svg?react'

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

const PricingCard: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({
  className,
  children
}) => {
  return (
    <div className={cn('flex flex-col text-center w-[380px] h-[512px] p-[30px] pb-[18px] border-2 rounded-md transition hover:shadow-[4px_4px_12px_0_rgba(219,222,225,0.1)]', className)}>
      {children}
    </div>
  )
}

const PricingCheck = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 18 18"
    >
      <g fill="none">
        <path fill="#7040ea" d="M9 0a9 9 0 10.001 18.001A9 9 0 009 0z"></path>
        <path
          fill="#1e1f22"
          d="M13.968 6.255l-5.281 6.477a.709.709 0 01-1.108 0L4.255 8.518a.2.2 0 01.157-.324h1.38c.22 0 .427.098.556.267l1.784 1.985 3.796-4.179A.7.7 0 0112.483 6h1.345c.14 0 .221.149.14.255z"
        ></path>
      </g>
    </svg>
  )
}

const ManageButton: React.FC<ButtonProps> = ({
  className,
  ...props
}) => {
  const { loading, retrieve } = useRetrieveManage()

  return (
    <Button
      className={cn('mt-auto w-full h-[52px] text-base font-bold', className)}
      onClick={() => { retrieve() }}
      disabled={loading}
      {...props}
    >
      {loading ? <Loading /> : 'Manage subscription'}
    </Button>
  )
}

const CreateButton: React.FC<ButtonProps & {
  mode: 'year' | 'month'
}> = ({
  mode,
  className,
  ...props
}) => {
  const { toast } = useToast()
  const { isPending: loading, mutate } = useMutation({
    mutationFn: createStripePayment,
    onSuccess: ({ url }) => {
      window.location.href = url
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: (error as ResponseError).message
      })
    }
  })

  return (
    <Button
      className={cn('mt-auto w-full h-[52px] text-base font-bold', className)}
      onClick={() => { mutate(mode) }}
      disabled={loading}
      variant='primary'
      {...props}
    >
      {loading ? <Loading /> : 'Upgrade 🚀'}
    </Button>
  )
}

const BasicCard: React.FC<{
  membership: string
}> = ({ membership }) => {
  return (
    <PricingCard className='pricing-basic'>
      <h3 className='text-3xl font-medium'>Basic</h3>
      <p className='mt-10 mb-[60px] text-[32px] font-bold'>$0<span className='text-gray-300'> / month</span></p>
      <div className='mb-[30px] w-full h-[1px] bg-[#3d3f43]' />
      <div className='space-y-5 text-left'>
        <p className='flex items-center gap-2'>
          <PricingCheck />
          Up to 3 prompts
        </p>
        <p className='flex items-center gap-2'>
          <PricingCheck /> Latest 100 history records per prompt
        </p>
      </div>
      {membership === 'plus'
        ? null
        : (
          <div className='inline-flex justify-center items-center mt-auto w-full h-[52px] border border-input bg-background rounded-md text-base font-bold'>
            Your current Plan
          </div>
        )}
    </PricingCard>
  )
}

const PlusCard: React.FC<{
  mode?: 'year' | 'month'
  membership: string
}> = ({
  mode = 'year',
  membership
}) => {
  return (
    <PricingCard className='pricing-plus'>
      <h3 className='text-3xl font-medium'>Plus</h3>
      <p className='mt-10 text-[32px] font-bold'>
        ${mode === 'year' ? '7.9' : '9.9' }
        <span className='text-gray-300'> / month</span>
      </p>
      <p className='mt-2.5 mb-[30px] leading-tight text-gray-300'>
        {mode === 'year' ? 'Billed annually' : 'Billed monthly'}
      </p>
      <div className='mb-[30px] w-full h-[1px] bg-[#3d3f43]' />
      <div className='space-y-5 text-left'>
        <p className='flex items-center gap-2'>
          <PricingCheck />
          Unlimited prompts
        </p>
        <p className='flex items-center gap-2'>
          <PricingCheck /> Unlimited history records
        </p>
      </div>
      {membership === 'plus' ? <ManageButton /> : <CreateButton mode={mode} />}
    </PricingCard>
  )
}

const Page = () => {
  const { isPending: loading, data: user, error } = useQuery({
    queryKey: ['/user/me'],
    queryFn: retrieveUserProfile
  })

  useEffect(() => {
    document.title = 'Pricing'
  }, [])

  if (loading) return <LayoutFallback />

  if (error) throw error

  if (user === undefined) throw new Error('Response non-expected error')

  return (
    <div>
      <header className='flex justify-center items-center h-12 border-b border-gray-900'>
        Pricing
      </header>
      <BackButton className='absolute top-20 left-10' />
      <Tabs className='flex flex-col items-center p-8' defaultValue="annual">
        <TabsList className='mx-auto flex h-auto w-max'>
          <TabsTrigger className='h-10 w-48 rounded' value="annual">
            Annual
            <span className='ml-1.5 py-0.5 px-2 bg-gradient-to-r from-[#ffd9a0] to-[#fff5f1] rounded-md text-[#1e2022]'>-20%</span>
          </TabsTrigger>
          <TabsTrigger className='h-10 w-48 rounded' value="monthly">Monthly</TabsTrigger>
        </TabsList>
        <TabsContent value="annual" tabIndex={undefined}>
          <div className='flex gap-5 p-10'>
            <BasicCard membership={user.membership} />
            <PlusCard membership={user.membership} />
          </div>
        </TabsContent>
        <TabsContent value="monthly" tabIndex={undefined}>
          <div className='flex gap-5 p-10'>
            <BasicCard membership={user.membership} />
            <PlusCard mode='month' membership={user.membership} />
          </div>
        </TabsContent>
      </Tabs>
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
