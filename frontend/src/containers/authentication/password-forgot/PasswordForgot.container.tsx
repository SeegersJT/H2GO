import PasswordForgot from '@/components/authentication/password-forgot/PasswordForgot.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { requestAuthenticationPasswordForgot } from '@/redux/actions/Authentication.action'
import { AuthPasswordForgot } from '@/redux/types/Authentication.type'
import { navigateTo } from '@/utils/Navigation'
import { useState } from 'react'

const PasswordForgotContainer = () => {
  const dispatch = useAppDispatch()
  const { authPasswordForgotLoading } = useAppSelector((state) => state.auth)

  const [passwordForgotForm, setPasswordForgotForm] = useState({ email: '' })

  const handleOnPasswordForgotFormChange = (value: string) => {
    setPasswordForgotForm({ email: value })
  }

  const handleOnPasswordForgotFormSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const payload: AuthPasswordForgot = { email: passwordForgotForm.email }
    dispatch(requestAuthenticationPasswordForgot(payload))
  }

  const handleOnBackToLogin = () => {
    navigateTo('/auth/login')
  }

  return (
    <PasswordForgot
      passwordForgotForm={passwordForgotForm}
      authPasswordForgotLoading={authPasswordForgotLoading}
      onPasswordForgotFormChange={handleOnPasswordForgotFormChange}
      onPasswordForgotFormSubmit={handleOnPasswordForgotFormSubmit}
      onBackToLogin={handleOnBackToLogin}
    />
  )
}

export default PasswordForgotContainer
