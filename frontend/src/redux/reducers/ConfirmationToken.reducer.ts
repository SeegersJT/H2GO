import {
  ConfirmationTokenAction,
  RESET_CONFIRMATION_TOKEN,
  SET_CONFIRMATION_TOKEN,
  SET_CONFIRMATION_TOKEN_LOADING,
  SET_CONFIRMATION_TOKEN_VALIDATION,
  SET_CONFIRMATION_TOKEN_VALIDATION_LOADING,
} from '../actions/ConfirmationToken.action'

export interface ConfirmationTokenState {
  confirmationToken: string | null
  confirmationTokenType: string | null
  confirmationTokenExpiryDate: Date | null
  confirmationTokenLoading: boolean

  confirmationTokenValidation: boolean
  confirmationTokenValidationLoading: boolean
}

const initialState: ConfirmationTokenState = {
  confirmationToken: null,
  confirmationTokenType: null,
  confirmationTokenExpiryDate: null,
  confirmationTokenLoading: false,

  confirmationTokenValidation: false,
  confirmationTokenValidationLoading: false,
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

    case SET_CONFIRMATION_TOKEN_LOADING:
      return {
        ...state,
        confirmationTokenLoading: action?.payload,
      }

    case SET_CONFIRMATION_TOKEN_VALIDATION:
      return {
        ...state,
        confirmationTokenValidation: action?.payload,
      }

    case SET_CONFIRMATION_TOKEN_VALIDATION_LOADING:
      return {
        ...state,
        confirmationTokenValidationLoading: action?.payload,
      }
    default:
      return state
  }
}
