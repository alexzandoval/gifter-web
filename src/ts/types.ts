export type ResourceId = string | number

export type ServerValidationError = {
  error: string
  message: string[]
  statusCode: number
}
