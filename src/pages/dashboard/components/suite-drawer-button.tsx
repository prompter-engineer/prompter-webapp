import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger
} from '@/components/ui/sheet'
import SuiteMenubar from './suite-menubar/menubar'
import LogoWithNameImage from '@/assets/logo-with-name.png'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import IconButton from '@/components/icon-button'
import ArrowLeft from '@/assets/icons/arrow-left.svg?react'
import Menu from '@/assets/icons/menu.svg?react'

function SuiteDrawerButton () {
  return (
    <Sheet>
      <Tooltip>
        <SheetTrigger asChild>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className='w-8 h-8' strokeWidth={1.5} />
            </Button>
          </TooltipTrigger>
        </SheetTrigger>
        <SheetContent className='px-4 py-5' side='left'>
          <div className='flex justify-between items-center'>
            <img className='h-7' src={LogoWithNameImage} alt='prompter' />
            <SheetClose asChild>
              <IconButton Icon={ArrowLeft} iconSize={16} strokeWidth={1} />
            </SheetClose>
          </div>
          <SuiteMenubar />
        </SheetContent>
        <TooltipContent className='max-w-sm' side='right'>
        Menu
        </TooltipContent>
      </Tooltip>
    </Sheet>
  )
}

export default SuiteDrawerButton
