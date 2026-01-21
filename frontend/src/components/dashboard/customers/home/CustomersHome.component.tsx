import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import CustomLabel from '@/components/ui/custom/CustomLabel'
import CustomMetric from '@/components/ui/custom/CustomMetric'
import Metric from '@/components/ui/custom/CustomMetric'
import CustomSelect from '@/components/ui/custom/CustomSelect'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, HandCoins, Lock, Mail, MapPin, Phone, Plus, Search, Trash2, UserCheck, Users, UserX } from 'lucide-react'

function CustomersHome({ filteredCustomersData }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customer Management</h1>
          <p className="text-muted-foreground">Manage all customer accounts and delivery schedules</p>
        </div>
        <Button onClick={() => {}} className="bg-primary hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <CustomMetric title={'Total Customers'} data={'1'} icon={<Users className="h-4 w-4 text-muted-foreground" />} />
        <CustomMetric title={'Active'} data={'1'} icon={<UserCheck className="h-4 w-4 text-muted-foreground" />} />
        <CustomMetric title={'Inactive'} data={'0'} icon={<UserX className="h-4 w-4 text-muted-foreground" />} />
        <CustomMetric title={'Suspended'} data={'0'} icon={<Lock className="h-4 w-4 text-muted-foreground" />} />
        <CustomMetric title={'Monthly Revenue'} data={'R1,000'} icon={<HandCoins className="h-4 w-4 text-muted-foreground" />} />
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Customer List</CardTitle>
          <CardDescription>View and manage all customer accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <CustomLabel title={'Search'} placeholder={'Search customers...'} onChange={() => {}} />
            <CustomSelect
              title="Filter Status"
              value={'all'}
              options={[
                { label: 'All Status', value: 'all' },
                { label: 'Active', value: 'active' },
                { label: 'Inactive', value: 'inactive' },
                { label: 'Suspended', value: 'suspended' },
              ]}
              onChange={() => {}}
            />
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomersData.map((customer) => (
                  <TableRow key={customer._id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{`${customer.name} ${customer.surname}`}</div>
                        <div className="text-sm text-muted-foreground">{customer.user_no}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {customer.email_address}
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Phone className="h-3 w-3" />
                          {customer.mobile_number}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-start gap-1 text-sm">
                        <MapPin className="h-3 w-3 mt-0.5 text-muted-foreground" />
                        <span className="max-w-150 truncate">{`${customer?.address?.address_line_01}, ${customer?.address?.address_line_02}, ${customer?.address?.suburb}, ${customer?.address?.city}, ${customer?.address?.region}, ${customer?.address?.postal_code}`}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Wednesdays</div>
                        <div className="text-sm text-muted-foreground">1 containers</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">R{customer.monthly_payment.toLocaleString()}/month</div>
                        <div className="text-sm text-muted-foreground">{customer.payment_type ? customer.payment_type : 'N/A'}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${'a'} border-0`}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => {}}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CustomersHome
