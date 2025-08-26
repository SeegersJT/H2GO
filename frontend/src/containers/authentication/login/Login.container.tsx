import Login from '@/components/authentication/login/Login.component'
import { useToast } from '@/hooks/use-toast'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const LoginContainer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleOnAuthLoginFormClick = (event: React.FormEvent, type: 'login' | 'register') => {
    event.preventDefault()

    dispatch()

    setTimeout(() => {
      if (type === 'login') {
        toast({
          title: 'Login successful',
          description: 'Welcome back to WaterBoy!',
          variant: 'info',
        })
      } else {
        toast({
          title: 'Registration successful',
          description: 'Your account has been created. Please log in.',
          variant: 'info',
        })
      }

      if (type === 'login') {
        navigate('/dashboard')
      }
    }, 1500)
  }

  return <Login onAuthLoginFormClick={handleOnAuthLoginFormClick} isLoading={false} />
}

export default LoginContainer
