import { Address } from './Address.type'

export type Customer = {
  _id: string
  branch_id: string

  name: string
  surname: string
  id_number: string
  email_address: string
  mobile_number: string
  gender: 'MALE' | 'FEMALE' | 'OTHER'

  user_type: 'CUSTOMER'
  user_no: string

  confirmed: boolean
  active: boolean
  status: 'active' | 'inactive' | 'suspended'

  failedLoginAttempts: number
  password_expiry: string
  lastLoginAt?: string

  createdBy: string
  updatedBy: string
  createdAt: string
  updatedAt: string
  __v: number

  address?: Address

  monthly_payment: number
  payment_type: string | null
}

export type CustomerAnalyticsData = {
  totalCustomers: number
  active: number
  inactive: number
  suspended: number
  monthlyRevenue: number
}

export type CustomerInsertData = {
  branch_id: number | null
  name: string | null
  surname: string | null
  id_number: string | null
  email_address: string | null
  mobile_number: string | null
  gender: 'male' | 'female' | null
  password: string
  user_type: string
}

export type SelectedCustomerParams = {
  user_no: string | null
}
