import { useUserStore } from '@/store/user'

const RequireAuth: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const token = useUserStore(state => state.user?.token)

  if (token === undefined) {
    return <Navigate to='/login' replace />
  }

  return children
}

export default RequireAuth
