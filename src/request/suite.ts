import { type PromptSuite } from '@/entities/suite'
import { fetcher } from './fetcher'

export const retrievePromptSuiteList = async () => {
  return await fetcher<PromptSuite[]>('/suite/list')
}

export const createPromptSuite = async (data: {
  name: string
}) => {
  return await fetcher<PromptSuite>('/suite/create', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const updatePromptSuite = async (data: {
  id: string
  name: string
}) => {
  return await fetcher<PromptSuite>('/suite/update', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}

export const deletePromptSuite = async (data: {
  id: string
}) => {
  return await fetcher<null>('/suite/remove', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
