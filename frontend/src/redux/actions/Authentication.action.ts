export const REQUEST_AUTH_LOGIN = '[AUTH] - LOGIN - REQUEST' as const
export const REQUEST_AUTH_LOGIN_LOADING = '[AUTH] - LOGIN - REQUEST - LOADING' as const
export const SET_AUTH_LOGIN_LOADING = '[AUTH] - LOGIN - REQUEST' as const
export const LOGIN_FAILURE = '[AUTH] - LOGIN - FAILURE' as const

import type { AuthLogin } from '@/redux/types/Authentication.type'

export const requestAuthenticationLogin = (payload: AuthLogin) => ({
  type: REQUEST_AUTH_LOGIN,
  payload,
})

export const requestAuthenticationLoginLoading = (payload: AuthLogin) => ({
  type: REQUEST_AUTH_LOGIN_LOADING,
  payload,
})

export const setAuthenticationLogin = (payload: AuthLogin) => ({
  type: REQUEST_AUTH_LOGIN,
  payload,
})

export const authActions = {
  requestAuthenticationLogin,
  setToken,
  loginFailure,
}
export type AuthAction = ReturnType<(typeof authActions)[keyof typeof authActions]>
