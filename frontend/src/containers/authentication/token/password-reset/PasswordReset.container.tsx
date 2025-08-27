import PasswordReset from '@/components/authentication/token/password-reset/PasswordReset.component'
import { useAppSelector } from '@/hooks/use-redux'
import { toast } from '@/hooks/use-toast'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as api from '@/utils/api/Authentication.api'

const PasswordResetContainer = () => {
  const navigate = useNavigate()
  const { confirmationToken } = useAppSelector((state) => state.token)

  const [passwordResetForm, setPasswordResetForm] = useState({
    password: '',
    confirmPassword: '',
  })
  const [loading, setLoading] = useState(false)

  const handleOnPasswordResetFormChange = (value: string, type: 'password' | 'confirmPassword') => {
    setPasswordResetForm({
      ...passwordResetForm,
      [type]: value,
    })
  }

  const handleOnPasswordResetFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const [endpoint, requestOptions] = api.getAuthPasswordResetRequest({
        confirmation_token: confirmationToken!,
        password: passwordResetForm.password,
        confirm_password: passwordResetForm.confirmPassword,
      })

      const response = await axios.request({ url: endpoint, ...requestOptions })
      const { message } = response.data

      toast({ title: 'Success', description: message, variant: 'success' })
      navigate('/dashboard')
    } catch (error: any) {
      const errorData = error?.response?.data
      toast({
        title: errorData?.message || 'Password reset failed',
        description: errorData?.error,
        variant: 'error',
      })
    }

    setLoading(false)
  }

  return (
    <PasswordReset
      passwordResetForm={passwordResetForm}
      loading={loading}
      onPasswordResetFormChange={handleOnPasswordResetFormChange}
      onPasswordResetFormSubmit={handleOnPasswordResetFormSubmit}
    />
  )
}

export default PasswordResetContainer
