import { usePromptStore } from '@/store/prompt'
import FunctionBlock from './function-block'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import NewButtonWithDivider from '@/components/new-button-with-divider'
import { createDefaultCompletionFunction } from '@/lib/prompt'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import Info from '@/assets/icons/info.svg?react'

function FunctionSelect () {
  const functionCall = usePromptStore(state => state.prompt.toolChoice)
  const functions = usePromptStore(state => state.prompt.functions)
  const functionsWithNamed = useMemo(() => functions.filter(item => item.name.trim() !== ''), [functions])
  const updatePromptFunctionCall = usePromptStore(state => state.updatePromptFunctionCall)

  const onModelChange = (value: string) => {
    updatePromptFunctionCall(value)
  }

  return (
    <Select value={functionCall} onValueChange={onModelChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value='auto' key='auto'>Auto</SelectItem>
        <SelectItem value='none' key='none'>None</SelectItem>
        {functionsWithNamed.length > 0
          ? (
            <SelectGroup>
              {functionsWithNamed.map(item => (
                <SelectItem value={item.id} key={item.id}>&fnof;{'('}&#119909;{')'} {item.name}</SelectItem>
              ))}
            </SelectGroup>
          )
          : null}
      </SelectContent>
    </Select>
  )
}

const FunctionEmpty = () => {
  return (
    <p className='px-4 py-3 border border-dashed border-purple-500 bg-purple-500/5 rounded text-sm hyphens-auto'>
      Please note that <a className='underline' href="https://platform.openai.com/docs/guides/gpt/function-calling">function calling</a> is not available for the following models:
      <br /> &#183; gpt-3.5-turbo-0301
      <br /> &#183; gpt-4-0314
      <br /> &#183; gpt-4-32k-0314
    </p>
  )
}

const FunctionCall = () => {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger className='flex items-center mb-2'>
          <p className='font-bold'>Function Call</p>
          <Info
            className='ml-2'
            width={14}
            height={14}
            strokeWidth={1.5}
          />
        </TooltipTrigger>
        <TooltipContent className='max-w-sm hyphens-auto'>
          How the model responds to function calls.
          <br /> &#183; <span className='font-bold'>Auto</span>: either respond to user directly or call a function.
          <br /> &#183; <span className='font-bold'>None</span>: respond to user directly without calling function.
          <br /> &#183; <span className='font-bold'>&fnof;{'('}&#119909;{')'}</span>: call the specific function.
        </TooltipContent>
      </Tooltip>
      <FunctionSelect />
    </div>
  )
}

function FunctionModule () {
  const functions = usePromptStore(state => state.prompt.functions)
  const createPromptFunction = usePromptStore(state => state.createPromptFunction)

  const onCreate = () => {
    createPromptFunction(createDefaultCompletionFunction())
  }

  return (
    <div className="flex flex-col gap-2 px-3 pb-3">
      {functions.length ? <FunctionCall /> : <FunctionEmpty />}
      {functions?.map((item, index) => (
        <FunctionBlock key={item.id} index={index} />
      ))}
      <NewButtonWithDivider className='mt-4' onClick={onCreate} />
    </div>
  )
}

export default FunctionModule
