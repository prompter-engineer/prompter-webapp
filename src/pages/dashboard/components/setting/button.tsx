import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import SettingContent from './content'
import { useUserStore } from '@/store/user'
import Settings from '@/assets/icons/settings.svg?react'

function SettingButton () {
  const apiKey = useUserStore(state => state.user?.openaiSettings.apiKey)
  const [open, setOpen] = useState(apiKey == null)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button id="open-setting-button" variant="ghost" size="icon">
          <Settings className='text-gray-300 h-8 w-8' strokeWidth={1.5} />
        </Button>
      </DialogTrigger>
      <SettingContent />
    </Dialog>
  )
}

export default SettingButton
