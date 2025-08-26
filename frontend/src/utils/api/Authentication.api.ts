import type { AxiosRequestConfig } from 'axios'
import { API_PREFIX, getHttpPostData } from './GenericWebRequest.api'
import type { AuthLogin } from '@/redux/types/Authentication.type'

const getAuthLoginEndpoint = () => `${API_PREFIX}/auth/login`

export const getAuthenticationLoginRequest = (payload: AuthLogin): [string, AxiosRequestConfig] => {
  return [
    getAuthLoginEndpoint(),
    getHttpPostData(payload, /* headers */ { 'Content-Type': 'application/json' }),
  ]
}
