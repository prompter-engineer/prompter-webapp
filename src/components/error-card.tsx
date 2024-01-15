import Error from '@/assets/icons/error.svg?react'

const ErrorCard: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className='px-4 py-3 bg-gray-900 rounded'>
      <div className='flex items-center gap-1 mb-1 font-bold text-red-600'>
        <Error width={14} height={14} />
        <p>Error</p>
      </div>
      <p className='text-sm text-gray-300 hyphens-auto'>
        {children}
      </p>
    </div>
  )
}

export default ErrorCard
