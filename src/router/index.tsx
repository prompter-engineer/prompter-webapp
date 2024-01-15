import { createBrowserRouter, useRouteError } from 'react-router-dom'
import PromptPage from '@/pages/prompt'
import LayoutErrorBoundary from '@/components/layout-error-boundary'
import { Button } from '@/components/ui/button'
import { captureException } from '@sentry/react'

const RouteErrorBoundary = () => {
  const error = useRouteError()
  captureException(error)

  return (
    <LayoutErrorBoundary message='Something went wrong, but don’t fret — let’s give it another shot.'>
      <Button variant='outline' onClick={() => { location.reload() }}>Refresh</Button>
    </LayoutErrorBoundary>
  )
}

const router = createBrowserRouter([
  {
    path: '/',
    lazy: async () => await import('@/pages/index'),
    errorElement: <RouteErrorBoundary />
  },
  {
    lazy: async () => await import('@/pages/dashboard'),
    children: [
      {
        path: '/prompt/:promptId',
        element: <PromptPage />,
        errorElement: <RouteErrorBoundary />
      }
    ],
    errorElement: <RouteErrorBoundary />
  }, {
    path: '/profile',
    lazy: async () => await import('@/pages/profile'),
    errorElement: <RouteErrorBoundary />
  }, {
    path: '/pricing',
    lazy: async () => await import('@/pages/pricing'),
    errorElement: <RouteErrorBoundary />
  }, {
    path: '/login',
    lazy: async () => await import('@/pages/login'),
    errorElement: <RouteErrorBoundary />
  }, {
    path: '/auth',
    lazy: async () => await import('@/pages/auth'),
    errorElement: <RouteErrorBoundary />
  }, {
    path: '*',
    element: <Navigate to="/" replace={true} />
  }
])

export default router
