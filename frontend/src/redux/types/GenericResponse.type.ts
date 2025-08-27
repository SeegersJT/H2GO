export type GenericResponse = {
  status: string
  code: number
  message: string
  timestamp: Date
  data: any
  error?: string | null
}
