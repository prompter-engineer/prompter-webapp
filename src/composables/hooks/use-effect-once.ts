import { type EffectCallback, useEffect } from 'react'

/**
 * fix React strict mode causse init effect trigger twice problem
 * @param effect
 */
const useEffectOnce = (effect: EffectCallback) => {
  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const destructor = effect()

      return () => {
        destructor?.()
      }
    }
  }, [])
}

export default useEffectOnce
