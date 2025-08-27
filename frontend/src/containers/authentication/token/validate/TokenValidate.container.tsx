import TokenValidate from '@/components/authentication/token/validate/TokenValidate.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import * as confirmationTokenActions from '@/redux/actions/ConfirmationToken.action'
import { useEffect } from 'react'

const TokenValidateContainer = () => {
  const dispatch = useAppDispatch()

  const { confirmationToken } = useAppSelector((state) => state.token)

  useEffect(() => {
    const handleConfirmationTokenValidate = () => {
      console.log('here1 ')
      dispatch(confirmationTokenActions.requestConfirmationTokenValidation({ confirmation_token: confirmationToken }))
    }

    if (confirmationToken) {
      console.log('here2 ')
      handleConfirmationTokenValidate()
    }
  }, [])

  return <TokenValidate />
}

export default TokenValidateContainer
