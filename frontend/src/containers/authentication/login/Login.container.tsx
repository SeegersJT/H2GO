import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import Login from '@/components/authentication/login/Login.component'
import * as authActions from '@/redux/actions/Authentication.action'
import { useNavigate } from 'react-router-dom'

const LoginContainer = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { authLoginLoading } = useAppSelector((state) => state.auth)

  const [loginForm, setLoginForm] = useState({ email: null, password: null })

  const handleOnLoginFormChange = (value: string, type: 'email' | 'password') => {
    setLoginForm({
      ...loginForm,
      [type]: value,
    })
  }

  const handleOnAuthLoginFormClick = (event: React.FormEvent, type: 'login' | 'register') => {
    event.preventDefault()

    if (type === 'login') {
      const onSuccess = () => {
        navigate('/auth/token')
      }

      dispatch(authActions.requestAuthenticationLogin(loginForm, onSuccess))
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
      authLoginLoading={authLoginLoading}
      onLoginFormChange={handleOnLoginFormChange}
      onAuthLoginFormClick={handleOnAuthLoginFormClick}
    />
  )
}

export default LoginContainer
