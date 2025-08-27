import { AuthAction, SET_AUTH_LOGIN_LOADING } from '../actions/Authentication.action'

export interface AuthState {
  accessToken: string | null
  authLoginLoading: boolean
}

const initialState: AuthState = {
  accessToken: null,
  authLoginLoading: false,
}

export default function authReducer(
  state: AuthState = initialState,
  action: AuthAction,
): AuthState {
  switch (action.type) {
    case SET_AUTH_LOGIN_LOADING:
      return {
        ...state,
        authLoginLoading: action.payload,
      }
    default:
      return state
  }
}
