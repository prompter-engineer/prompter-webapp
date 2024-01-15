import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { type Setting } from '@/entities/setting'
import { DEFAULT_HISTORY_SETTING, DEFAULT_THEME_SETTING } from '@/composables/config'
import { migrateV0 } from './migrate/setting'
import { type SettingStoreState } from './interface/setting'

export const useSettingStore = create(persist(
  immer<SettingStoreState>(
    (set) => ({
      prompt: undefined,
      theme: DEFAULT_THEME_SETTING,
      history: DEFAULT_HISTORY_SETTING,
      updateThemeConfig: (theme) => {
        set((draft: Setting) => {
          draft.theme = theme
        })
      },
      updatePreviewConfig: (preview) => {
        set((draft: Setting) => {
          draft.preview = preview
        })
      },
      updateHistroyFilterConfig: (key, value) => {
        set((draft: Setting) => {
          draft.history.filter[key] = value
        })
      }
    })
  ), {
    name: 'prompter_setting',
    version: 1,
    migrate: (persistedState, version) => {
      switch (version) {
        case 0:
          migrateV0(persistedState as SettingStoreState)
      }
      return persistedState as SettingStoreState
    }
  })
)
