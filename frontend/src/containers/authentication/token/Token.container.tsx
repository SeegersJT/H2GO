import Token from '@/components/authentication/token/Token.component'
import { useAppSelector } from '@/hooks/use-redux'
import { toast } from '@/hooks/use-toast'
import { Utils } from '@/utils/Utils'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const TokenContainer = () => {
  const navigate = useNavigate()

  const { confirmationToken } = useAppSelector((state) => state.token)

  useEffect(() => {
    if (Utils.isNull(confirmationToken)) {
      toast({
        title: 'Invalid token',
        description: 'Your confirmation token is missing or expired. Please request a new one.',
        variant: 'warning',
      })
      navigate('/')
    }
  }, [confirmationToken, navigate])

  return <Token />
}

export default TokenContainer
