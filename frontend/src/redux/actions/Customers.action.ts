import { Customer } from '../types/Customers.type'

export const CLEAR_CUSTOMERS = '[CUSTOMERS] - CUSTOMERS - CLEAR' as const

export const REQUEST_CUSTOMERS_DATA = '[CUSTOMERS] - CUSTOMERS DATA - REQUEST' as const
export const SET_CUSTOMERS_DATA_LOADING = '[CUSTOMERS] - CUSTOMERS DATA - SET - LOADING' as const
export const SET_CUSTOMERS_DATA = '[CUSTOMERS] - CUSTOMERS DATA - SET' as const

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

export const customersActions = {
  clearCustomers,
  requestCustomersData,
  setCustomersDataLoading,
  setCustomersData,
}

export type CustomerAction = ReturnType<(typeof customersActions)[keyof typeof customersActions]>
