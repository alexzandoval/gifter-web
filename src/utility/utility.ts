import { ServerValidationError } from 'ts/types'

export const isServerValidationError = (e: any): e is ServerValidationError =>
  typeof e.error === 'string' && Array.isArray(e.message) && typeof e.statusCode === 'number'

export const ucFirst = (str: string): string => str.charAt(0).toUpperCase() + str.slice(1)
