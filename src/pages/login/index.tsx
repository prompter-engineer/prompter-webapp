import GoogleSignIn from './components/google-signin'
import Divider from '@/components/divider'
import ContinueWithEmail from './components/continue-with-email'
import ContinueToLogin from './components/continue-to-login'
import { redirect, type LoaderFunction } from 'react-router-dom'
import { useUserStore } from '@/store/user'

enum STEP {
  CONTINUE_WITH_EMAIL,
  CONTINUE_TO_LOGIN
}

export const loader: LoaderFunction = () => {
  const user = useUserStore.getState().user
  if (user != null) {
    return redirect('/')
  }
  return null
}

export const Component = () => {
  const [currentStep, setCurrentStep] = useState(STEP.CONTINUE_WITH_EMAIL)
  const [email, setEmail] = useState('')

  useEffect(() => {
    document.title = 'Login'
  }, [])

  function onEmailSubmit (email: string) {
    setEmail(email)
    setCurrentStep(STEP.CONTINUE_TO_LOGIN)
  }

  function onEmailChange (email: string) {
    setEmail(email)
    setCurrentStep(STEP.CONTINUE_WITH_EMAIL)
  }

  return (
    <div className='flex flex-col justify-center items-center w-full h-full min-h-[500px]'>
      <div className='w-[420px] space-y-6'>
        <h3 className='font-bold text-center text-[32px]'>Sign in/Sign up for Prompter</h3>
        <GoogleSignIn />
        <Divider>
          <span className='px-[18px] text-gray-300'>or</span>
        </Divider>
        {currentStep === STEP.CONTINUE_WITH_EMAIL
          ? (
            <ContinueWithEmail email={email} onEmailSubmit={onEmailSubmit} />
          )
          : <ContinueToLogin email={email} onEmailChange={onEmailChange} />
        }
      </div>
      <p className='max-w-[600px] my-4 text-center text-sm text-gray-300'>
        If you have not created an account, your login will automatically create a new account for you. By clicking “Continue with Google/Email” above, you acknowledge that you have read and understood, and agreed to Prompter&apos;s&nbsp;
        <a
          className='text-purple-500 underline-offset-4 hover:underline'
          href="https://prompter.engineer/terms"
          target='_blank'
          rel="noreferrer"
        >
          Terms & Conditions
        </a>
        &nbsp;and&nbsp;
        <a
          className='text-purple-500 underline-offset-4 hover:underline'
          href="https://prompter.engineer/privacy"
          target='_blank'
          rel="noreferrer"
        >
          Privacy Policy
        </a>.
      </p>
    </div>
  )
}
