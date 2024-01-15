import { cn } from '@/lib/utils'
import './index.css'

const Spinner: React.FC<React.HTMLAttributes<HTMLSpanElement>> = ({
  className,
  ...props
}) => {
  return (
    <span className={cn('spinner', className)} {...props} />
  )
}

export default Spinner
