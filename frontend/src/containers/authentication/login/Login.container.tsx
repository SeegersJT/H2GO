import Login from '@/components/authentication/login/Login.component'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LoginContainer = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleOnAuthLoginFormClick = (event: React.FormEvent, type: 'login' | 'register') => {
    event.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setIsLoading(false)
      if (type === 'login') {
        localStorage.setItem('waterboy_auth', 'mock_token')
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

  return <Login onAuthLoginFormClick={handleOnAuthLoginFormClick} isLoading={isLoading} />
}

export default LoginContainer
