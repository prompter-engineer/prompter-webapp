import { type Prompt } from '@/entities/prompt'
import { fetcher } from './fetcher'

export const retrievePromptListOfSuite = async (suiteId: string) => {
  return await fetcher<Prompt[]>(`/prompt/list?suiteId=${suiteId}`)
}

export const createPrompt = async (data: {
  name: string
  suiteId: string
}) => {
  return await fetcher<Prompt>('/prompt/create', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const duplicatePrompt = async (data: {
  promptId: string
}) => {
  return await fetcher<Prompt>('/prompt/duplicate', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const updatePrompt = async (data: Prompt) => {
  return await fetcher<Prompt>('/prompt/sync', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const updatePromptName = async (data: {
  id: string
  name: string
}) => {
  return await fetcher<Prompt>('/prompt/rename', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const removePrompt = async (data: {
  id: string
}) => {
  return await fetcher<null>('/prompt/remove', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const retrievePrompt = async (data: { id: string }) => {
  return await fetcher<Prompt>(`/prompt/get?id=${data.id}`)
}
