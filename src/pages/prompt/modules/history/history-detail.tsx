import { Activity, ArrowUpToLine, FileType, type LucideIcon, ParkingSquare, Sigma, Sparkles, Thermometer, FileJson, Fingerprint } from 'lucide-react'
import { type PromptFunction, type Variable } from '@/entities/prompt'
import { usePromptStoreInstance } from '@/store/prompt'
import TooltipPro from '@/components/tooltip-pro'
import { cn, firstUpperCase } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { BlockVariableText } from '../../components/block'
import IconButton from '@/components/icon-button'
import FunctionEditor from '../function/function-editor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type PromptHistory } from '@/entities/history'
import { RESPONSE_FORMAT_NAME_MAP } from '@/composables/config'
import Reload from '@/assets/icons/reload.svg?react'

const HistoryDetailCell: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  return <div className={cn('pb-3 pr-2 border-b border-gray-700 last:border-none', className)} {...props} />
}

const ParameterLabel: React.FC<{
  Icon: LucideIcon
  content: React.ReactNode
  tooltip: string
}> = ({ Icon, content, tooltip }) => {
  return (
    <Tooltip>
      <TooltipTrigger className='flex items-center gap-1 text-sm px-4 first:pl-0 border-l border-gray-300 first:border-0'>
        <Icon size={16} strokeWidth={1.5} />
        <span>{content}</span>
      </TooltipTrigger>
      <TooltipContent>
        <p>{tooltip}</p>
      </TooltipContent>
    </Tooltip>
  )
}

const HistoryDetailTitle: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className, children }) => {
  return (
    <p className={cn('pb-1 text-gray-300 font-bold capitalize break-all', className)}>{children}</p>
  )
}

const HistoryFunctionDetail: React.FC<{
  functions: PromptFunction[]
  functionCall: string
}> = ({ functions, functionCall }) => {
  const functioName = useMemo(() => {
    const f = functions.find(f => f.id === functionCall)
    return f ? `ƒ(𝑥) ${f.name}` : firstUpperCase(functionCall)
  }, [functions, functionCall])

  if (functions.length === 0) return

  return (
    <HistoryDetailCell>
      <Tooltip>
        <HistoryDetailTitle className='mb-3 space-x-2'>
          <span>Functions</span>
          <TooltipTrigger className='px-1.5 py-1 rounded-sm max-w-xs border border-gray-300 bg-gray-400 text-xs font-medium text-gray-100 leading-none truncate'>
            {functioName}
          </TooltipTrigger>
        </HistoryDetailTitle>
        <TooltipContent>
          {functioName}
        </TooltipContent>
      </Tooltip>
      {functions.map((item) => (
        <div key={`${item.id}`} className='-translate-x-2 px-2.5 py-3 bg-card rounded'>
          <p className='font-bold break-all'><span className='text-green-600'>&fnof;{'('}&#119909;{')'} </span>{item.name}</p>
          <p className='py-2'>{item.description}</p>
          <Tabs defaultValue="schema" className='p-2 bg-gray-900 rounded'>
            <TabsList>
              <TabsTrigger className='px-1.5 py-1' value="schema">Schema</TabsTrigger>
              <TabsTrigger className='px-1.5 py-1' value="mock">Mock</TabsTrigger>
            </TabsList>
            <TabsContent value="schema">
              <FunctionEditor
                defaultValue={JSON.stringify(item.parameters, null, 2)}
                options={{
                  readOnly: true
                }}
              />
            </TabsContent>
            <TabsContent value="mock">
              {item.mock}
            </TabsContent>
          </Tabs>
        </div>
      ))}
    </HistoryDetailCell>
  )
}

const HistoryVariableDetail: React.FC<{
  variables: Variable[]
}> = ({ variables }) => {
  return (
    <HistoryDetailCell>
      <HistoryDetailTitle>Variables</HistoryDetailTitle>
      <div className='space-y-6'>
        {variables.map((variable, index) => (
          <div key={index}>
            <HistoryDetailTitle><span className='text-purple-500'>$</span> {variable.key}</HistoryDetailTitle>
            <p className='text-sm'>{variable.value}</p>
          </div>
        ))}
      </div>
    </HistoryDetailCell>
  )
}

const HistoryDetail: React.FC<{
  className?: string
  completion: PromptHistory
}> = ({ className, completion }) => {
  const promptStore = usePromptStoreInstance()
  const { messages, variables, toolChoice, functions, parameters } = completion.config
  const responseFormatText = useMemo(() => {
    if (parameters.responseFormat != null) {
      return RESPONSE_FORMAT_NAME_MAP[parameters.responseFormat]
    }
  }, [parameters])

  const onCoverPrompt = () => {
    promptStore.setState(old => ({
      prompt: {
        ...old.prompt,
        ...completion.config,
        batchConfigs: []
      }
    }))
  }

  return (
    <div className={cn('flex flex-col bg-gray-500', className)}>
      <div className='flex items-center justify-between py-3 px-4 border-b border-gray-700'>
        <p className='font-bold'>Detail</p>
        <TooltipPro message='Reload this config'>
          <IconButton Icon={Reload} onClick={onCoverPrompt} />
        </TooltipPro>
      </div>
      <div className='py-3 pl-6 overflow-y-auto space-y-6'>
        <HistoryDetailCell>
          <HistoryDetailTitle>Parameters</HistoryDetailTitle>
          <div className='flex flex-wrap gap-y-3'>
            <ParameterLabel Icon={Sparkles} content={parameters.model} tooltip='Model' />
            <ParameterLabel Icon={Thermometer} content={parameters.temperature} tooltip='Temperature' />
            <ParameterLabel Icon={Sigma} content={parameters.n} tooltip='N' />
            <ParameterLabel Icon={ArrowUpToLine} content={parameters.topP} tooltip='Top P' />
            <ParameterLabel Icon={Activity} content={parameters.frequencyPenalty} tooltip='Frequency penalty' />
            <ParameterLabel Icon={ParkingSquare} content={parameters.presencePenalty} tooltip='Presence penalty' />
            <ParameterLabel Icon={FileType} content={parameters.maxTokens} tooltip='Max tokens' />
            {parameters.seed != null ? <ParameterLabel Icon={Fingerprint} content={parameters.seed} tooltip='Seed' /> : null}
            {responseFormatText != null ? <ParameterLabel Icon={FileJson} content={responseFormatText} tooltip='Response Format' /> : null}
          </div>
        </HistoryDetailCell>
        {messages.map((message, index) => (
          <HistoryDetailCell key={`message-${index}`}>
            <HistoryDetailTitle>{message.role} Message</HistoryDetailTitle>
            <BlockVariableText className='text-sm' variables={variables ?? []} text={message.content} />
          </HistoryDetailCell>
        ))}
        {variables.length
          ? (
            <HistoryVariableDetail variables={variables} />
          )
          : null}
        {functions.length
          ? (
            <HistoryFunctionDetail functions={functions} functionCall={toolChoice!} />
          )
          : null}
      </div>
    </div>
  )
}

export default HistoryDetail
