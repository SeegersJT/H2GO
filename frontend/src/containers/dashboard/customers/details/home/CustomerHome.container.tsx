import CustomerHome from '@/components/dashboard/customers/details/home/CustomerHome.component'
import { navigateTo } from '@/utils/Navigation'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'

function CustomerHomeContainer() {
  const { context } = useParams<{ context: string }>()

  console.log(context)

  const handleOnNavigateToCustomerHome = () => {
    navigateTo('/dashboard/customers/home')
  }

  useEffect(() => {
    // Get customer specific data and all addresses
  }, [context])

  return (
    <>
      <CustomerHome onNavigateToCustomerHome={handleOnNavigateToCustomerHome} />
    </>
  )
}

export default CustomerHomeContainer
