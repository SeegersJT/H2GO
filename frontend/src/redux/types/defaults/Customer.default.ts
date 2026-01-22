import { CustomerInsertData } from '../Customer.type'

export const defaultCustomeInsertData: CustomerInsertData = {
  branch_id: null,
  name: null,
  surname: null,
  id_number: null,
  email_address: null,
  mobile_number: null,
  gender: null,
  password: 'password',
  user_type: 'CUSTOMER',
}
