import {
  AuthAction,
  SET_AUTH_ACCESS_TOKEN,
  SET_AUTH_ACCESS_TOKEN_EXPIRES_AT,
  SET_AUTH_LOGIN_LOADING,
  SET_AUTH_REFRESH_TOKEN,
  SET_AUTH_REFRESH_TOKEN_EXPIRES_AT,
} from '../actions/Authentication.action'

export interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  accessTokenExpiresAt: Date
  refreshTokenExpiresAt: Date
  authLoginLoading: boolean
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  accessTokenExpiresAt: null,
  refreshTokenExpiresAt: null,
  authLoginLoading: false,
}

export default function authReducer(state: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case SET_AUTH_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.payload,
      }

    case SET_AUTH_REFRESH_TOKEN:
      return {
        ...state,
        refreshToken: action.payload,
      }

    case SET_AUTH_ACCESS_TOKEN_EXPIRES_AT:
      return {
        ...state,
        accessTokenExpiresAt: action.payload,
      }

    case SET_AUTH_REFRESH_TOKEN_EXPIRES_AT:
      return {
        ...state,
        refreshTokenExpiresAt: action.payload,
      }

    case SET_AUTH_LOGIN_LOADING:
      return {
        ...state,
        authLoginLoading: action.payload,
      }
    default:
      return state
  }
}
