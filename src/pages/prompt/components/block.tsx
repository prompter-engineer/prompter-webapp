import TextareaAutosize, { type TextareaAutosizeProps } from 'react-textarea-autosize'
import { cn, escapeRegExp } from '@/lib/utils'
import TitleBar from './title-bar'
import { usePromptStore } from '@/store/prompt'
import React from 'react'
import { type Variable } from '@/entities/prompt'

export const BlockContainer: React.FC<React.ComponentProps<'div'>> = ({ className, children, ...props }) => {
  return (
    <div className={cn('px-4 py-3 bg-card rounded', className)} {...props}>
      {children}
    </div>
  )
}

export const BlockTitleBar: React.FC<React.ComponentProps<typeof TitleBar>> = ({ className, ...props }) => {
  return (
    <TitleBar
      className={cn('p-0 font-bold text-foreground', className)}
      {...props}
    />
  )
}
export const blockInputStyle = 'pb-1.5 border-b border-gray-400 text-sm'

export const BlockInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => {
  return (
    <input
      className={cn('block w-full bg-transparent placeholder:text-gray-300 focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed', blockInputStyle, className)}
      {...props}
    />
  )
}

export const BlockTextarea: React.FC<TextareaAutosizeProps> = ({ className, ...props }) => {
  return (
    <TextareaAutosize
      className={cn('block w-full transition-background bg-transparent placeholder:text-gray-300 resize-none focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed', blockInputStyle, className)}
      // maxRows={8}
      {...props}
    />
  )
}

export interface BlockVariableTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variables: Variable[]
  text?: string
}

export const BlockVariableText = React.forwardRef<HTMLParagraphElement, BlockVariableTextProps>(({ variables, text, ...props }, ref) => {
  const VARIABLE_REGEXP = useMemo(() => {
    return new RegExp(`({{\\s*(?:${variables.map(v => escapeRegExp(v.key)).join('|')})\\s*}})`, 'g')
  }, [variables])

  if (!variables.length) return <p ref={ref} {...props}>{text}</p>

  const nodes = text?.split(VARIABLE_REGEXP).map((str, index) => {
    if (VARIABLE_REGEXP.test(str)) {
      return <span key={index} className="text-purple-500">{str}</span>
    }
    return str
  })

  return <p ref={ref} {...props}>{nodes}</p>
})
BlockVariableText.displayName = 'BlockVariableText'

export interface BlockVariableTextareaProps extends Omit<TextareaAutosizeProps, 'value'> {
  value?: string
}

export const BlockVariableTextarea: React.FC<
BlockVariableTextareaProps
> = ({ className, value, ...props }) => {
  const variables = usePromptStore(state => state.prompt.variables)
  const [height, setHeight] = useState(0)
  const variableTextRef = useRef<HTMLParagraphElement>(null)

  const onScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const el = e.currentTarget
    variableTextRef.current?.scrollTo({ top: el.scrollTop })
  }

  return (
    <div className={cn('grid w-full', props.disabled ? 'opacity-50' : null, className)}>
      <BlockTextarea
        className='text-transparent caret-foreground disabled:cursor-not-allowed'
        style={{ gridArea: '1 / 1 / 2 / 2' }}
        value={value}
        onHeightChange={setHeight}
        onScroll={onScroll}
        {...props}
      />
      <BlockVariableText
        ref={variableTextRef}
        className={cn('!pointer-events-none whitespace-pre-wrap break-words overflow-hidden', blockInputStyle)}
        style={{ gridArea: '1 / 1 / 2 / 2', height }}
        variables={variables ?? []}
        text={value}
      />
    </div>
  )
}
