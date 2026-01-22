import { RootState } from '@/redux/Store.redux'
import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function AuthenticatedRoute() {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export default AuthenticatedRoute
