import RequireAuth from '@/components/require-auth'
import SideBar from './components/sidebar'

export const Component = () => {
  return (
    <RequireAuth>
      <div className='flex w-full h-full'>
        <SideBar />
        <Outlet />
      </div>
    </RequireAuth>
  )
}
