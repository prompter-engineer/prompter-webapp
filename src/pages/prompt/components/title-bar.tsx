import { cn } from '@/lib/utils'

export interface TitleBarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode
  Suffix?: React.ReactNode
  SuffixClass?: string
}

const TitleBar: React.FC<TitleBarProps> = ({ title, className, Suffix, SuffixClass }) => {
  return (
    <div className={cn('flex items-center px-5 py-3 group', className)}>
      {typeof title === 'string' ? <p className='capitalize'>{title}</p> : title}
      {Suffix != null
        ? (
          <div className={cn('ml-auto flex items-center', SuffixClass)}>
            {Suffix}
          </div>
        )
        : null}
    </div>
  )
}

export default TitleBar
