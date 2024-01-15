import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from '@/components/ui/select'
import { MODELS, MODEL_MAX_LENGTH_MAP, MODEL_SUPPORT_RESPONSE_FORMAT_MAP } from '@/composables/config'
import { usePromptStore } from '@/store/prompt'
import { type PromptParameters } from '@/entities/prompt'
import ParameterTitle from './components/parameter-title'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import ParameterSilder from './components/parameter-slider'
import { Switch } from '@/components/ui/switch'

function ModelSelect () {
  const model = usePromptStore(state => state.prompt.parameters.model)
  const updatePromptParameter = usePromptStore(state => state.updatePromptParameter)
  const [container, setContainer] = useState<HTMLElement>()

  const onModelChange = (value: string) => {
    updatePromptParameter('model', value)
  }

  useEffect(() => {
    setContainer(document.querySelector('#configuration-content__parameters') as HTMLElement)
  }, [])

  return (
    <Select value={model} onValueChange={onModelChange}>
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent container={container}>
        {MODELS.map(model => (
          <SelectItem value={model.name} key={model.name}>{model.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function ResponseFormatSelect () {
  const responseFormat = usePromptStore(state => state.prompt.parameters.responseFormat)
  const updatePromptParameter = usePromptStore(state => state.updatePromptParameter)

  const onCheckedChange = (checked: boolean) => {
    updatePromptParameter('responseFormat', checked ? 'json_object' : undefined)
  }

  return (
    <Switch
      checked={responseFormat === 'json_object'}
      onCheckedChange={onCheckedChange}
    />
  )
}

function ParameterModule () {
  const prompt = usePromptStore(state => state.prompt)
  const { parameters, batchConfigs } = prompt
  const updatePromptParameter = usePromptStore(state => state.updatePromptParameter)
  const isSupportResponseFormat = MODEL_SUPPORT_RESPONSE_FORMAT_MAP[parameters.model]

  const onConfigChange = <T extends keyof PromptParameters>(key: T, value: PromptParameters[T]) => {
    updatePromptParameter(key, value)
  }

  return (
    <div className='flex flex-wrap gap-x-8 gap-y-6 px-3 [&>:not(:first-child)]:flex-grow [&>:not(:first-child)]:w-[calc(50%-1rem)] [&>:not(:first-child)]:min-w-[300px]'>
      <div className='w-full'>
        <p className='font-bold mb-3'>Model</p>
        <ModelSelect />
      </div>
      <ParameterSilder
        label='Temperature'
        description='Controls randomness: Lowering results in less random completions. As the temperature approaches zero, the model will become deterministic and repetitive.'
        value={parameters.temperature}
        onValueChange={(val) => { onConfigChange('temperature', val) }}
        max={2}
        step={0.1}
      />
      <ParameterSilder
        label='N'
        description='How many results to generate for each input message. Recommend to set non-zero temperature in case N>1.'
        value={parameters.n}
        onValueChange={(val) => { onConfigChange('n', val) }}
        min={1}
        max={10}
        disabled={batchConfigs.length > 0}
      />
      <ParameterSilder
        label='Top P'
        description='Controls diversity via nucleus sampling: 0.5 means half of all likelihood-weighted options are considered.'
        value={parameters.topP}
        onValueChange={(val) => { onConfigChange('topP', val) }}
        max={1}
        step={0.01}
      />
      <ParameterSilder
        label='Frequency penalty'
        description='How much to penalize new tokens based on their existing frequency in the text so far. Decreases the model’s likelihood to repeat the same line verbatim.'
        value={parameters.frequencyPenalty}
        onValueChange={(val) => { onConfigChange('frequencyPenalty', val) }}
        min={-2}
        max={2}
        step={0.01}
      />
      <ParameterSilder
        label='Presence penalty'
        description='How much to penalize new tokens based on whether they appear in the text so far. Increases the model’s likelihood to talk about new topics.'
        value={parameters.presencePenalty}
        onValueChange={(val) => { onConfigChange('presencePenalty', val) }}
        min={-2}
        max={2}
        step={0.01}
      />
      <ParameterSilder
        label='Max tokens'
        description='The maximum number of tokens that can be generated in the chat completion. The exact limit varies by model. One token is roughly 4 characters for standard English text. Zero means no restriction.'
        value={parameters.maxTokens}
        onValueChange={(val) => { onConfigChange('maxTokens', val) }}
        max={MODEL_MAX_LENGTH_MAP[parameters.model]}
      />
      <div className='flex justify-between items-center gap-4'>
        <ParameterTitle title='Seed' message='Ensures consistent results for identical requests using the same seed and parameters.' />
        <Input
          className={cn(
            'w-32 h-8',
            // hide number input default arrow button
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
          )}
          type='number'
          defaultValue={parameters.seed}
          onBlur={(e) => { onConfigChange('seed', e.target.value === '' ? undefined : Number(e.target.value)) }}
        />
      </div>
      {isSupportResponseFormat
        ? (
          <div className='flex justify-between items-center gap-4'>
            <ParameterTitle title='JSON mode' message='Enable JSON mode which is constrained to only generate strings that parse into valid JSON object. Please also remember to instruct the model to produce JSON in your system message.' />
            <ResponseFormatSelect />
          </div>
        )
        // Add a empty element to prevent Seed spreading the entire width
        : <div />}
    </div>
  )
}

export default ParameterModule
