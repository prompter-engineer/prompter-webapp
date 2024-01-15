import { create } from 'zustand'
import { persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import { type APISetting, type User } from '@/entities/user'
import { type Prompt } from '@/entities/prompt'
import { type ServerUser } from '@/request/user'

interface State {
  user?: User
  lastPrompt?: {
    id: string
    suiteId?: string
  }
}

interface Action {
  login: (user: ServerUser) => void
  updateUserInfo: <T extends keyof User>(key: T, value: User[T]) => void
  updateUserLastPrompt: (prompt: Pick<Prompt, 'id' | 'suiteId'>) => void
  updateOpenaiSettings: (openaiSettings: APISetting) => void
  updateUserNewcomerFlag: () => void
  logout: () => void
}

export const useUserStore = create(persist(
  subscribeWithSelector(immer<State & Action>(
    (set) => ({
      user: undefined,
      lastPrompt: undefined,
      login: (user) => {
        set((draft: State) => {
          draft.user = {
            name: user.name,
            token: user.token,
            email: user.email,
            openaiSettings: user.openaiSettings,
            newcomer: user.newcomer
          }
          draft.lastPrompt = {
            id: user.latestPromptId
          }
        })
      },
      updateUserInfo: (key, value) => {
        set((draft: State) => {
          if (draft.user) {
            draft.user[key] = value
          }
        })
      },
      updateUserLastPrompt: (prompt) => {
        set(
          (draft: State) => {
            if (draft.user) {
              draft.lastPrompt = prompt
            }
          }
        )
      },
      /**
       * @deprecated use updateUserInfo instead of it
       */
      updateOpenaiSettings: (openaiSettings) => {
        set(
          (draft: State) => {
            if (draft.user) {
              draft.user.openaiSettings = openaiSettings
            }
          }
        )
      },
      /**
       * @deprecated use updateUserInfo instead of it
       */
      updateUserNewcomerFlag: () => {
        set(
          (draft: State) => {
            if (draft.user) {
              draft.user.newcomer = false
            }
          }
        )
      },
      logout: () => {
        set(
          (draft: State) => {
            draft.user = undefined
            draft.lastPrompt = undefined
          }
        )
      }
    })
  )), {
    name: 'prompter_user'
  })
)

useUserStore.subscribe(
  state => state.user,
  (user?: User) => {
    // update Tawk user info
    const name = user?.name ?? 'Anonymous'
    const email = user?.email ?? 'unknown@email.com'
    if (window.Tawk_API) {
      const onLoaded: boolean = window.Tawk_API.onLoaded
      if (onLoaded) {
        window.Tawk_API.setAttributes({
          name,
          email
        })
      } else {
        window.Tawk_API.onLoad = () => {
          window.Tawk_API!.setAttributes({
            name,
            email
          })
        }
      }
    }
  }, {
    fireImmediately: true
  }
)
