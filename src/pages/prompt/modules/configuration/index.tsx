import * as Tabs from '@radix-ui/react-tabs'
import { type TabsProps } from '@radix-ui/react-tabs'
import ParameterModule from '../parameter'
import PromptModule from '../prompt'
import { cn } from '@/lib/utils'
import VariableModule from '../variable'
import FunctionModule from '../function'
import { usePromptStore } from '@/store/prompt'
import { MODEL_SUPPORT_FUNCTION_MAP } from '@/composables/config'

const ConfigurationModule: React.FC<TabsProps & React.RefAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const model = usePromptStore(state => state.prompt.parameters.model)
  const tabs = useMemo(() => {
    const tabs = [
      {
        key: 'parameters',
        title: 'Parameters'
      }, {
        key: 'prompt',
        title: 'Messages'
      }, {
        key: 'variable',
        title: 'Variables'
      }
    ]
    const isFunctionSupport = MODEL_SUPPORT_FUNCTION_MAP[model]
    if (isFunctionSupport) {
      tabs.push({
        key: 'function',
        title: 'Functions'
      })
    }
    return tabs
  }, [model])

  return (
    <Tabs.Root className={cn('flex flex-col', className)} defaultValue='parameters' {...props}>
      <Tabs.List className="configuration-tabs flex items-center gap-3 px-3 h-14">
        {tabs.map(tab => (
          <Tabs.Trigger
            id={`configuration-tabs__${tab.key}`}
            className='relative text-sm transition-all text-muted-foreground data-[state=active]:text-foreground data-[state=active]:after:block after:hidden after:absolute after:-bottom-1.5 after:left-1/2 after:-translate-x-1/2 after:w-8 after:h-[3px] after:rounded-sm after:bg-purple-500'
            value={tab.key}
            key={tab.key}
          >
            {tab.title}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content id='configuration-content__parameters' className='flex-grow h-0 overflow-y-auto' value='parameters'>
        <ParameterModule />
      </Tabs.Content>
      <Tabs.Content id='configuration-content__prompt' className='flex-grow h-0 overflow-y-auto' value='prompt'>
        <PromptModule />
      </Tabs.Content>
      <Tabs.Content className='flex-grow h-0 overflow-y-auto' value='variable'>
        <VariableModule />
      </Tabs.Content>
      <Tabs.Content className='flex-grow h-0 overflow-y-auto' value='function'>
        <FunctionModule />
      </Tabs.Content>
    </Tabs.Root>
  )
}

export default ConfigurationModule
