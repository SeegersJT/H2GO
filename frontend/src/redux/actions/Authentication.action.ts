import type { AuthLogin, AuthPasswordForgot } from '@/redux/types/Authentication.type'

export const REQUEST_AUTH_LOGIN = '[AUTH] - LOGIN - REQUEST' as const
export const SET_AUTH_LOGIN_LOADING = '[AUTH] - LOGIN - SET - LOADING' as const
export const SET_AUTH_LOGIN = '[AUTH] - LOGIN - SET' as const

export const REQUEST_AUTH_PASSWORD_FORGOT = '[AUTH] - PASSWORD FORGOT - REQUEST' as const
export const SET_AUTH_PASSWORD_FORGOT_LOADING = '[AUTH] - PASSWORD FORGOT - SET - LOADING' as const

export const SET_AUTH_ACCESS_TOKEN = '[AUTH] - ACCESS TOKEN - SET' as const
export const SET_AUTH_REFRESH_TOKEN = '[AUTH] - REFRESH TOKEN - SET' as const
export const SET_AUTH_ACCESS_TOKEN_EXPIRES_AT = '[AUTH] - ACCESS TOKEN EXPIRES AT - SET' as const
export const SET_AUTH_REFRESH_TOKEN_EXPIRES_AT = '[AUTH] - REFRESH TOKEN EXPIRES AT - SET' as const

export const requestAuthenticationLogin = (payload: AuthLogin) => ({
  type: REQUEST_AUTH_LOGIN,
  payload,
})

export const requestAuthenticationPasswordForgot = (payload: AuthPasswordForgot) => ({
  type: REQUEST_AUTH_PASSWORD_FORGOT,
  payload,
})

export const setAuthenticationLoginLoading = (payload: boolean) => ({
  type: SET_AUTH_LOGIN_LOADING,
  payload,
})

export const setAuthenticationPasswordForgotLoading = (payload: boolean) => ({
  type: SET_AUTH_PASSWORD_FORGOT_LOADING,
  payload,
})

export const setAuthenticationLogin = (isLoading: boolean) => ({
  type: SET_AUTH_LOGIN_LOADING,
  payload: isLoading,
})

export const setAuthenticationAccessToken = (payload: string) => ({
  type: SET_AUTH_ACCESS_TOKEN,
  payload,
})

export const setAuthenticationRefreshsToken = (payload: string) => ({
  type: SET_AUTH_REFRESH_TOKEN,
  payload,
})

export const setAuthenticationAccessTokenExpiresAt = (payload: Date) => ({
  type: SET_AUTH_ACCESS_TOKEN_EXPIRES_AT,
  payload,
})

export const setAuthenticationRefreshTokenExpiresAt = (payload: Date) => ({
  type: SET_AUTH_REFRESH_TOKEN_EXPIRES_AT,
  payload,
})

export const authActions = {
  requestAuthenticationLogin,
  setAuthenticationLoginLoading,
  setAuthenticationLogin,
  requestAuthenticationPasswordForgot,
  setAuthenticationPasswordForgotLoading,
  setAuthenticationAccessToken,
  setAuthenticationRefreshsToken,
  setAuthenticationAccessTokenExpiresAt,
  setAuthenticationRefreshTokenExpiresAt,
}

export type AuthAction = ReturnType<(typeof authActions)[keyof typeof authActions]>
