import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import HistoryContent from './history-content'
import History from '@/assets/icons/history.svg?react'

const HistoryToggle: React.FC<{
  className?: string
}> = (props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size='icon'
          {...props}
        >
          <History strokeWidth={1.5} />
        </Button>
      </SheetTrigger>
      <SheetContent className='flex flex-col p-0 gap-0 w-3/4 bg-gray-700 sm:max-w-none' onOpenAutoFocus={(e) => { e.preventDefault() }}>
        <HistoryContent />
      </SheetContent>
    </Sheet>
  )
}

export default HistoryToggle
