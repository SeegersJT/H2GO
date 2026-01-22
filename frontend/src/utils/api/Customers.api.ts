import type { AxiosRequestConfig } from 'axios'
import { API_URL, getHttpGetOptions, getHttpPostData } from './GenericWebRequest.api'

const getCustomerInsertEndpoint = () => `${API_URL}/users`
const getCustomersEndpoint = () => `${API_URL}/users/customers`

export const getCustomerInsertRequest = (payload: any): [string, AxiosRequestConfig] => [
  getCustomerInsertEndpoint(),
  getHttpPostData(payload, { 'Content-Type': 'application/json' }),
]

export const getCustomersRequest = (): [string, AxiosRequestConfig] => [
  getCustomersEndpoint(),
  getHttpGetOptions({ 'Content-Type': 'application/json' }),
]
