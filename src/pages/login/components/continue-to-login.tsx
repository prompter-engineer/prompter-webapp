import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm, useWatch } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { useUpdateEffect } from 'ahooks'
import { loginWithEmail } from '@/request/user'
import Loading from '@/components/loading'
import { type ResponseError } from '@/request/fetcher'
import { useToast } from '@/components/ui/use-toast'
import { useLoginRedirect } from '../hooks/use-login-redirect'
import { useMutation } from '@tanstack/react-query'

interface ContinueToLoginProps {
  email: string
  onEmailChange?: (email: string) => void
}

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  code: z.string().length(6)
})

const ContinueToLogin: React.FC<ContinueToLoginProps> = ({
  email,
  onEmailChange
}) => {
  const { isPending: loading, mutateAsync } = useMutation({
    mutationFn: loginWithEmail,
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: (error as ResponseError).message
      })
    }
  })
  const redirect = useLoginRedirect()
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email,
      code: ''
    }
  })
  const result = useWatch({
    control: form.control,
    name: 'email'
  })

  useUpdateEffect(() => {
    onEmailChange?.(result)
  }, [onEmailChange, result])

  async function onSubmit (values: z.infer<typeof formSchema>) {
    await mutateAsync({
      email: values.email,
      otp: values.code
    })
    redirect()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <FormField
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  className={cn('h-14 px-8 font-bold', fieldState.invalid ? 'border-destructive' : '')}
                  placeholder="Enter your email address…"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='code'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  className={cn('h-14 px-8 font-bold', fieldState.invalid ? 'border-destructive' : '')}
                  placeholder="Paste verification code"
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <p className='text-sm text-muted-foreground'>We just sent you a temporary verification code which is valid for 2 minutes. Please check your inbox and paste the verification code above.</p>
        <Button
          className='w-full h-14 font-bold text-base'
          type="submit"
          variant='primary'
          disabled={loading}
        >
          {loading ? <Loading /> : 'Continue to login'}
        </Button>
      </form>
    </Form>
  )
}

export default ContinueToLogin
