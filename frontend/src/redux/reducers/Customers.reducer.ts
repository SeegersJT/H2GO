import * as actions from '../actions/Customers.action'
import { Customer } from '../types/Customers.type'

export interface CustomersState {
  customersData: Array<Customer>
  customersDataLoading: boolean
}

const initialState: CustomersState = {
  customersData: [],
  customersDataLoading: false,
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

    default:
      return state
  }
}
