import type { AuthLogin, AuthLoginSuccessCallback } from '@/redux/types/Authentication.type'

export const REQUEST_AUTH_LOGIN = '[AUTH] - LOGIN - REQUEST' as const
export const SET_AUTH_LOGIN_LOADING = '[AUTH] - LOGIN - SET - LOADING' as const
export const SET_AUTH_LOGIN = '[AUTH] - LOGIN - SET' as const

export const requestAuthenticationLogin = (
  payload: AuthLogin,
  onSuccess?: AuthLoginSuccessCallback,
) => ({
  type: REQUEST_AUTH_LOGIN,
  payload,
  onSuccess,
})

export const setAuthenticationLoginLoading = (payload: boolean) => ({
  type: SET_AUTH_LOGIN_LOADING,
  payload,
})

export const setAuthenticationLogin = (isLoading: boolean) => ({
  type: SET_AUTH_LOGIN_LOADING,
  payload: isLoading,
})

export const authActions = {
  requestAuthenticationLogin,
  setAuthenticationLoginLoading,
  setAuthenticationLogin,
}

export type AuthAction = ReturnType<(typeof authActions)[keyof typeof authActions]>
