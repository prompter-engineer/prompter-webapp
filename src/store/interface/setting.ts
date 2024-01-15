import { type HistoryFilter, type Theme, type Setting, type Preview } from '@/entities/setting'

export interface Action {
  updateThemeConfig: (theme: Theme) => void
  updatePreviewConfig: (preview: Preview) => void
  updateHistroyFilterConfig: <T extends keyof HistoryFilter>(key: T, value: HistoryFilter[T]) => void
}

export type SettingStoreState = Setting & Action
