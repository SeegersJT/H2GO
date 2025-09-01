export type Customer = {
  _id: string
  branch_id: string
  name: string
  surname: string
  id_number: string
  email_address: string
  mobile_number: string
  gender: string
  password_expiry: string
  user_type: string
  confirmed: boolean
  active: boolean
  failedLoginAttempts: number
  createdBy: string
  updatedBy: string
  user_no: string
  createdAt: Date
  updatedAt: Date
  lastLoginAt: Date
}
