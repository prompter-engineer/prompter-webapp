import { defineMap } from '@preflower/utils'
import { type HistorySetting, type Theme } from '@/entities/setting'

export const DEFAULT_API_ENDPOINT = 'https://api.openai.com/v1/chat/completions'

export const DEFAULT_THEME_SETTING: Theme = 'dark'

export const DEFAULT_HISTORY_SETTING: HistorySetting = {
  filter: {
    liked: true,
    disliked: false,
    unmarked: true
  }
}

export const DEFAULT_FUNCTION_CALL = 'auto'

export const MODELS = [
  { name: 'gpt-3.5-turbo', maxTokens: 4096, maxLength: 4000, supportFunction: true, supportResponseFormat: false },
  { name: 'gpt-3.5-turbo-1106', maxTokens: 16385, maxLength: 16000, supportFunction: true, supportResponseFormat: true },
  { name: 'gpt-3.5-turbo-16k', maxTokens: 16384, maxLength: 16000, supportFunction: true, supportResponseFormat: false },
  { name: 'gpt-3.5-turbo-0613', maxTokens: 4096, maxLength: 4000, supportFunction: true, supportResponseFormat: false },
  { name: 'gpt-3.5-turbo-0301', maxTokens: 4096, maxLength: 4000, supportFunction: false, supportResponseFormat: false },
  { name: 'gpt-3.5-turbo-16k-0613', maxTokens: 16384, maxLength: 16000, supportFunction: true, supportResponseFormat: false },
  { name: 'gpt-4', maxTokens: 8192, maxLength: 8000, supportFunction: true, supportResponseFormat: false },
  { name: 'gpt-4-1106-preview', maxTokens: 128000, maxLength: 128000, supportFunction: true, supportResponseFormat: true },
  { name: 'gpt-4-0613', maxTokens: 8192, maxLength: 8000, supportFunction: true, supportResponseFormat: false },
  { name: 'gpt-4-0314', maxTokens: 8192, maxLength: 8000, supportFunction: false, supportResponseFormat: false },
  { name: 'gpt-4-32k', maxTokens: 32768, maxLength: 32000, supportFunction: true, supportResponseFormat: false },
  { name: 'gpt-4-32k-0613', maxTokens: 32768, maxLength: 32000, supportFunction: true, supportResponseFormat: false },
  { name: 'gpt-4-32k-0314', maxTokens: 32768, maxLength: 32000, supportFunction: false, supportResponseFormat: false }
]

export const MODEL_MAX_LENGTH_MAP = defineMap(MODELS, 'name', 'maxLength')

export const MODEL_SUPPORT_FUNCTION_MAP = defineMap(MODELS, 'name', 'supportFunction')

export const MODEL_SUPPORT_RESPONSE_FORMAT_MAP = defineMap(MODELS, 'name', 'supportResponseFormat')

export const RESPONSE_FORMATS = [
  { type: 'text', name: 'Text' },
  { type: 'json_object', name: 'JSON' }
]

export const RESPONSE_FORMAT_NAME_MAP = defineMap(RESPONSE_FORMATS, 'type', 'name')
