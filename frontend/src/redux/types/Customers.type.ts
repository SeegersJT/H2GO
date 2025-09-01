export type Customer = {
  _id: string
  user_no: string
  branch_id: string
  branch_name: string
  name: string
  surname: string
  id_number: string
  email_address: string
  mobile_number: string
  gender: string
  password_expiry: string
  user_type: string
  status: 'active' | 'inactive'
  createdBy: string
  createdAt: Date
  address: null
  monthly_payment: number
  payment_type: string | null
}
