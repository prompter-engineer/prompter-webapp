import { type PromptConfig } from '@/entities/prompt'
import { getCompletion } from '@/request/completion'
import { useMutation } from '@tanstack/react-query'

const TRIGGERS: Record<number, (config: PromptConfig) => Promise<any>> = {}

/**
 * get the trigger method of specified batch item with index.
 */
export const useBatchResult = (index: number) => {
  const { promptId } = useParams()
  const {
    data,
    error,
    mutateAsync,
    isPending
  } = useMutation({
    mutationFn: getCompletion
  })

  useEffect(() => {
    TRIGGERS[index] = async (config) => {
      if (isPending) return
      return await mutateAsync({
        promptId: promptId!,
        config
      })
    }

    return () => {
      Reflect.deleteProperty(TRIGGERS, index)
    }
  }, [promptId, index, isPending, mutateAsync])

  return { data, error, isMutating: isPending }
}

export const useBatchConfig = () => {
  const trigger = async (index: number, config: PromptConfig) => {
    await TRIGGERS[index](config)
  }

  return { trigger }
}
