import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/hooks/use-toast'
import Login from '@/components/authentication/login/Login.component'
import * as authActions from '@/redux/actions/Authentication.action'
import { useState } from 'react'
import { AuthLoginCallbackResponse } from '@/redux/types/Authentication.type'

const LoginContainer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { toast } = useToast()

  const [loginForm, setLoginForm] = useState({ email: null, password: null })

  const handleOnLoginFormChange = (value: string, type: 'email' | 'password') => {
    setLoginForm({
      ...loginForm,
      [type]: value,
    })
  }

  const handleOnAuthLoginFormClick = (event: React.FormEvent, type: 'login' | 'register') => {
    event.preventDefault()

    const onSuccess = () => {}

    const onResponse = (response: AuthLoginCallbackResponse) => {
      toast({ title: response.title, description: response.description, variant: response.variant })
    }

    if (type === 'login') {
      dispatch(authActions.requestAuthenticationLogin(loginForm, onResponse, onSuccess))
    }

    // if (type === 'register') {
    //   dispatch(authActions.requestAuthenticationLogin(loginForm))

    //   toast({
    //     title: 'Registration successful',
    //     description: 'Your account has been created. Please log in.',
    //     variant: 'info',
    //   })
    // }
  }

  return (
    <Login
      loginForm={loginForm}
      isLoading={false}
      onLoginFormChange={handleOnLoginFormChange}
      onAuthLoginFormClick={handleOnAuthLoginFormClick}
    />
  )
}

export default LoginContainer
