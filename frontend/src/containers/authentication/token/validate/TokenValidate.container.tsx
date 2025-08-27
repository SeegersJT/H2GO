import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import * as confirmationTokenActions from '@/redux/actions/ConfirmationToken.action'
import TokenValidate from '@/components/authentication/token/validate/TokenValidate.component'

const TokenValidateContainer = () => {
  const dispatch = useAppDispatch()

  const { confirmationToken } = useAppSelector((state) => state.token)

  useEffect(() => {
    const handleConfirmationTokenValidate = () => {
      dispatch(confirmationTokenActions.requestConfirmationTokenValidation({ confirmation_token: confirmationToken }))
    }

    if (confirmationToken) {
      handleConfirmationTokenValidate()
    }
  }, [confirmationToken, dispatch])

  return <TokenValidate />
}

export default TokenValidateContainer
