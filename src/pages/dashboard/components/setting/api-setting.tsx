import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import Info from '@/assets/icons/info.svg?react'
import { useUserStore } from '@/store/user'
import { useMutation } from '@tanstack/react-query'
import { updateUserSetting } from '@/request/user'
import { type ResponseError } from '@/request/fetcher'
import Loading from '@/components/loading'
import { cn } from '@/lib/utils'

enum SETTING_STATUS {
  SUCCEED,
  ERROR
}

function APISetting () {
  const api = useUserStore(state => state.user!.openaiSettings)
  const updateOpenaiSettings = useUserStore(state => state.updateOpenaiSettings)
  const [apiKey, setApiKey] = useState(api.apiKey ?? '')
  const [customize, setCustomize] = useState(api.isCustom)
  const [apiEndpoint, setApiEndpoint] = useState(api.customEndpoint)
  const [result, setResult] = useState<{ status: SETTING_STATUS, text: string }>()
  const { isPending: loading, mutateAsync } = useMutation({
    mutationFn: updateUserSetting,
    onSuccess: (_, variables) => {
      updateOpenaiSettings(variables.openaiSettings)
      setResult({
        status: SETTING_STATUS.SUCCEED,
        text: 'Successfully to set API configuration.'
      })
    },
    onError: (error) => {
      setResult({
        status: SETTING_STATUS.ERROR,
        text: (error as ResponseError).message
      })
    }
  })

  async function onSubmit () {
    setResult(undefined)
    await mutateAsync({
      openaiSettings: {
        apiKey,
        isCustom: customize,
        customEndpoint: apiEndpoint
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">API Setting</h3>
        <p className="text-sm text-muted-foreground">
          Please note that both the API key and endpoint URL will be stored in your browser&apos;s local storage and will only be used for direct communication with OpenAI or your custom endpoint.
        </p>
      </div>
      <Separator />
      <div>
        <Tooltip>
          <TooltipTrigger className='flex items-center mb-3'>
            <Label className='block'>API Key</Label>
            <Info className='ml-2 w-4 h-4' strokeWidth={1.5} />
          </TooltipTrigger>
          <TooltipContent className='max-w-sm'>
            Please provide your OpenAI Key or the URL for your custom API endpoint along with the corresponding API key in order to execute the prompts.
            You can obtain the OpenAI API key from your <a className='underline' href='https://platform.openai.com/account/api-keys'>OpenAI Account Profile</a>.
          </TooltipContent>
        </Tooltip>
        <Input value={apiKey} onChange={(e) => { setApiKey(e.target.value) }} placeholder='sk-XXXXXXXXXXXXXXXXXXXXXXXXXX' />
      </div>
      <div>
        <div className='mb-3 flex justify-between items-center'>
          <Label>Custom API Endpoint</Label>
          <Switch checked={customize} onCheckedChange={setCustomize} />
        </div>
        <Input
          value={apiEndpoint}
          onChange={(e) => { setApiEndpoint(e.target.value) }}
          disabled={!customize}
          placeholder='https://www.yourcustomendpoint.com'
        />
      </div>
      <div>
        <Button onClick={onSubmit} disabled={loading}>
          {loading ? <Loading /> : 'Save'}
        </Button>
        {result ? <p className={cn('pt-2', { 'text-green-500': result.status === SETTING_STATUS.SUCCEED, 'text-red-600': result.status === SETTING_STATUS.ERROR })}>{result.text}</p> : null}
      </div>
    </div>
  )
}

export default APISetting
