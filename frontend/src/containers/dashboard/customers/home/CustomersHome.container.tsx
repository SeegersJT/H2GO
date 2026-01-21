import CustomersHome from '@/components/dashboard/customers/home/CustomersHome.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { requestCustomersData } from '@/redux/actions/Customers.action'
import { Customer } from '@/redux/types/Customers.type'
import { useEffect, useState } from 'react'

function CustomersHomeContainer() {
  const dispatch = useAppDispatch()

  const { customersData } = useAppSelector((state) => state.customers)

  const [filteredCustomersData, setFilteredCustomersData] = useState([])

  useEffect(() => {
    dispatch(requestCustomersData())
  }, [dispatch])

  useEffect(() => {
    setFilteredCustomersData(customersData)
  }, [customersData])

  return <CustomersHome filteredCustomersData={filteredCustomersData} />
}

export default CustomersHomeContainer
