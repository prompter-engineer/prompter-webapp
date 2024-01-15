import useNewcomerGuide from './use-newcomer-guide'
import { useUserStore } from '@/store/user'

const NewcomerGuide = () => {
  const isNewcomer = useUserStore(state => state.user?.newcomer)
  const [start] = useNewcomerGuide()

  useEffect(() => {
    if (isNewcomer) {
      start()
    }
  }, [isNewcomer])

  return null
}

export default NewcomerGuide
