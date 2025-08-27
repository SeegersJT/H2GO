import {
  ConfirmationTokenAction,
  RESET_CONFIRMATION_TOKEN,
  SET_CONFIRMATION_TOKEN,
} from '../actions/ConfirmationToken.action'

export interface ConfirmationTokenState {
  confirmationToken: string | null
  confirmationTokenType: string | null
  confirmationTokenExpiryDate: Date | null
  isConfirmationTokenValid: boolean
  confirmationTokenLoading: boolean
}

const initialState: ConfirmationTokenState = {
  confirmationToken: null,
  confirmationTokenType: null,
  confirmationTokenExpiryDate: null,
  isConfirmationTokenValid: false,
  confirmationTokenLoading: false,
}

export default function confirmationTokenReducer(
  state: ConfirmationTokenState = initialState,
  action: ConfirmationTokenAction,
): ConfirmationTokenState {
  switch (action.type) {
    case RESET_CONFIRMATION_TOKEN:
      return {
        ...initialState,
      }

    case SET_CONFIRMATION_TOKEN:
      return {
        ...state,
        confirmationToken: action?.payload?.confirmation_token,
        confirmationTokenType: action?.payload?.confirmation_token_type,
        confirmationTokenExpiryDate: action?.payload?.confirmation_token_expiry_date,
      }
    default:
      return state
  }
}
