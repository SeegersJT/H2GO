export type AuthLogin = {
  email: string
  password: string
}

export type AuthLoginResponse = {
  status: string
  code: number
  message: string
}

export type ToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info'

export type AuthLoginCallbackResponse = {
  title: string
  description: string
  variant: ToastVariant
  error?: string
}

export type AuthLoginResponseCallback = (response: AuthLoginCallbackResponse | null) => void

export type AuthLoginSuccessCallback = (
  confirmation_token: string,
  confirmation_token_type: string,
  confirmation_token_expiry_date: Date,
) => void
