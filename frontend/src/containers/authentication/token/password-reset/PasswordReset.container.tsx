import PasswordReset from '@/components/authentication/token/password-reset/PasswordReset.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { requestConfirmationTokenPasswordReset } from '@/redux/actions/ConfirmationToken.action'
import { ConfirmationTokenPasswordReset } from '@/redux/types/ConfirmationToken.type'
import { navigateTo } from '@/utils/Navigation'
import { useState } from 'react'

const PasswordResetContainer = () => {
  const dispatch = useAppDispatch()
  const { confirmationToken, confirmationTokenLoading } = useAppSelector((state) => state.token)

  const [passwordResetForm, setPasswordResetForm] = useState({
    password: '',
    confirmPassword: '',
  })

  const handleOnPasswordResetFormChange = (value: string, type: 'password' | 'confirmPassword') => {
    setPasswordResetForm({
      ...passwordResetForm,
      [type]: value,
    })
  }

  const handleOnPasswordResetFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const payload: ConfirmationTokenPasswordReset = {
      confirmation_token: confirmationToken,
      password: passwordResetForm.password,
      confirm_password: passwordResetForm.confirmPassword,
    }

    dispatch(requestConfirmationTokenPasswordReset(payload))

    // setLoading(true)
    // // try {
    // //   const [endpoint, requestOptions] = api.getAuthPasswordResetRequest({
    // //     confirmation_token: confirmationToken!,
    // //     password: passwordResetForm.password,
    // //     confirm_password: passwordResetForm.confirmPassword,
    // //   })

    // //   const response = await axios.request({ url: endpoint, ...requestOptions })
    // //   const { message } = response.data

    // //   toast({ title: 'Success', description: message, variant: 'success' })
    // //   navigate('/dashboard')
    // // } catch (error: any) {
    // //   const errorData = error?.response?.data
    // //   toast({
    // //     title: errorData?.message || 'Password reset failed',
    // //     description: errorData?.error,
    // //     variant: 'error',
    // //   })
    // // }

    // setLoading(false)
  }
  const handleOnBackToLogin = () => {
    navigateTo('/auth/login')
  }

  return (
    <PasswordReset
      passwordResetForm={passwordResetForm}
      confirmationTokenLoading={confirmationTokenLoading}
      onPasswordResetFormChange={handleOnPasswordResetFormChange}
      onPasswordResetFormSubmit={handleOnPasswordResetFormSubmit}
      onBackToLogin={handleOnBackToLogin}
    />
  )
}

export default PasswordResetContainer
