import { usePromptStore, usePromptStoreInstance } from '@/store/prompt'
import { BlockTextarea } from '../../components/block'
import { produce } from 'immer'
import { type Variable } from '@/entities/prompt'

export const BatchVariableBlock: React.FC<{
  batchConfigIndex: number
  variable: Variable
}> = ({ batchConfigIndex, variable }) => {
  const promptStore = usePromptStoreInstance()
  const updatePromptBatchConfigChild = usePromptStore(state => state.updatePromptBatchConfigChild)

  const onTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const prompt = promptStore.getState().prompt
    const rawVariables = prompt.batchConfigs?.[batchConfigIndex].variables
    if (rawVariables) {
      const variables = produce(rawVariables, (draft: Variable[]) => {
        const v = draft.find(v => v.id === variable.id)
        if (v) v.value = e.target.value
      })
      updatePromptBatchConfigChild(batchConfigIndex, 'variables', variables)
    } else {
      console.warn('variables is undefined, please check is correct.')
    }
  }

  return (
    <div>
      <p className='pb-1 font-bold text-gray-300'>
        <span className='text-purple-500'>$ </span>
        {variable.key}
      </p>
      <BlockTextarea
        value={variable.value}
        onChange={onTextChange}
        placeholder='Enter a variable value here...'
      />
    </div>
  )
}
