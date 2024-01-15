export type Theme = 'dark' | 'light' | 'system'

export type Preview = 'curl' | 'python' | 'javascript' | 'json'

export interface HistoryFilter {
  liked?: boolean
  disliked?: boolean
  unmarked?: boolean
}

export interface HistorySetting {
  filter: HistoryFilter
}

export interface Setting {
  theme: Theme
  preview?: Preview
  history: HistorySetting
}
