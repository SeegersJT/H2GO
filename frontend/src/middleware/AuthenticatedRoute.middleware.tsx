import { useSelector } from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

function AuthenticatedRoute() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />
}

export default AuthenticatedRoute
