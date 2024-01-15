import { DEFAULT_HISTORY_SETTING } from '@/composables/config'
import { type SettingStoreState } from '../interface/setting'

/**
 * update V0 to V1
 * history: add `history` setting, and add `star`/`hidden` filters
 */
export const migrateV0 = (persistedState: SettingStoreState) => {
  persistedState.history = DEFAULT_HISTORY_SETTING
}
