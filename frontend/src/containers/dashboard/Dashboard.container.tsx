import { useAppSelector } from '@/hooks/use-redux'
import { Navigate, useParams } from 'react-router-dom'

const DashboardContainer = () => {
  // TODO: clear all token data on successful login
  const { role } = useParams()
  const { user_type } = useAppSelector((state) => state.user)

  if (!user_type) {
    return <Navigate to="/" replace />
  }

  if (role !== user_type) {
    return <Navigate to={`/${user_type}/dashboard/home`} replace />
  }
}

export default DashboardContainer
