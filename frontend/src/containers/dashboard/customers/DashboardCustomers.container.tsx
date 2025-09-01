import DashboardCustomers from '@/components/dashboard/customers/DashboardCustomers.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { requestCustomersData } from '@/redux/actions/Customers.action'
import { Customer } from '@/redux/types/Customers.type'
import { useEffect, useState } from 'react'

const DashboardCustomersContainer = () => {
  const dispatch = useAppDispatch()

  const { customersData } = useAppSelector((state) => state.customers)

  useEffect(() => {
    dispatch(requestCustomersData())
  }, [dispatch])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('active')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const filteredCustomers = customersData.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) || customer.email_address.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Cash'
      case 'card':
        return 'Card'
      case 'bank_transfer':
        return 'Bank Transfer'
      case 'mobile':
        return 'Mobile'
      case 'other':
        return 'Other'
      default:
        return method
    }
  }

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingCustomer(null)
    setIsDialogOpen(true)
  }

  const stats = {
    total: customersData.length,
    active: customersData.filter((c) => c.status === 'active').length,
    inactive: customersData.filter((c) => c.status === 'inactive').length,
    totalRevenue: customersData.reduce((sum, c) => sum + (c.status === 'active' ? c.monthly_payment : 0), 0),
  }

  // =================================================================

  return (
    <DashboardCustomers
      handleAdd={handleAdd}
      stats={stats}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      filterStatus={filterStatus}
      setFilterStatus={setFilterStatus}
      filteredCustomers={filteredCustomers}
      getPaymentMethodLabel={getPaymentMethodLabel}
      getStatusColor={getStatusColor}
      handleEdit={handleEdit}
      isDialogOpen={isDialogOpen}
      setIsDialogOpen={setIsDialogOpen}
      editingCustomer={editingCustomer}
    />
  )
}

export default DashboardCustomersContainer
