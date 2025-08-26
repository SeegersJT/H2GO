export type AuthLogin = {
  email: string
  password: string
}

export type AuthLoginResponse = {
  data: any
  status: string
  code: number
  message: string
}

export type AuthLoginSuccessCallback = () => void
