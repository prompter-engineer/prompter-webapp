import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import type * as SliderPrimitive from '@radix-ui/react-slider'
import ParameterTitle from './parameter-title'

const ParameterSilder: React.FC<Omit<React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>, 'value' | 'onValueChange'> & {
  label: string
  description: string
  value: number
  onValueChange: (value: number) => void
}> = ({ label, description, min = 0, max = 100, step = 1, value, onValueChange, ...props }) => {
  const [inputValue, setInputValue] = useState<string>(String(value))

  useEffect(() => {
    setInputValue(String(value))
  }, [setInputValue, value])

  const onInputBlur = (el: React.ChangeEvent<HTMLInputElement>) => {
    const decimal = Math.abs(Math.log10(step))
    const val = Number(Number(el.target.value).toFixed(decimal))
    if (val > max) {
      onValueChange(max)
      setInputValue(String(max))
    } else if (val < min) {
      onValueChange(min)
      setInputValue(String(min))
    } else {
      setInputValue(String(val))
      onValueChange(val)
    }
  }

  const onSliderChange = (val: number[]) => {
    onValueChange(val[0])
  }

  return (
    <div>
      <div className='flex justify-between mb-3'>
        <ParameterTitle title={label} message={description} />
        <Input
          className={cn(
            'inline-flex w-32 h-8',
            // hide number input default arrow button
            '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
          )}
          type='number'
          value={inputValue}
          onChange={(e) => { setInputValue(e.target.value) }}
          onBlur={onInputBlur}
          disabled={props.disabled}
        />
      </div>
      <Slider
        defaultValue={[50]}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={onSliderChange}
        {...props}
      />
    </div>
  )
}

export default ParameterSilder
