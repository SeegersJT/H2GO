import * as actions from '../actions/Customers.action'
import { Customer } from '../types/Customer.type'

export interface CustomersState {
  customersData: Array<Customer>
  customersDataLoading: boolean
  customerInsertLoading: boolean
}

const initialState: CustomersState = {
  customersData: [],
  customersDataLoading: false,
  customerInsertLoading: false,
}

export default function customersReducer(state: CustomersState = initialState, action: actions.CustomerAction): CustomersState {
  switch (action.type) {
    case actions.CLEAR_CUSTOMERS:
      return initialState

    case actions.SET_CUSTOMERS_DATA_LOADING:
      return {
        ...state,
        customersDataLoading: action.payload,
      }

    case actions.SET_CUSTOMERS_DATA:
      return {
        ...state,
        customersData: action.payload,
      }

    case actions.SET_CUSTOMER_INSERT_LOADING:
      return {
        ...state,
        customerInsertLoading: action.payload,
      }

    default:
      return state
  }
}
