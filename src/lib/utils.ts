import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn (...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * prevent special characters in the string being escaped when used in RegExp
 * 🌰: are you member me? => are you member me\\?
 * @param str
 * @returns string
 */
export function escapeRegExp (str: string) {
  // $& mean all match string
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * set the first character of the string to uppercase
 * @param str
 * @returns string
 */
export function firstUpperCase ([first, ...rest]: string) {
  return first.toUpperCase() + rest.join('')
}
