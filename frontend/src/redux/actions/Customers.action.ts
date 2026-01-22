import { Customer, CustomerInsertData } from '../types/Customer.type'

export const CLEAR_CUSTOMERS = '[CUSTOMERS] - CUSTOMERS - CLEAR' as const

export const REQUEST_CUSTOMERS_DATA = '[CUSTOMERS] - CUSTOMERS DATA - REQUEST' as const
export const SET_CUSTOMERS_DATA_LOADING = '[CUSTOMERS] - CUSTOMERS DATA - SET - LOADING' as const
export const SET_CUSTOMERS_DATA = '[CUSTOMERS] - CUSTOMERS DATA - SET' as const

export const REQUEST_CUSTOMER_INSERT = '[CUSTOMERS] - CUSTOMER INSERT - REQUEST' as const
export const SET_CUSTOMER_INSERT_LOADING = '[CUSTOMERS] - CUSTOMER INSERT - SET - LOADING' as const

export const clearCustomers = () => ({
  type: CLEAR_CUSTOMERS,
})

export const requestCustomersData = () => ({
  type: REQUEST_CUSTOMERS_DATA,
})

export const setCustomersDataLoading = (payload: boolean) => ({
  type: SET_CUSTOMERS_DATA_LOADING,
  payload,
})

export const setCustomersData = (payload: Array<Customer>) => ({
  type: SET_CUSTOMERS_DATA,
  payload,
})

export const requestCustomerInsert = (payload: CustomerInsertData) => ({
  payload,
  type: REQUEST_CUSTOMER_INSERT,
})

export const setCustomerInserLoading = (payload: boolean) => ({
  type: SET_CUSTOMER_INSERT_LOADING,
  payload,
})

export const customersActions = {
  clearCustomers,
  requestCustomersData,
  setCustomersDataLoading,
  setCustomersData,
  requestCustomerInsert,
  setCustomerInserLoading,
}

export type CustomerAction = ReturnType<(typeof customersActions)[keyof typeof customersActions]>
