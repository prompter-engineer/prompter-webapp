export interface APISetting {
  apiKey?: string
  /**
   * support use customize api endpoint
   */
  isCustom: boolean
  customEndpoint?: string
}

export interface User {
  name: string
  token: string
  email: string
  openaiSettings: APISetting
  newcomer?: boolean
}
