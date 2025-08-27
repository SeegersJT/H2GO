import type { AxiosRequestConfig } from 'axios'
import { API_PREFIX, getHttpPostData } from './GenericWebRequest.api'
import type { AuthLogin } from '@/redux/types/Authentication.type'
import { ConfirmationTokenOneTimePin, ConfirmationTokenPasswordReset, ConfirmationTokenValidation } from '@/redux/types/ConfirmationToken.type'

const getAuthLoginEndpoint = () => `${API_PREFIX}/auth/login`
const getConfirmationTokenValidateEndpoint = () => `${API_PREFIX}/auth/confirmation-token/validate`
const getConfirmationTokenOneTimePinEndpoint = () => `${API_PREFIX}/auth/one-time-pin`
const getConfirmationTokenPasswordResetEndpoint = () => `${API_PREFIX}/auth/password-reset`

export const getAuthenticationLoginRequest = (payload: AuthLogin): [string, AxiosRequestConfig] => [
  getAuthLoginEndpoint(),
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
