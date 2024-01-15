import { toast } from '@/components/ui/use-toast'
import { type ResponseError } from '@/request/fetcher'
import { loginWithEmail } from '@/request/user'
import { useUserStore } from '@/store/user'
import { type LoaderFunction, redirect } from 'react-router-dom'

export const loader: LoaderFunction = async ({ request }) => {
  const user = useUserStore.getState().user
  if (user != null) {
    return redirect('/')
  }

  const url = new URL(request.url)
  const email = url.searchParams.get('email')
  const otp = url.searchParams.get('otp')
  if (email == null || otp == null) return redirect('/')

  try {
    await loginWithEmail({
      email,
      otp
    })
    return redirect('/')
  } catch (error) {
    toast({
      variant: 'destructive',
      description: (error as ResponseError).message
    })
    return redirect('/login')
  }
}

export const Component = () => {
  return null
}
