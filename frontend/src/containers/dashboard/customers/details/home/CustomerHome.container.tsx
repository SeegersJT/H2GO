import CustomerHome from '@/components/dashboard/customers/details/home/CustomerHome.component'
import { toast } from '@/hooks/use-toast'
import * as customersActions from '@/redux/actions/Customers.action'
import { RootState } from '@/redux/Store.redux'
import { navigateTo } from '@/utils/Navigation'
import { Utils } from '@/utils/Utils'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

function CustomerHomeContainer() {
  const dispatch = useDispatch()

  const { context } = useParams<{ context: string }>()

  const { selectedCustomerData } = useSelector((state: RootState) => state.customers)

  const [filterAddressData. set]

  const handleOnNavigateToCustomerHome = () => {
    navigateTo('/dashboard/customers/home')
  }

  useEffect(() => {
    if (Utils.isNilOrEmpty(context)) {
      toast({
        title: 'Could not find Customer ID',
        description: 'Routing back to Customers Home',
        variant: 'warning',
      })
    }

    const params = {
      user_no: context,
    }

    dispatch(customersActions.requestSelectedCustomerData(params))
  }, [dispatch, context])

  return (
    <>
      <CustomerHome selectedCustomerData={selectedCustomerData} onNavigateToCustomerHome={handleOnNavigateToCustomerHome} />
    </>
  )
}

export default CustomerHomeContainer
