import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import Info from '@/assets/icons/info.svg?react'

const ParameterTitle: React.FC<{
  className?: string
  title: string
  message?: string
}> = ({ className, title, message }) => {
  if (message == null) return title

  return (
    <Tooltip>
      <TooltipTrigger className={cn('flex items-center', className)}>
        <p className='font-bold'>{title}</p>
        <Info
          className='ml-2 text-gray-300'
          width={14}
          height={14}
          strokeWidth={1.5}
        />
      </TooltipTrigger>
      <TooltipContent className='max-w-sm'>
        {message}
      </TooltipContent>
    </Tooltip>
  )
}

export default ParameterTitle
