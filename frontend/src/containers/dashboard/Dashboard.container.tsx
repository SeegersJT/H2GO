import Dashboard from '@/components/dashboard/Dashboard.component'
import { useAppSelector } from '@/hooks/use-redux'
import { toast } from '@/hooks/use-toast'
import { Navigate } from 'react-router-dom'

const DashboardContainer = () => {
  // TODO: clear all token data on successful login
  const { user_type } = useAppSelector((state) => state.user)

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
