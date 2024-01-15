import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip'

/**
 * TooltipPro is Tooltip component gather that help user to quick use Tooltip
 * @param message tooltip hint message
 * @param children tooltip trigger that use <TooltipTrigger asChild> wrapper
 */
const TooltipPro: React.FC<{
  message: React.ReactNode
  children: React.ReactNode
  asChild?: boolean
}> = ({ message, children, asChild = true }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>
        {children}
      </TooltipTrigger>
      <TooltipContent className='max-w-sm hyphens-auto break-all'>
        {message}
      </TooltipContent>
    </Tooltip>
  )
}

export default TooltipPro
