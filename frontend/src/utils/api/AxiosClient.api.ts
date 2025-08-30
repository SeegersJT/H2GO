import { setAuthenticationAccessToken, setAuthenticationAccessTokenExpiresAt } from '@/redux/actions/Authentication.action'
import axios, { AxiosError, AxiosHeaders, InternalAxiosRequestConfig } from 'axios'

interface CustomConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

export const setupAxiosInterceptors = (store: any) => {
  axios.interceptors.request.use((config: CustomConfig) => {
    const token = store.getState().auth.accessToken

    // Normalize headers
    config.headers = AxiosHeaders.from(config.headers)

    if (token) {
      ;(config.headers as AxiosHeaders).set('Authorization', `Bearer ${token}`)
    }

    return config
  })

  axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalConfig = error.config as CustomConfig

      if (error.response?.status === 401 && originalConfig && !originalConfig._retry) {
        originalConfig._retry = true

        try {
          const refreshToken = store.getState().auth.refreshToken
          if (!refreshToken) return Promise.reject(error)

          const refreshResponse = await axios.post('/auth/refresh-token', { refresh_token: refreshToken }, { withCredentials: true })

          const data: any = refreshResponse.data.data

          if (data?.access_token) {
            store.dispatch(setAuthenticationAccessToken(data.access_token))
            store.dispatch(setAuthenticationAccessTokenExpiresAt(data.access_token_expires_At))

            originalConfig.headers = AxiosHeaders.from(originalConfig.headers)
            ;(originalConfig.headers as AxiosHeaders).set('Authorization', `Bearer ${data.access_token}`)
          }

          return axios(originalConfig)
        } catch (refreshError) {
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    },
  )
}
