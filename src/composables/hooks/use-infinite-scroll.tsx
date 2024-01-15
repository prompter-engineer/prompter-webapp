import { useEventListener } from 'ahooks'
import { getTargetElement, type BasicTarget } from 'ahooks/lib/utils/domTarget'

const getScrollTop = (el: Document | Element) => {
  if (el === document || el === document.documentElement || el === document.body) {
    return Math.max(
      window.scrollY,
      document.documentElement.scrollTop,
      document.body.scrollTop
    )
  }
  return (el as Element).scrollTop
}

const getScrollHeight = (el: Document | Element) => {
  return (
    (el as Element).scrollHeight ||
    Math.max(document.documentElement.scrollHeight, document.body.scrollHeight)
  )
}

const getClientHeight = (el: Document | Element) => {
  return (
    (el as Element).clientHeight ||
    Math.max(document.documentElement.clientHeight, document.body.clientHeight)
  )
}

export interface UseInfiniteScrollOptions {
  disabled?: boolean
  /**
   * The minimum distance between the bottom of the element and the bottom of the viewport
   *
   * @default 0
   */
  distance?: number

  /**
   * The direction in which to listen the scroll.
   *
   * @default 'bottom'
   */
  direction?: 'top' | 'bottom' | 'left' | 'right'

  /**
   * The interval time between two load more (to avoid too many invokes).
   *
   * @default 100
   */
  interval?: number
}

const useInfiniteScroll = (element: BasicTarget<Element | Document>, onLoad: () => Promise<void> | void, options: UseInfiniteScrollOptions = {}) => {
  const { disabled = false, distance = 0, interval = 100 } = options
  const promise = useRef<Promise<any> | null>(null)

  const checkAndLoad = () => {
    let el = getTargetElement(element)
    if (!el) return

    if (el === document) {
      el = document.documentElement
    }
    const scrollTop = getScrollTop(el)
    const scrollHeight = getScrollHeight(el)
    const clientHeight = getClientHeight(el)

    if (scrollHeight - scrollTop <= clientHeight + distance) {
      if (promise.current !== null) return
      promise.current = Promise.all([
        onLoad(),
        new Promise(resolve => setTimeout(resolve, interval))
      ]).finally(() => {
        promise.current = null
        checkAndLoad()
      })
    }
  }

  useEventListener('scroll', () => {
    if (disabled) return
    checkAndLoad()
  }, { target: element })
}

export default useInfiniteScroll
