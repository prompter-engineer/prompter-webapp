import { type HISTORY_LABEL, type PromptHistory } from '@/entities/history'
import { fetcher } from './fetcher'

export const retrieveHistoryListOfPrompt = async (data: {
  promptId: string
  pageSize: number
  pageIndex: number
  filter: {
    label: number[]
  }
}) => {
  return await fetcher<{
    reachLimit: boolean
    histories: PromptHistory[]
  }>('/history/list', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const createPromptHistory = async (data: {
  promptId: string
  history: Omit<PromptHistory, 'id'>
}) => {
  return await fetcher<PromptHistory>('/history/add', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const updatePromptHistoryLabel = async (data: {
  id: string
  label: HISTORY_LABEL
}) => {
  return await fetcher<boolean>('/history/label', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const clearPromptHistoryList = async (data: {
  promptId: string
}) => {
  return await fetcher<boolean>('/history/removeall', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
