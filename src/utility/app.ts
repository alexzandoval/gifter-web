import { ServerValidationError } from 'ts/types'

export const isServerValidationError = (e: any): e is ServerValidationError =>
  typeof e.error === 'string' &&
  (Array.isArray(e.message) || typeof e.message === 'string') &&
  typeof e.statusCode === 'number'

export const ucFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)

export const allowOnlyNumber = (value: string): string =>
  value
    .replace(/[^0-9]/g, '')
    .replace(/^0+/, '')
    .slice(0, 5)

export const isDevelopment = process.env.REACT_APP_ENV === 'development'
