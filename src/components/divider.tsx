import { cn } from '@/lib/utils'

const Divider: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, children }) => {
  return (
    <div className={cn('flex justify-center items-center', className)}>
      <div className='w-1/2 h-[1px] bg-gray-400' />
      {children}
      <div className='w-1/2 h-[1px] bg-gray-400' />
    </div>
  )
}

export default Divider
