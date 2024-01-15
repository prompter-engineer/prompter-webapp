import { type APISetting, type User } from '@/entities/user'
import { fetcher } from './fetcher'
import { useUserStore } from '@/store/user'

export interface ServerUser extends User {
  latestPromptId: string
  name: string
  membership: string
  subscription: string
}

export const sendOTP = async (email: string) => {
  return await fetcher<boolean>('/user/sendotp', {
    method: 'POST',
    body: JSON.stringify({
      email
    })
  })
}

export const loginWithEmail = async (data: { email: string, otp: string }) => {
  const user = await fetcher<ServerUser>('/user/login/email', {
    method: 'POST',
    body: JSON.stringify(data)
  })
  const login = useUserStore.getState().login
  login(user)
  return user
}

export const loginWithGoogle = async (code: string) => {
  const user = await fetcher<ServerUser>('/user/login/google', {
    method: 'POST',
    body: JSON.stringify({
      code
    })
  })
  const login = useUserStore.getState().login
  login(user)
  return user
}

export const createStripePayment = async (mode: 'year' | 'month') => {
  const result = await fetcher<{
    url: string
  }>('/order/stripe/pay', {
    method: 'POST',
    body: JSON.stringify({
      subscription: mode
    })
  })
  // Avoid page block caused by gtag exceptions
  try {
    gtag('event', 'begin_checkout')
  } catch (e) {
    console.log(e)
  }
  return result
}

export const retrieveStripeManageLink = async () => {
  return await fetcher<{
    url: string
  }>('/order/stripe/manage')
}

export const retrieveUserProfile = async () => {
  const user = await fetcher<ServerUser>('/user/me')
  const updateUserInfo = useUserStore.getState().updateUserInfo
  updateUserInfo('name', user.name)
  return user
}

export const updateUserProfile = async (user: Partial<ServerUser>) => {
  return await fetcher<ServerUser>('/user/me', {
    method: 'POST',
    body: JSON.stringify(user)
  })
}

export const updateUserSetting = async (data: {
  openaiSettings: APISetting
}) => {
  return await fetcher<null>('/settings/api', {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
