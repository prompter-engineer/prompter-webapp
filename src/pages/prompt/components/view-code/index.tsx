import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { type BatchConfig, type PromptConfig } from '@/entities/prompt'
import { mergeConfig } from '@/lib/prompt'
import { usePromptStore } from '@/store/prompt'
import { generateJSONCode, generateNodeCode, generatePythonCode, generatecURLCode } from './code-generate'
import hljs from '@/lib/hljs'
import { filterPromptConfig, transformPromptConfig } from '@/request/completion'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CopyButton from './copy-button'
import { DialogClose } from '@radix-ui/react-dialog'
import { useSettingStore } from '@/store/setting'

const ViewCodeBlock: React.FC<{
  code: string
  language: string
  className?: string
}> = ({ code, language, className }) => {
  const ref = useRef<HTMLElement>(null)
  const hightlighted = useMemo(() => {
    return {
      __html: hljs.highlight(code, {
        language
      }).value
    }
  }, [code, language])

  return (
    <pre className={className}>
      <code ref={ref} className='block min-w-fit bg-transparent text-sm' dangerouslySetInnerHTML={hightlighted} />
    </pre>
  )
}

const ViewCodeContent: React.FC<{
  batchConfig?: BatchConfig
}> = ({ batchConfig }) => {
  const prompt = usePromptStore(state => state.prompt)
  const language = useSettingStore(state => state.preview ?? 'bash')
  const updatePreviewConfig = useSettingStore(state => state.updatePreviewConfig)
  const code = useMemo(() => {
    let rawConfig: PromptConfig = {
      parameters: prompt.parameters,
      messages: prompt.messages,
      variables: prompt.variables,
      toolChoice: prompt.toolChoice,
      functions: prompt.functions
    }
    if (batchConfig) {
      rawConfig = mergeConfig(rawConfig, batchConfig)
    }
    const config = filterPromptConfig(rawConfig)
    const request = transformPromptConfig(config)
    if (language === 'python') {
      return generatePythonCode(request)
    } else if (language === 'bash') {
      return generatecURLCode(request)
    } else if (language === 'json') {
      return generateJSONCode(request)
    } else if (language === 'javascript') {
      return generateNodeCode(request)
    }
    return ''
  }, [prompt, language, batchConfig])

  return (
    <div className='view-code__content flex flex-col rounded overflow-hidden bg-card border'>
      <div className='flex items-center gap-2 px-4 py-2'>
        <p className='text-sm font-medium'>POST /v1/chat/completions</p>
        <Select value={language} onValueChange={updatePreviewConfig}>
          <SelectTrigger className="ml-auto w-auto h-auto gap-1.5 px-2 py-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="bash">cURL</SelectItem>
            <SelectItem value="python">Python</SelectItem>
            <SelectItem value="javascript">Node.js</SelectItem>
            <SelectItem value="json">JSON</SelectItem>
          </SelectContent>
        </Select>
        <CopyButton text={code} />
      </div>
      <ViewCodeBlock className='flex-1 p-4 h-0 bg-gray-900 overflow-auto' code={code} language={language} />
    </div>
  )
}

export const ViewCodeDialog: React.FC<{
  batchConfig?: BatchConfig
  children?: React.ReactNode
}> = ({ children, batchConfig }) => {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className='flex flex-col max-w-[50%] max-h-[80%]'>
        <DialogHeader>
          <DialogTitle>Preview</DialogTitle>
          <DialogDescription>
            Use this code snippet to integrate your prompts and settings into your application.
          </DialogDescription>
        </DialogHeader>
        <ViewCodeContent batchConfig={batchConfig} />
        <p className='text-sm text-muted-foreground'>Utilize your unique API key and adjust the endpoint URL as needed. Implement environment variables or a secret management tool to securely integrate your key into your applications.</p>
        <DialogFooter className='pt-2'>
          <DialogClose asChild>
            <Button size='sm'>Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
