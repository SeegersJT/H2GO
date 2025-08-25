import { AuthAction, SET_TOKEN } from '../actions/Authentication.action'

export interface AuthState {
  accessToken: string | null
  user: { id: string; name: string } | null
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
}

export default function authReducer(
  state: AuthState = initialState,
  action: AuthAction,
): AuthState {
  switch (action.type) {
    case SET_TOKEN:
      return { ...state, accessToken: action.payload }
    default:
      return state
  }
}
