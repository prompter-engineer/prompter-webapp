import LayoutErrorImage from '@/assets/layout-error.png'

const LayoutErrorBoundary: React.FC<{
  message?: string
  children?: React.ReactNode
}> = ({ message = 'Sorry, something went wrong.', children }) => {
  return (
    <div className='flex flex-col justify-center items-center w-full h-full'>
      <img className='h-[72px] w-[72px]' src={LayoutErrorImage} alt='layout error' />
      <p className='my-5 text-center text-sm text-gray-300'>
        {message}
      </p>
      {children}
    </div>
  )
}

export default LayoutErrorBoundary
