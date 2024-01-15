import React from 'react'
import { cn } from '@/lib/utils'
import { Loader2, type LucideIcon } from 'lucide-react'

const Loading: LucideIcon = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <Loader2 ref={ref} className={cn('animate-spin', className)} {...props} />
  )
})

Loading.displayName = 'Loading'

export default Loading
