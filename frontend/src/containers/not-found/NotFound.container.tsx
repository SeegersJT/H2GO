import NotFound from '@/components/not-found/NotFound.component'
import { useToast } from '@/hooks/use-toast'
import { useEffect } from 'react'

const NotFoundContainer = () => {
  const { toast } = useToast()

  useEffect(() => {
    toast({
      title: 'Page Not Found',
      description: 'The page you’re looking for doesn’t exist or may have been moved.',
      variant: 'warning',
    })
  }, [toast])

  return <NotFound />
}

export default NotFoundContainer
