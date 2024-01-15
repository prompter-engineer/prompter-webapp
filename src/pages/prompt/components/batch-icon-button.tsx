import IconButton from '@/components/icon-button'
import Batch from '@/assets/icons/batch.svg?react'
import TooltipPro from '@/components/tooltip-pro'

const BatchIconButton: React.FC<{
  expand: boolean
  disabled?: boolean
  onBatchChange: (expand: boolean) => void
}> = ({ expand, disabled, onBatchChange }) => {
  return (
    <TooltipPro message={expand ? 'Click to exit batch request mode.' : 'Click to input multiple candidates for parallelized evaluation.'}>
      <IconButton Icon={Batch} onClick={() => { if (!disabled) { onBatchChange?.(!expand) } }} disabled={disabled} />
    </TooltipPro>
  )
}

export default BatchIconButton
