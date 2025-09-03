import Dashboard from '@/components/dashboard/Dashboard.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { toast } from '@/hooks/use-toast'
import {
  setAuthenticationAccessToken,
  setAuthenticationAccessTokenExpiresAt,
  setAuthenticationRefreshToken,
  setAuthenticationRefreshTokenExpiresAt,
} from '@/redux/actions/Authentication.action'
import { clearUser } from '@/redux/actions/User.action'
import { API_URL } from '@/utils/api/GenericWebRequest.api'
import { navigateTo } from '@/utils/Navigation'
import axios from 'axios'
import { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'

const DashboardContainer = () => {
  const dispatch = useAppDispatch()
  const { user_type } = useAppSelector((state) => state.user)
  const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = useAppSelector((state) => state.auth)

  const accessTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const logout = () => {
    if (accessTimer.current) clearTimeout(accessTimer.current)
    if (refreshTimer.current) clearTimeout(refreshTimer.current)

    localStorage.clear()
    sessionStorage.clear()
    if ('caches' in window) {
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)))
    }

    dispatch(setAuthenticationAccessToken(null))
    dispatch(setAuthenticationRefreshToken(null))
    dispatch(setAuthenticationAccessTokenExpiresAt(null))
    dispatch(setAuthenticationRefreshTokenExpiresAt(null))
    dispatch(clearUser())

    navigateTo('/auth/login', { replace: true })
  }

  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh-token`, { refresh_token: refreshToken }, { withCredentials: true })

      const data: any = response.data.data

      if (data.access_token) {
        dispatch(setAuthenticationAccessToken(data.access_token))
      }
      if (data.refresh_token) {
        dispatch(setAuthenticationRefreshToken(data.refresh_token))
      }
      if (data.access_token_expires_at) {
        dispatch(setAuthenticationAccessTokenExpiresAt(data.access_token_expires_at))
      }
      if (data.refresh_token_expires_at) {
        dispatch(setAuthenticationRefreshTokenExpiresAt(data.refresh_token_expires_at))
      }
    } catch (error) {
      logout()
    }
  }

  useEffect(() => {
    if (accessTimer.current) clearTimeout(accessTimer.current)

    if (accessToken && refreshToken && accessTokenExpiresAt) {
      const expiresIn = new Date(accessTokenExpiresAt).getTime() - Date.now()
      accessTimer.current = setTimeout(
        () => {
          refreshAccessToken()
        },
        Math.max(expiresIn, 0),
      )
    }

    return () => {
      if (accessTimer.current) clearTimeout(accessTimer.current)
    }
  }, [accessToken, accessTokenExpiresAt, refreshToken])

  useEffect(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)

    if (refreshToken && refreshTokenExpiresAt) {
      const expiresIn = new Date(refreshTokenExpiresAt).getTime() - Date.now()
      refreshTimer.current = setTimeout(
        () => {
          logout()
        },
        Math.max(expiresIn, 0),
      )
    }

    return () => {
      if (refreshTimer.current) clearTimeout(refreshTimer.current)
    }
  }, [refreshToken, refreshTokenExpiresAt])
  if (!user_type) {
    toast({
      title: 'Invalid User',
      description: 'Insufficiant permissions',
      variant: 'error',
    })
    return <Navigate to="/" replace />
  }

  return <Dashboard />
}

export default DashboardContainer
