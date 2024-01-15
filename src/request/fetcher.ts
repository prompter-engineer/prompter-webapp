import { useUserStore } from '@/store/user'
import { redirect } from 'react-router-dom'

export interface ServerResult<T = any> {
  code: number
  data: T
  msg: string
}

/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 *
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
function isAbsoluteURL (url: string) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url)
}

/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 *
 * @returns {string} The combined URL
 */
function combineURLs (baseURL: string, relativeURL: string) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL
}

export class ResponseError extends Error {
  code: number
  constructor (code: number, message: string) {
    super(message)
    this.code = code
  }
}

export const fetcher = async <Result>(url: string, init?: RequestInit) => {
  const token = useUserStore.getState().user?.token
  const baseURL = import.meta.env.VITE_SERVER_URL_PREFIX
  if (!isAbsoluteURL(url) && baseURL !== undefined) {
    url = combineURLs(baseURL, url)
  }
  init = init ?? {}
  init.headers = init.headers ?? new Headers()
  if (!(init.headers instanceof Headers)) {
    const headers = init.headers as Record<string, string>
    init.headers = Object.keys(headers).reduce((pre, key) => {
      pre.append(key, headers[key])
      return pre
    }, new Headers())
  }
  if (token !== undefined) {
    init.headers.append('x-prompter-token', token)
  }
  if (init.headers.get('Content-Type') == null) {
    init.headers.append('Content-Type', 'application/json')
  }

  const response = await fetch(url, init)
  if (response.headers.get('content-type')?.startsWith('application/json')) {
    const result = (await response.json()) as ServerResult<Result>
    if (!response.ok) {
      const text = await response.text()
      try {
        const error = JSON.parse(text)
        throw new ResponseError(Number(error.code), error.msg)
      } catch {
        throw new ResponseError(response.status, 'System exception, please try again')
      }
    } else {
      if (result.code !== 200) {
        if (result.code === 1005) {
          useUserStore.getState().logout()
          redirect('/login')
        }
        throw new ResponseError(result.code, result.msg)
      }
    }
    return result.data
  }
  throw new ResponseError(104022, 'Response non-expected error')
}

fetcher.get = async <Result>(url: string) => {
  return await fetcher<Result>(url, {
    method: 'GET'
  })
}

fetcher.post = async <Data, Result>(url: string, data: Data) => {
  return await fetcher<Result>(url, {
    method: 'POST',
    body: JSON.stringify(data)
  })
}
