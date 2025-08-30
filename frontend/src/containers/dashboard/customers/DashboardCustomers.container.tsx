import DashboardCustomers from '@/components/dashboard/customers/DashboardCustomers.component'
import { useAppDispatch, useAppSelector } from '@/hooks/use-redux'
import { Customer } from '@/redux/types/Customers.type'
import { useEffect, useState } from 'react'

const DashboardCustomersContainer = () => {
  const dispatch = useAppDispatch()

  const { customersData } = useAppSelector((state) => state.customers)

  useEffect(() => {
    dispatch(requestCustomers())
  }, [dispatch])

  // =================================================================

  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 'CUST001',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+27 11 123 4567',
      address: '123 Oak Street, Sandton, Johannesburg',
      deliveryDay: 'Monday',
      containerCount: 2,
      monthlyAmount: 720,
      paymentMethod: 'debit_order',
      status: 'active',
      joinDate: '2023-01-15',
      lastDelivery: '2024-01-08',
    },
    {
      id: 'CUST002',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      phone: '+27 11 234 5678',
      address: '456 Pine Avenue, Rosebank, Johannesburg',
      deliveryDay: 'Wednesday',
      containerCount: 1,
      monthlyAmount: 360,
      paymentMethod: 'eft',
      status: 'active',
      joinDate: '2023-03-22',
      lastDelivery: '2024-01-10',
    },
    {
      id: 'CUST003',
      name: 'Mike Davis',
      email: 'mike@example.com',
      phone: '+27 11 345 6789',
      address: '789 Elm Road, Hyde Park, Johannesburg',
      deliveryDay: 'Friday',
      containerCount: 3,
      monthlyAmount: 1080,
      paymentMethod: 'debit_order',
      status: 'inactive',
      joinDate: '2022-11-10',
      lastDelivery: '2023-12-29',
    },
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null)

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.address.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || customer.status === filterStatus

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: Customer['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodLabel = (method: Customer['paymentMethod']) => {
    switch (method) {
      case 'debit_order':
        return 'Debit Order'
      case 'eft':
        return 'EFT'
      case 'cash':
        return 'Cash'
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
    total: customers.length,
    active: customers.filter((c) => c.status === 'active').length,
    inactive: customers.filter((c) => c.status === 'inactive').length,
    suspended: customers.filter((c) => c.status === 'suspended').length,
    totalRevenue: customers.reduce((sum, c) => sum + (c.status === 'active' ? c.monthlyAmount : 0), 0),
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
