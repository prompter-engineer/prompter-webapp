import { retrieveUserProfile } from '@/request/user'
import { useQuery } from '@tanstack/react-query'
import './index.css'
import Upgrade from '@/assets/icons/upgrade.svg?react'

const UpgradeButton = () => {
  const { data: user } = useQuery({
    queryKey: ['/user/me'],
    queryFn: retrieveUserProfile
  })

  if (!user || user.membership === 'plus') return null

  return (
    <Link to='/pricing' className="upgrade-button flex items-center gap-1.5 px-3 py-1 h-[30px]">
      <Upgrade width={16} height={16} strokeWidth={1.5} />
      <span className='upgrade-button__text'>Upgrade to Plus | Dive in</span>
    </Link>
  )
}

export default UpgradeButton
