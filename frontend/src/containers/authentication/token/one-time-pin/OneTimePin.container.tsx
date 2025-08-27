import OneTimePin from '@/components/authentication/token/one-time-pin/OneTimePin.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { toast } from '@/hooks/use-toast'
import * as confirmationTokenAction from '@/redux/actions/ConfirmationToken.action'
import axios from 'axios'
import { useState } from 'react'
import * as api from '@/utils/api/Authentication.api'
import { navigateTo } from '@/utils/Navigation'

const OneTimePinContainer = () => {
  const dispatch = useAppDispatch()

  const { confirmationToken } = useAppSelector((state) => state.token)

  const [oneTimePin, setOneTimePin] = useState('')
  const [loading, setLoading] = useState(false)

  const handleOnOneTimePinChange = (value: string) => {
    setOneTimePin(value)
  }

  const handleOnOneTimePinSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)
    try {
      const [endpoint, requestOptions] = api.getAuthOneTimePinRequest({
        confirmation_token: confirmationToken!,
        one_time_pin: oneTimePin,
      })

      const response = await axios.request({ url: endpoint, ...requestOptions })
      const { data, message } = response.data

      toast({ title: 'Success', description: message, variant: 'success' })

      if (data?.confirmation_token) {
        dispatch(confirmationTokenAction.setConfirmationToken(data))
        navigate('/auth/token/password-reset')
      } else {
        navigate('/dashboard')
      }
    } catch (error: any) {
      const errorData = error?.response?.data
      toast({
        title: errorData?.message || 'Verification failed',
        description: errorData?.error,
        variant: 'error',
      })
    }
    setLoading(false)
  }

  const handleBackToLogin = () => {
    navigateTo('/auth/login')
  }

  return (
    <OneTimePin
      oneTimePin={oneTimePin}
      loading={loading}
      onOneTimePinChange={handleOnOneTimePinChange}
      onOneTimePinSubmit={handleOnOneTimePinSubmit}
      onBackToLogin={handleBackToLogin}
    />
  )
}

export default OneTimePinContainer
