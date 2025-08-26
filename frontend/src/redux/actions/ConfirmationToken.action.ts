import { ConfirmationToken } from '../types/ConfirmationToken.type'

export const RESET_CONFIRMATION_TOKEN = '[TOKEN] - CONFIRMATION TOKEN - RESET' as const
export const SET_CONFIRMATION_TOKEN = '[TOKEN] - CONFIRMATION TOKEN - SET' as const

export const resetConfirmationToken = () => ({
  type: RESET_CONFIRMATION_TOKEN,
})

export const setConfirmationToken = (payload: ConfirmationToken) => ({
  type: SET_CONFIRMATION_TOKEN,
  payload,
})

export const confirmationTokenActions = {
  resetConfirmationToken,
  setConfirmationToken,
}

export type ConfirmationTokenAction = ReturnType<
  (typeof confirmationTokenActions)[keyof typeof confirmationTokenActions]
>
