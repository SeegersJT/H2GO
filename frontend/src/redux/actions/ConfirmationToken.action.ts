import { ConfirmationToken, ConfirmationTokenOneTimePin, ConfirmationTokenValidation } from '../types/ConfirmationToken.type'

export const RESET_CONFIRMATION_TOKEN = '[TOKEN] - CONFIRMATION TOKEN - RESET' as const
export const SET_CONFIRMATION_TOKEN = '[TOKEN] - CONFIRMATION TOKEN - SET' as const

export const REQUEST_CONFIRMATION_TOKEN_VALIDATION = '[TOKEN] - CONFIRMATION TOKEN VALIDATION - REQUEST' as const
export const SET_CONFIRMATION_TOKEN_VALIDATION_LOADING = '[TOKEN] - CONFIRMATION TOKEN VALIDATION - SET - LOADING' as const
export const SET_CONFIRMATION_TOKEN_VALIDATION = '[TOKEN] - CONFIRMATION TOKEN VALIDATION - SET' as const

export const REQUEST_CONFIRMATION_TOKEN_OTP = '[TOKEN] - CONFIRMATION TOKEN OTP - REQUEST' as const
export const SET_CONFIRMATION_TOKEN_OTP_LOADING = '[TOKEN] - CONFIRMATION TOKEN OTP - SET - LOADING' as const
export const SET_CONFIRMATION_TOKEN_OTP = '[TOKEN] - CONFIRMATION TOKEN OTP - SET' as const

export const resetConfirmationToken = () => ({
  type: RESET_CONFIRMATION_TOKEN,
})

export const setConfirmationToken = (payload: ConfirmationToken) => ({
  type: SET_CONFIRMATION_TOKEN,
  payload,
})

export const requestConfirmationTokenValidation = (payload: ConfirmationTokenValidation) => ({
  type: REQUEST_CONFIRMATION_TOKEN_VALIDATION,
  payload,
})

export const setConfirmationTokenValidationLoading = (payload: boolean) => ({
  type: SET_CONFIRMATION_TOKEN_VALIDATION_LOADING,
  payload,
})

export const setConfirmationTokenValidation = (payload: any) => ({
  type: SET_CONFIRMATION_TOKEN_VALIDATION,
  payload,
})

export const requestConfirmationTokenOneTimePin = (payload: ConfirmationTokenOneTimePin) => ({
  type: REQUEST_CONFIRMATION_TOKEN_OTP,
  payload,
})

export const setConfirmationTokenOneTimePinLoading = (payload: boolean) => ({
  type: SET_CONFIRMATION_TOKEN_OTP_LOADING,
  payload,
})

export const setConfirmationTokenOneTimePin = (payload: any) => ({
  type: REQUEST_CONFIRMATION_TOKEN_OTP,
  payload,
})

export const confirmationTokenActions = {
  resetConfirmationToken,
  setConfirmationToken,
  requestConfirmationTokenValidation,
  setConfirmationTokenValidationLoading,
  setConfirmationTokenValidation,
  requestConfirmationTokenOneTimePin,
  setConfirmationTokenOneTimePinLoading,
  setConfirmationTokenOneTimePin,
}

export type ConfirmationTokenAction = ReturnType<(typeof confirmationTokenActions)[keyof typeof confirmationTokenActions]>
