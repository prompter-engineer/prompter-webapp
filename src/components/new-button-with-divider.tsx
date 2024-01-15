import React from 'react'
import Divider from './divider'
import { Button, type ButtonProps } from './ui/button'
import { cn } from '@/lib/utils'
import New from '@/assets/icons/new.svg?react'

const NewButtonWithDivider = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, ...props }, ref) => {
  return (
    <Divider className={cn('mx-auto px-5 w-40', className)}>
      <Button
        className='text-gray-300'
        variant='ghost'
        size='sm'
        ref={ref}
        {...props}
      >
        <New className='mr-1 w-3 h-3' strokeWidth={1.5} />
          New
      </Button>
    </Divider>
  )
})

NewButtonWithDivider.displayName = 'NewButtonWithDivider'

export default NewButtonWithDivider
