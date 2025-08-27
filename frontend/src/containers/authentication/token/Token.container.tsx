import Token from '@/components/authentication/token/Token.component'
import { useAppSelector } from '@/hooks/use-redux'
import { toast } from '@/hooks/use-toast'
import { navigateTo } from '@/utils/Navigation'
import { Utils } from '@/utils/Utils'
import { useEffect } from 'react'

const TokenContainer = () => {
  const { confirmationToken } = useAppSelector((state) => state.token)

  useEffect(() => {
    if (Utils.isNull(confirmationToken)) {
      toast({
        title: 'Invalid token',
        description: 'Your confirmation token is missing or expired. Please request a new one.',
        variant: 'warning',
      })

      navigateTo('/')
    }
  }, [confirmationToken])

  return <Token />
}

export default TokenContainer
