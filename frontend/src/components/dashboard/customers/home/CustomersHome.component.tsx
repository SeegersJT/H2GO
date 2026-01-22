import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import CustomLabel from '@/components/ui/custom/CustomLabel'
import CustomMetric from '@/components/ui/custom/CustomMetric'
import CustomSelect from '@/components/ui/custom/CustomSelect'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { HandCoins, Lock, Plus, UserCheck, Users, UserX } from 'lucide-react'
import { CustomTable } from '@/components/ui/custom/CustomTable'
import { Customer } from '@/redux/types/Customer.type'
import { customerColumns } from '@/containers/dashboard/customers/home/CustomersHome.helper'
import { Utils } from '@/utils/Utils'
import { CustomButton } from '@/components/ui/custom/CustomButton'

function CustomersHome({
  filteredCustomersData,
  selectedFilterStatus,
  customerSearch,
  customerAnalytics,
  onInsertCustomerClick,
  onSelectedFilterStatusChange,
  onCustomerSearchChange,
  onCustomerTableClick,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">Manage all customer accounts and delivery schedules</p>
        </div>
        <CustomButton className="bg-primary hover:bg-primary/90" onClick={onInsertCustomerClick}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </CustomButton>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <CustomMetric
          title={'Total Customers'}
          data={customerAnalytics?.totalCustomers.toString()}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <CustomMetric title={'Active'} data={customerAnalytics?.active.toString()} icon={<UserCheck className="h-4 w-4 text-muted-foreground" />} />
        <CustomMetric title={'Inactive'} data={customerAnalytics?.inactive.toString()} icon={<UserX className="h-4 w-4 text-muted-foreground" />} />
        <CustomMetric title={'Suspended'} data={customerAnalytics?.suspended.toString()} icon={<Lock className="h-4 w-4 text-muted-foreground" />} />
        <CustomMetric
          title={'Monthly Revenue'}
          data={`${Utils.formatCurrency(customerAnalytics?.monthlyRevenue.toString())}`}
          icon={<HandCoins className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>View and manage all customer accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <CustomLabel title={'Search'} placeholder={'Search customers...'} value={customerSearch} onChange={onCustomerSearchChange} clearable />
            <CustomSelect
              title="Filter Status"
              value={selectedFilterStatus}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Suspended', value: 'suspended' },
              ]}
              onChange={onSelectedFilterStatusChange}
            />
          </div>

          <CustomTable<Customer> columns={customerColumns} data={filteredCustomersData} rowKey={(row) => row._id} onRowClick={onCustomerTableClick} />
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomersHome
