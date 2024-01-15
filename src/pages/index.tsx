import { useUserStore } from '@/store/user'
import { redirect, type LoaderFunction } from 'react-router-dom'

export const loader: LoaderFunction = () => {
  const logout = useUserStore.getState().logout
  const promptId = useUserStore.getState().lastPrompt?.id

  if (promptId === undefined) {
    logout()
    return redirect('/login')
  }

  return redirect(`/prompt/${promptId}`)
}

export const Component = () => {
  return null
}
