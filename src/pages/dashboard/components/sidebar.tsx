import SuiteDrawerButton from './suite-drawer-button'
import Logo from '@/assets/logo.png'
import { buttonVariants } from '@/components/ui/button'
import Discord from '@/assets/icons/discord.svg?react'
import SettingButton from './setting/button'
import { useUserStore } from '@/store/user'
import Guide from '@/assets/icons/guide.svg?react'

const ProfileButton = () => {
  const user = useUserStore(state => state.user)

  if (!user) return null

  return (
    <Link className={ buttonVariants({ variant: 'ghost', size: 'icon' })} to='/profile'>
      <span className='inline-flex justify-center items-center w-9 h-9 bg-gray-100 rounded-full capitalize text-gray-900 font-bold'>{user.email.at(0)}</span>
    </Link>
  )
}

function SideBar () {
  return (
    <div className="flex flex-col h-full bg-gray-900 w-[60px] shrink-0">
      <div className="flex items-center justify-center h-16">
        <Link to='/'>
          <img
            className='h-8'
            src={Logo}
            alt='prompter'
          />
        </Link>
      </div>
      <div className='flex flex-col items-center pt-6 px-2 pb-10 flex-1'>
        <SuiteDrawerButton />
        <div className='mt-auto flex flex-col items-center gap-4'>
          <ProfileButton />
          <SettingButton />
          <div className='w-[28px] h-[1px] bg-gray-600' />
          <a
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            href='https://discord.gg/u8Vngyvp4M'
            target='_blank'
            rel="noreferrer"
          >
            <Discord className='text-gray-300 h-8 w-8' strokeWidth={1.5} />
          </a>
          <a
            className={buttonVariants({ variant: 'ghost', size: 'icon' })}
            href='https://prompter.engineer/docs'
            target='_blank'
            rel="noreferrer"
          >
            <Guide
              className='text-gray-300 h-8 w-8'
              strokeWidth={1.5}
            />
          </a>
        </div>
      </div>
    </div>
  )
}

export default SideBar
