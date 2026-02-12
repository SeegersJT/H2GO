import { Address } from '@/redux/types/Address.type'
import { CustomTableColumn } from '@/redux/types/CustomTableColumn'
import { Utils } from '@/utils/Utils'
import { Badge, MapPin } from 'lucide-react'

export const addressColumns: CustomTableColumn<Address>[] = [
  {
    id: 'label',
    label: 'Label',
    render: (_, address) => (
      <div>
        <div className="text-sm text-muted-foreground">{address.label}</div>
      </div>
    ),
  },
  {
    id: 'address_no',
    label: 'Address',
    render: (_, address) => (
      <div className="flex items-start gap-1 text-sm">
        <MapPin className="mt-0.5 h-3 w-3 text-muted-foreground" />
        <span className="truncate">
          {[address?.address_line_01, address?.address_line_02, address?.suburb, address?.city, address?.region, address?.postal_code]
            .filter(Boolean)
            .join(', ')}
        </span>
      </div>
    ),
  },
  {
    id: 'location',
    label: 'Coordinates',
    cellClassName: 'max-w-[240px]',
    render: (_, address) => <div className="flex items-start gap-1 text-sm">{`${address?.lat}, ${address?.lng}`}</div>,
  },
  {
    id: 'is_default',
    label: 'Status',
    cellClassName: 'max-w-[240px]',
    render: (_, address) => (
      <Badge className={`${getCustomerStatusColor(address?.active, address?.is_default)} border-0`}>
        {Utils.getAddressStatus(address?.active, address?.is_default)}
      </Badge>
    ),
  },
  {
    id: 'createdAt',
    label: 'Created At',
    render: (_, address) => (
      <div className="space-y-1">
        <div className="text-sm text-muted-foreground">{Utils.formatDateTime(address?.createdAt)}</div>
      </div>
    ),
  },
]

export const getCustomerStatusColor = (active: boolean, isDefault: boolean) => {
  const status = Utils.getAddressStatus(active, isDefault)

  switch (status) {
    case 'default':
      return 'bg-green-500 text-white'
    case 'active':
      return 'bg-blue-500 text-white'
    case 'inactive':
      return 'bg-gray-500 text-white'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
