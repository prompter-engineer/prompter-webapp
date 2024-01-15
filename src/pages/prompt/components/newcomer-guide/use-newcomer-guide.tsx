import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'
import './index.css'
import { useUserStore } from '@/store/user'

const next = () => {
  setTimeout(() => {
    driverObj.moveNext()
  })
}

const prev = () => {
  setTimeout(() => {
    driverObj.movePrevious()
  })
}

const refresh = () => {
  driverObj.refresh()
}

const driverObj = driver({
  popoverClass: 'prompter-theme',
  stagePadding: 6,
  allowClose: false,
  steps: [
    {
      element: '#setting-dialog',
      popover: {
        title: 'Secure API Key Entry',
        description: `
          <p>Enter your OpenAI API key or a custom endpoint URL and API key with confidence.</p>
          <p>
            <b>At Prompter, we prioritize your security.</b>
            Your API key is safely stored and never accessed, ensuring your sensitive information remains private and protected.
          </p>
        `,
        onNextClick: () => {
          const closeEl = document.querySelector('#setting-dialog .close-button')
          if (!closeEl) return
          closeEl.dispatchEvent(new MouseEvent('click', { bubbles: true }))
        }
      },
      onHighlightStarted: () => {
        const closeEl = document.querySelector('#setting-dialog .close-button')
        if (!closeEl) return
        closeEl.addEventListener('click', next)
      },
      onDeselected: () => {
        const closeEl = document.querySelector('#setting-dialog .close-button')
        if (!closeEl) return
        closeEl.removeEventListener('click', next)
      }
    },
    {
      element: '#configuration-content__parameters',
      popover: {
        title: 'Model & Parameters',
        description: `
          Choose from different models and tweak parameters to fit your unique needs in the Parameters Tab.
        `,
        onPrevClick: () => {
          const openSettingButtonEl = document.querySelector('#open-setting-button')
          if (!openSettingButtonEl) return
          openSettingButtonEl.dispatchEvent(new MouseEvent('click', { bubbles: true }))
          prev()
        }
      }
    },
    {
      element: '#configuration-tabs__prompt',
      popover: {
        title: 'Switch Tab',
        description: 'Click to navigate to other settings, including the Messages tab.',
        onNextClick: (e) => {
          if (!e) return
          const el = e as HTMLButtonElement
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
        },
        onPrevClick: () => {
          const el = document.querySelector('#configuration-tabs__parameters')
          if (!el) return
          el.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
          prev()
        }
      },
      onHighlightStarted: (e) => {
        if (!e) return
        e.addEventListener('mousedown', next)
      },
      onDeselected: (e) => {
        if (!e) return
        e.removeEventListener('mousedown', next)
      }
    }, {
      element: '#configuration-content__prompt .message-system>textarea',
      popover: {
        title: 'Enter System Message',
        description: `
        <p>Use the system message to define LLM's behavior, like personality tweaks or specific conversation instructions.</p>
        <p>This is optional; without a system message, it will be similar to using a generic message such as "You are a helpful assistant."</p>
        `,
        onPrevClick: () => {
          const config = driverObj.getConfig()
          driverObj.setConfig({
            ...config,
            disableActiveInteraction: false
          })
          prev()
        }
      },
      onHighlightStarted: () => {
        const config = driverObj.getConfig()
        driverObj.setConfig({
          ...config,
          disableActiveInteraction: true
        })
      }
    }, {
      element: '#configuration-content__prompt .message-user>textarea',
      popover: {
        title: 'Enter User Message',
        description: `
        Enter your request or comment in "User Message" for the LLM to respond. This is typically where you ask questions or make requests to the LLM.
        `,
        onNextClick: (e) => {
          const setValue = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value')!.set!
          const systemTextareaEl = document.querySelector('#configuration-content__prompt .message-system>textarea')
          if (systemTextareaEl) {
            setValue.call(systemTextareaEl, "You are ChatGPT, a large language model trained by OpenAI. You answer as concisely as possible for each response(e.g. don't be verbose). It is very important that you answer as concisely as possible, so please remember this. If you are generating a list, do not have too many items. Keep the number of items short.")
            systemTextareaEl.dispatchEvent(new Event('input', { bubbles: true }))
          }
          const userTextareaEl = e
          if (userTextareaEl) {
            setValue.call(userTextareaEl, 'why 42 is a special number?')
            userTextareaEl.dispatchEvent(new Event('input', { bubbles: true }))
          }
          next()
        }
      }
    }, {
      element: '#configuration-content__prompt>div',
      popover: {
        title: 'Example Provided',
        description: `
        Example messages have been pre-filled. Feel free to modify it to meet your specific requirements.
        `
      },
      onHighlightStarted: (e) => {
        const config = driverObj.getConfig()
        driverObj.setConfig({
          ...config,
          disableActiveInteraction: false
        })
        if (!e) return
        e.addEventListener('input', refresh)

        // hide all icon button
        e.querySelectorAll('button').forEach(e => {
          e.style.visibility = 'hidden'
        })
      },
      onDeselected: (e) => {
        if (!e) return
        e.removeEventListener('input', refresh)

        // recovery all icon button
        e.querySelectorAll('button').forEach(e => {
          e.style.visibility = 'unset'
        })
      }
    }, {
      element: '#result-run-button',
      popover: {
        title: '✨ Submit Your Request',
        description: `
          <p>You've successfully set up all configurations.</p>
          <p>Now, click "Run" to execute your first prompt and check the results.</p>
          <p>Enjoy exploring the capabilities of Prompter in our <a href="https://prompter.engineer/docs" target="_blank"><u>user guide!</u></a></p>
        `
      }
    }
  ],
  onDestroyed: () => {
    const updateUserNewcomerFlag = useUserStore.getState().updateUserNewcomerFlag
    updateUserNewcomerFlag()
  }
})

const useNewcomerGuide = () => {
  const start = () => {
    driverObj.drive()
  }

  return [start]
}

export default useNewcomerGuide
