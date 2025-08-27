import { useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import * as authActions from '@/redux/actions/Authentication.action'
import Login from '@/components/authentication/login/Login.component'

const LoginContainer = () => {
  const dispatch = useAppDispatch()

  const { authLoginLoading } = useAppSelector((state) => state.auth)

  const [loginForm, setLoginForm] = useState({ email: null, password: null })

  const handleOnLoginFormChange = (value: string, type: 'email' | 'password') => {
    setLoginForm({ ...loginForm, [type]: value })
  }

  const handleOnAuthLoginFormClick = (event: React.FormEvent, type: 'login' | 'register') => {
    event.preventDefault()

    if (type === 'login') {
      dispatch(authActions.requestAuthenticationLogin(loginForm))
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
