import { combineReducers } from 'redux'
import { RESET_STORE } from '../actions/Root.action'
import authReducer from './Authentication.reducer'
import confirmationTokenReducer from './ConfirmationToken.reducer'
import customersReducer from './Customers.reducer'
import userReducer from './User.reducer'

const appReducer = combineReducers({
  auth: authReducer,
  token: confirmationTokenReducer,
  user: userReducer,
  customers: customersReducer,
})

const rootReducer = (state: ReturnType<typeof appReducer> | undefined, action: any) => {
  if (action.type === RESET_STORE) {
    state = undefined
  }
  return appReducer(state, action)
}

export type RootState = ReturnType<typeof appReducer>
export default rootReducer
