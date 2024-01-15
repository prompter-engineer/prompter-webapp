import { usePromptStore } from '@/store/prompt'
import VariableBlock from './variable-block'
import NewButtonWithDivider from '@/components/new-button-with-divider'

const VariableEmpty = () => {
  return (
    <p className='px-4 py-3 border border-dashed border-purple-500 bg-purple-500/5 rounded text-sm'>
      Create a new variable by entering the variable name and its value.
      When using the variables, enclose the variable name with double curly braces
      <span className='text-accent'> &#123;&#123; </span> and
      <span className='text-accent'> &#125;&#125; </span>
      in the Messages tab. You can also test variables in batches by clicking the Batch Request button.
    </p>
  )
}

const VariableNewButton = () => {
  const createPromptVariable = usePromptStore(state => state.createPromptVariable)

  const onCreate = () => {
    createPromptVariable()
  }

  return (
    <NewButtonWithDivider className='mt-6' onClick={onCreate} />
  )
}

const VariableModule = () => {
  const variables = usePromptStore(state => state.prompt.variables)

  return (
    <div className='px-3 pb-3'>
      <div className="flex flex-col gap-5">
        {variables?.map((variable) => (
          <VariableBlock
            key={variable.id}
            variable={variable}
          />
        ))}
        {variables.length ? null : <VariableEmpty />}
      </div>
      <VariableNewButton />
    </div>
  )
}

export default VariableModule
