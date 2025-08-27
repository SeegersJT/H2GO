export type ConfirmationToken = {
  confirmation_token: string
  confirmation_token_type: string
  confirmation_token_expiry_date: Date
}

export type ConfirmationTokenValidation = {
  confirmation_token: string
}

export type ConfirmationTokenOneTimePin = {
  confirmation_token: string
  one_time_pin: string
}

export type ConfirmationTokenPasswordReset = {
  confirmation_token: string
  password: string
  confirm_password: string
}
