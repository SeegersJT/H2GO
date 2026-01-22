import CustomersHome from '@/components/dashboard/customers/home/CustomersHome.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { requestCustomersData } from '@/redux/actions/Customers.action'
import { CustomerAnalyticsData } from '@/redux/types/Customer.type'
import { navigateTo } from '@/utils/Navigation'
import { Utils } from '@/utils/Utils'
import { useEffect, useState } from 'react'

function CustomersHomeContainer() {
  const dispatch = useAppDispatch()

  const { customersData } = useAppSelector((state) => state.customers)

  const [filteredCustomersData, setFilteredCustomersData] = useState([])
  const [customerSearch, setCustomerSearch] = useState(null)
  const [selectedFilterStatus, setSelectedFilterStatus] = useState('all')
  const [customerAnalytics, setCustomerAnalytics] = useState<CustomerAnalyticsData>({
    totalCustomers: 0,
    active: 0,
    inactive: 0,
    suspended: 0,
    monthlyRevenue: 0,
  })

  const handleOnInsertCustomerClick = () => {
    navigateTo('/dashboard/customers/insert')
  }

  const handleOnSelectedFilterStatusChange = (value) => {
    setSelectedFilterStatus(value)
  }

  const handleOnCustomerSearchChange = (value) => {
    setCustomerSearch(value)
  }

  const handleOnCustomerTableClick = (value) => {
    // Navigate to Customer Edit Page
  }

  useEffect(() => {
    dispatch(requestCustomersData())
  }, [dispatch])

  useEffect(() => {
    setFilteredCustomersData(customersData)

    const totalCustomers = customersData.length
    const active = customersData.filter((c) => c.status === 'active').length
    const inactive = customersData.filter((c) => c.status === 'inactive').length
    const suspended = customersData.filter((c) => c.status === 'suspended').length
    const monthlyRevenue = customersData.reduce((sum, c) => sum + c.monthly_payment, 0)

    setCustomerAnalytics({
      totalCustomers,
      active,
      inactive,
      suspended,
      monthlyRevenue,
    })
  }, [customersData])

  useEffect(() => {
    const search = Utils.toLowerSafe(customerSearch)

    const updatedFilter = customersData.filter((customer) => {
      const matchesStatus = selectedFilterStatus === 'all' || customer.status === selectedFilterStatus

      const matchesSearch = search === '' || Utils.flattenObjectStrings(customer).includes(search)

      return matchesStatus && matchesSearch
    })

    setFilteredCustomersData(updatedFilter)
  }, [customersData, selectedFilterStatus, customerSearch])

  return (
    <CustomersHome
      filteredCustomersData={filteredCustomersData}
      selectedFilterStatus={selectedFilterStatus}
      customerSearch={customerSearch}
      customerAnalytics={customerAnalytics}
      onInsertCustomerClick={handleOnInsertCustomerClick}
      onCustomerSearchChange={handleOnCustomerSearchChange}
      onSelectedFilterStatusChange={handleOnSelectedFilterStatusChange}
      onCustomerTableClick={handleOnCustomerTableClick}
    />
  )
}

export default CustomersHomeContainer
