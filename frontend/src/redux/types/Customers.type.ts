export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  deliveryDay: string
  containerCount: number
  monthlyAmount: number
  paymentMethod: 'debit_order' | 'eft' | 'cash'
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
  lastDelivery: string
}
