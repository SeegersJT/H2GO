import type { AxiosRequestConfig } from 'axios'
import { API_URL, getHttpGetOptions, getHttpPostData } from './GenericWebRequest.api'

const getCustomersEndpoint = () => `${API_URL}/users/customers`

export const getCustomersRequest = (): [string, AxiosRequestConfig] => [
  getCustomersEndpoint(),
  getHttpGetOptions({ 'Content-Type': 'application/json' }),
]
