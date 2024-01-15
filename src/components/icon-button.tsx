import { Button, type ButtonProps } from './ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface IconButtonProps extends ButtonProps {
  fill?: string
  Icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>> | LucideIcon
  iconSize?: number
  strokeWidth?: number
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({ Icon, fill = 'none', iconSize = 16, strokeWidth, className, ...props }, ref) => {
  return (
    <Button
      ref={ref}
      className={cn('w-6 h-6', className)}
      size='icon'
      variant='ghost'
      {...props}
    >
      <Icon
        width={iconSize}
        height={iconSize}
        strokeWidth={strokeWidth}
        fill={fill}
      />
    </Button>
  )
})
IconButton.displayName = 'IconButton'

export default IconButton
