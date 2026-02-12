import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CustomButton } from '@/components/ui/custom/CustomButton'
import CustomLabel from '@/components/ui/custom/CustomLabel'
import CustomMetric from '@/components/ui/custom/CustomMetric'
import CustomSelect from '@/components/ui/custom/CustomSelect'
import { CustomTable } from '@/components/ui/custom/CustomTable'
import { addressColumns } from '@/containers/dashboard/customers/details/home/CustomerHome.helper'
import { Address } from '@/redux/types/Address.type'
import { Customer } from '@/redux/types/Customer.type'
import { Utils } from '@/utils/Utils'
import { ArrowLeft, Calendar, MapPin, Package, TrendingUp } from 'lucide-react'

function CustomerHome({ selectedCustomerData = null, onNavigateToCustomerHome }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <CustomButton variant="ghost" size="icon" onClick={onNavigateToCustomerHome}>
            <ArrowLeft className="h-5 w-5" />
          </CustomButton>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{`${selectedCustomerData?.name} ${selectedCustomerData?.surname}`}</h1>
            <p className="text-muted-foreground">{`Customer ID: ${selectedCustomerData?.user_no}`}</p>
          </div>
          <Badge className={`bg-green-100 text-green-800 border-0`}>
            {Utils.getUserStatus(selectedCustomerData?.confirmed, selectedCustomerData?.active)}
          </Badge>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CustomMetric
          title={'Total Deliveries'}
          data={47}
          description={'20% Delivery Success Rate'}
          icon={<Package className="h-4 w-4 text-muted-foreground" />}
        />
        <CustomMetric
          title={'Total Spent'}
          data={'R 12 000,00'}
          description={'R 200,00 / month avg'}
          icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
        />
        <CustomMetric
          title={'Active Subscriptions'}
          data={1}
          description={'Across 2 addresses'}
          icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
        />
        <CustomMetric
          title={'Last Delivery'}
          data={'2025-01-23'}
          description={'Member since 2023-01-01'}
          icon={<MapPin className="h-4 w-4 text-muted-foreground" />}
        />
      </div>

      {/* Customer Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Summary</CardTitle>
          <CardDescription>Overview of customer information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{selectedCustomerData?.email_address}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Phone</p>
              <p className="font-medium">{selectedCustomerData?.mobile_number}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className={`bg-green-100 text-green-800 border-0 mt-1`}>
                {Utils.getUserStatus(selectedCustomerData?.confirmed, selectedCustomerData?.active)}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Member Since</p>
              <p className="font-medium">{Utils.formatDateTime(selectedCustomerData?.createdAt)}</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="font-medium">{'WIP - Will be added in the Future.'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Addresses</CardTitle>
          <CardDescription>Addresses linked to this customer - click to view subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <CustomLabel title={'Search'} placeholder={'Search customers...'} value={null} onChange={() => {}} clearable />
            <CustomSelect
              title="Filter Status"
              value={null}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Suspended', value: 'suspended' },
              ]}
              onChange={() => {}}
            />
          </div>

          <CustomTable<Address> columns={addressColumns} data={selectedCustomerData} rowKey={(row) => row._id} onRowClick={() => {}} />
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomerHome
