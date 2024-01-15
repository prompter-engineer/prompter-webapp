import { useBatchResult } from './hooks/use-batch-request'
import ResultCard from '../../components/result-card'
import { BlockTitleBar } from '../../components/block'
import LayoutFallback from '@/components/layout-fallback'
import ErrorCard from '@/components/error-card'

const BatchItemResult: React.FC<{
  batchConfigIndex: number
}> = ({ batchConfigIndex }) => {
  const {
    data,
    error,
    isMutating
  } = useBatchResult(batchConfigIndex)

  if (!isMutating && !data && error === null) return null

  const Content = () => {
    if (isMutating) {
      return <LayoutFallback />
    } else if (error !== null) {
      return (
        <ErrorCard>{error.message}</ErrorCard>
      )
    } else {
      return (
        data?.map(completion => (
          <ResultCard key={completion.id} completionId={completion.id} />
        ))
      )
    }
  }

  return (
    <div className='flex flex-col relative shrink-0 w-1/2 space-y-6'>
      <BlockTitleBar
        className='text-sm h-7'
        title='Result'
      />
      <div className='flex flex-1 flex-col gap-2'>
        <Content />
      </div>
    </div>
  )
}

export default BatchItemResult
