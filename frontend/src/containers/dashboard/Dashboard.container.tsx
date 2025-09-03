import Dashboard from '@/components/dashboard/Dashboard.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { toast } from '@/hooks/use-toast'
import * as authActions from '@/redux/actions/Authentication.action'
import * as conmfirmationTokenActions from '@/redux/actions/ConfirmationToken.action'
import { clearUser } from '@/redux/actions/User.action'
import { navigateTo } from '@/utils/Navigation'
import { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'

const DashboardContainer = () => {
  const dispatch = useAppDispatch()
  const { user_type } = useAppSelector((state) => state.user)
  const { accessToken, refreshToken, accessTokenExpiresAt, refreshTokenExpiresAt } = useAppSelector((state) => state.auth)

  const refreshTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    dispatch(conmfirmationTokenActions.resetConfirmationToken())
  }, [dispatch])

  const logout = () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current)

    localStorage.clear()
    sessionStorage.clear()
    if ('caches' in window) {
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)))
    }

    dispatch(authActions.setAuthenticationAccessToken(null))
    dispatch(authActions.setAuthenticationRefreshToken(null))
    dispatch(authActions.setAuthenticationAccessTokenExpiresAt(null))
    dispatch(authActions.setAuthenticationRefreshTokenExpiresAt(null))
    dispatch(clearUser())

    navigateTo('/auth/login', { replace: true })
  }

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
