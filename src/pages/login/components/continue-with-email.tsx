import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import type React from 'react'
import { sendOTP } from '@/request/user'
import Loading from '@/components/loading'
import { useToast } from '@/components/ui/use-toast'
import { type ResponseError } from '@/request/fetcher'
import { useMutation } from '@tanstack/react-query'

interface ContinueWithEmailProps {
  email: string
  onEmailSubmit?: (email: string) => void
}

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' })
})

const ContinueWithEmail: React.FC<ContinueWithEmailProps> = ({
  email,
  onEmailSubmit
}) => {
  const { isPending: loading, mutateAsync } = useMutation({
    mutationFn: sendOTP,
    onError: (error) => {
      toast({
        variant: 'destructive',
        description: (error as ResponseError).message
      })
    }
  })
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email
    }
  })

  async function onSubmit (values: z.infer<typeof formSchema>) {
    await mutateAsync(values.email)
    onEmailSubmit?.(values.email)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name='email'
          render={({ field, fieldState }) => (
            <FormItem>
              <FormControl>
                <Input
                  className={cn('h-14 px-8 font-bold', fieldState.invalid ? 'border-destructive' : '')}
                  placeholder="Enter your email address…"
                  autoFocus
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          className='w-full h-14 font-bold text-base'
          type="submit"
          variant='primary'
          disabled={loading}
        >
          {loading ? <Loading /> : 'Continue with Email'}
        </Button>
      </form>
    </Form>
  )
}

export default ContinueWithEmail
