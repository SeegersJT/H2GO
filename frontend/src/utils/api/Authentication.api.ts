import type { AuthLogin, AuthPasswordForgot } from '@/redux/types/Authentication.type'
import { ConfirmationTokenOneTimePin, ConfirmationTokenPasswordReset, ConfirmationTokenValidation } from '@/redux/types/ConfirmationToken.type'
import type { AxiosRequestConfig } from 'axios'
import { API_URL, getHttpPostData } from './GenericWebRequest.api'

const getAuthLoginEndpoint = () => `${API_URL}/auth/login`
const getAuthPasswordForgotEndpoint = () => `${API_URL}/auth/password-forgot`
const getConfirmationTokenValidateEndpoint = () => `${API_URL}/auth/confirmation-token/validate`
const getConfirmationTokenOneTimePinEndpoint = () => `${API_URL}/auth/one-time-pin`
const getConfirmationTokenPasswordResetEndpoint = () => `${API_URL}/auth/password-reset`

export const getAuthenticationLoginRequest = (payload: AuthLogin): [string, AxiosRequestConfig] => [
  getAuthLoginEndpoint(),
  getHttpPostData(payload, { 'Content-Type': 'application/json' }),
]

export const getAuthenticationPasswordForgotRequest = (payload: AuthPasswordForgot): [string, AxiosRequestConfig] => [
  getAuthPasswordForgotEndpoint(),
  getHttpPostData(payload, { 'Content-Type': 'application/json' }),
]

export const getConfirmationTokenValidateRequest = (payload: ConfirmationTokenValidation): [string, AxiosRequestConfig] => [
  getConfirmationTokenValidateEndpoint(),
  getHttpPostData(payload, { 'Content-Type': 'application/json' }),
]

export const getConfirmationTokenOneTimePinRequest = (payload: ConfirmationTokenOneTimePin): [string, AxiosRequestConfig] => [
  getConfirmationTokenOneTimePinEndpoint(),
  getHttpPostData(payload, { 'Content-Type': 'application/json' }),
]

export const getConfirmationTokenPasswordResetRequest = (payload: ConfirmationTokenPasswordReset): [string, AxiosRequestConfig] => [
  getConfirmationTokenPasswordResetEndpoint(),
  getHttpPostData(payload, { 'Content-Type': 'application/json' }),
]
