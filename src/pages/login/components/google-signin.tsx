import Loading from '@/components/loading'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { type ResponseError } from '@/request/fetcher'
import { loginWithGoogle } from '@/request/user'
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google'
import { useLoginRedirect } from '../hooks/use-login-redirect'
import Google from '@/assets/icons/google.svg?react'
import { captureException } from '@sentry/react'

const GoogleSignInButton = () => {
  const redirect = useLoginRedirect()
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const googleLogin = useGoogleLogin({
    flow: 'auth-code',
    onSuccess: async (res) => {
      try {
        await loginWithGoogle(res.code)
        redirect()
      } catch (error) {
        toast({
          variant: 'destructive',
          description: (error as ResponseError).message
        })
      } finally {
        setLoading(false)
      }
    },
    onError: error => {
      console.log(error)
      toast({
        variant: 'destructive',
        description: error.error_description
      })
      captureException(error)
      setLoading(false)
    },
    onNonOAuthError: () => {
      setLoading(false)
    }
  })

  const onClick = () => {
    setLoading(true)
    googleLogin()
  }

  return (
    <Button
      className='w-full h-14 font-bold text-base'
      onClick={onClick}
      disabled={loading}
    >
      {loading
        ? <Loading />
        : (
          <>
            <Google className='mr-3' width={18} height={18} />
            Continue with Google
          </>
        )
      }
    </Button>
  )
}

const GoogleSignIn = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <GoogleSignInButton />
    </GoogleOAuthProvider>
  )
}

export default GoogleSignIn
