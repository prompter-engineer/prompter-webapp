import { BlockContainer, BlockInput, BlockTextarea } from '../../components/block'
import { usePromptStore } from '@/store/prompt'
import { type Variable } from '@/entities/prompt'
import BatchIconButton from '../../components/batch-icon-button'
import IconButton from '@/components/icon-button'
import { cn } from '@/lib/utils'
import Delete from '@/assets/icons/delete.svg?react'

const VariableBlock: React.FC<{
  variable: Variable
}> = ({ variable }) => {
  const updatePromptVariable = usePromptStore(state => state.updatePromptVariable)
  const removePromptVariable = usePromptStore(state => state.removePromptVariable)
  const insertPromptBatchConfigChild = usePromptStore(state => state.insertPromptBatchConfigChild)
  const removePromptBatchConfigVariable = usePromptStore(state => state.removePromptBatchConfigVariable)

  const n = usePromptStore(state => state.prompt.parameters.n)
  const isActiveInBatchConfig = usePromptStore(state => {
    const variables = state.prompt.batchConfigs?.[0]?.variables
    if (variables) {
      return variables.findIndex(v => v.id === variable.id) !== -1
    }
    return false
  })

  const onVariableChange = <T extends keyof Variable>(key: T, value: Variable[T]) => {
    updatePromptVariable(Object.assign({}, variable, { [key]: value }))
  }

  const onRemove = () => {
    removePromptVariable(variable.id)
  }

  const onBatchChange = (expand: boolean) => {
    if (expand) {
      insertPromptBatchConfigChild('variables', variable)
    } else {
      removePromptBatchConfigVariable(variable.id)
    }
  }

  return (
    <BlockContainer className={cn('relative group', isActiveInBatchConfig ? 'bg-card/50' : null)}>
      <BlockInput
        className='mb-3 pr-16 font-bold'
        placeholder='Enter the name...'
        value={variable.key}
        disabled={isActiveInBatchConfig}
        onChange={e => { onVariableChange('key', e.target.value) }}
        autoFocus
      />
      <BlockTextarea
        className='pr-10'
        placeholder='Enter the variable value...'
        value={variable.value}
        disabled={isActiveInBatchConfig}
        onChange={e => { onVariableChange('value', e.target.value) }}
      />
      <div className={cn('absolute right-4 top-3 flex gap-1.5 p-1', isActiveInBatchConfig ? null : 'invisible group-hover:visible')}>
        {isActiveInBatchConfig
          ? null
          : (
            <IconButton Icon={Delete} onClick={onRemove} />
          )}
        <BatchIconButton expand={isActiveInBatchConfig} onBatchChange={onBatchChange} disabled={n > 1} />
      </div>
    </BlockContainer>
  )
}

export default VariableBlock
