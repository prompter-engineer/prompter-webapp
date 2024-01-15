import { useSettingStore } from '@/store/setting'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import IconButton from '@/components/icon-button'
import Filter from '@/assets/icons/filter.svg?react'

const HistoryFilter = () => {
  const filter = useSettingStore(state => state.history.filter)
  const updateHistroyFilterConfig = useSettingStore(state => state.updateHistroyFilterConfig)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton Icon={Filter} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Rating</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(['liked', 'disliked', 'unmarked'] as const).map(item => (
          <DropdownMenuCheckboxItem
            key={item}
            className="capitalize"
            checked={filter[item]}
            onCheckedChange={(value) => { updateHistroyFilterConfig(item, !!value) }}
          >
            {item}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default HistoryFilter
