import OneTimePin from '@/components/authentication/token/one-time-pin/OneTimePin.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { requestConfirmationTokenOneTimePin } from '@/redux/actions/ConfirmationToken.action'
import { ConfirmationTokenOneTimePin } from '@/redux/types/ConfirmationToken.type'
import { navigateTo } from '@/utils/Navigation'
import { useState } from 'react'

const OneTimePinContainer = () => {
  const dispatch = useAppDispatch()

  const { confirmationToken, confirmationTokenLoading } = useAppSelector((state) => state.token)

  const [oneTimePin, setOneTimePin] = useState('')

  const handleOnOneTimePinChange = (value: string) => {
    setOneTimePin(value)
  }

  const handleOnOneTimePinSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const payload: ConfirmationTokenOneTimePin = {
      confirmation_token: confirmationToken,
      one_time_pin: oneTimePin,
    }

    dispatch(requestConfirmationTokenOneTimePin(payload))
  }

  const handleBackToLogin = () => {
    navigateTo('/auth/login')
  }

  return (
    <OneTimePin
      oneTimePin={oneTimePin}
      confirmationTokenLoading={confirmationTokenLoading}
      onOneTimePinChange={handleOnOneTimePinChange}
      onOneTimePinSubmit={handleOnOneTimePinSubmit}
      onBackToLogin={handleBackToLogin}
    />
  )
}

export default OneTimePinContainer
