import { cn } from '@/lib/utils'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { DialogContent } from '@/components/ui/dialog'
import APISetting from './api-setting'

const items = [
  {
    title: 'API'
  }
]

function SettingContent () {
  const [current, setCurrent] = useState(0)

  return (
    <DialogContent id="setting-dialog" className='max-w-2xl' onPointerDownOutside={(e) => { e.preventDefault() }}>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
      </div>
      <Separator className="my-1" />
      <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-6 lg:space-y-0">
        <aside className="lg:w-1/5">
          <nav
            className={cn(
              'flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1'
            )}
          >
            {items.map((item, index) => (
              <Button
                key={index}
                variant='ghost'
                className={cn(
                  current === index
                    ? 'bg-muted hover:bg-muted'
                    : 'hover:bg-transparent hover:underline',
                  'justify-start'
                )}
                onClick={() => { setCurrent(index) }}
              >
                {item.title}
              </Button>
            ))}
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          {current === 0 ? <APISetting /> : null}
        </div>
      </div>
    </DialogContent>
  )
}

export default SettingContent
