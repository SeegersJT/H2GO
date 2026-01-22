import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Customer } from '@/redux/types/Customer.type'
import { CustomTableColumn } from '@/redux/types/CustomTableColumn'
import { Utils } from '@/utils/Utils'
import { Ban, Edit, Mail, MapPin, Phone, Trash2 } from 'lucide-react'

export const customerColumns: CustomTableColumn<Customer>[] = [
  {
    id: 'name',
    label: 'Customer',
    render: (_, customer) => (
      <div>
        <div className="font-medium">
          {customer.name} {customer.surname}
        </div>
        <div className="text-sm text-muted-foreground">{customer.user_no}</div>
      </div>
    ),
  },

  {
    id: 'email_address',
    label: 'Contact',
    render: (_, customer) => (
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
    ),
  },

  {
    id: 'address',
    label: 'Address',
    cellClassName: 'max-w-[240px]',
    render: (_, customer) => {
      if (!customer.address) {
        return (
          <div className="flex items-start gap-1 text-sm">
            <Ban className="mt-0.5 h-3 w-3 text-muted-foreground" />
            <span className="text-muted-foreground">No Address Found</span>
          </div>
        )
      }

      return (
        <div className="flex items-start gap-1 text-sm">
          <MapPin className="mt-0.5 h-3 w-3 text-muted-foreground" />
          <span className="truncate">
            {[
              customer.address?.address_line_01,
              customer.address?.address_line_02,
              customer.address?.suburb,
              customer.address?.city,
              customer.address?.region,
              customer.address?.postal_code,
            ]
              .filter(Boolean)
              .join(', ')}
          </span>
        </div>
      )
    },
  },

  {
    id: '_id',
    label: 'Delivery',
    render: () => (
      <div className="space-y-1">
        <div className="text-sm font-medium">Wednesdays</div>
        <div className="text-sm text-muted-foreground">1 container</div>
      </div>
    ),
  },

  {
    id: 'monthly_payment',
    label: 'Payment',
    render: (value, customer) => (
      <div className="space-y-1">
        <div className="text-sm font-medium">{`${Utils.formatCurrency(Number(value))} / month`}</div>
        <div className="text-sm text-muted-foreground">{customer.payment_type || 'N/A'}</div>
      </div>
    ),
  },

  {
    id: 'status',
    label: 'Status',
    render: (value: Customer['status']) => <Badge className={`${getCustomerStatusColor(value)} border-0`}>{value}</Badge>,
  },
]

export const getCustomerStatusColor = (status: Customer['status']) => {
  switch (status) {
    case 'active':
      return 'bg-green-500 text-white'
    case 'inactive':
      return 'bg-gray-500 text-white'
    case 'suspended':
      return 'bg-red-500 text-white'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
