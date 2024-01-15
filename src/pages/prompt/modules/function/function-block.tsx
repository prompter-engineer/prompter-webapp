import { usePromptStore } from '@/store/prompt'
import FunctionEditor, { FUNCTION_JSON_SCHEMA } from './function-editor'
import { type ChangeEvent } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BlockContainer, BlockInput, BlockTextarea } from '../../components/block'
import IconButton from '@/components/icon-button'
import Delete from '@/assets/icons/delete.svg?react'
import { type Schema, Validator } from '@cfworker/json-schema'

const validator = new Validator(FUNCTION_JSON_SCHEMA as Schema)

interface FunctionBlockProps {
  index: number
  disabled?: boolean
}

const FunctionBlock: React.FC<FunctionBlockProps> = ({ index, disabled }) => {
  const PromptFunction = usePromptStore(state => state.prompt.functions[index])
  const updatePromptFunction = usePromptStore(state => state.updatePromptFunction)
  const removePromptFunction = usePromptStore(state => state.removePromptFunction)

  const onParametersChange = (value: string | undefined) => {
    const parameters = JSON.parse(value!)
    const result = validator.validate(parameters)
    if (result.valid) {
      updatePromptFunction(index, 'parameters', parameters)
    }
  }

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    updatePromptFunction(index, 'name', value)
  }

  const onDescriptionChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    updatePromptFunction(index, 'description', value)
  }

  const onMockChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    updatePromptFunction(index, 'mock', value)
  }

  const onTrash = () => {
    removePromptFunction(index)
  }

  if (PromptFunction === undefined) return null

  return (
    <BlockContainer className='relative group'>
      <IconButton
        className='absolute top-3 right-4 invisible group-hover:visible'
        Icon={Delete}
        onClick={onTrash}
      />
      <BlockInput
        className='font-bold pr-12'
        value={PromptFunction.name}
        onChange={onNameChange}
        placeholder='Function name...'
        disabled={disabled}
        maxLength={64}
      />
      <BlockTextarea
        className='py-3 text-sm border-none'
        value={PromptFunction.description ?? ''}
        onChange={onDescriptionChange}
        placeholder='Enter function description...'
        disabled={disabled}
      />
      <Tabs defaultValue="schema" className='p-2 bg-gray-900 rounded'>
        <TabsList>
          <TabsTrigger className='px-1.5 py-1' value="schema">Schema</TabsTrigger>
          <TabsTrigger className='px-1.5 py-1' value="mock">Mock</TabsTrigger>
        </TabsList>
        <TabsContent value="schema">
          <FunctionEditor
            defaultValue={JSON.stringify(PromptFunction.parameters, null, 2)}
            onChange={onParametersChange}
            options={{
              readOnly: disabled
            }}
          />
        </TabsContent>
        <TabsContent value="mock">
          <BlockTextarea
            className='border-none'
            placeholder='Please enter a mock value...'
            defaultValue={PromptFunction.mock}
            onChange={onMockChange}
          />
        </TabsContent>
      </Tabs>
    </BlockContainer>
  )
}

export default FunctionBlock
