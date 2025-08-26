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
        title: 'Invalid Token',
        description: 'Provided token is not valid',
        variant: 'warning',
      })
    }
  }, [confirmationToken])

  return <>{confirmationToken}</>
}

export default TokenContainer
