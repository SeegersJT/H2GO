import { combineReducers } from 'redux'
import authReducer from './Authentication.reducer'
import confirmationTokenReducer from './ConfirmationToken.reducer'
import userReducer from './User.reducer'
import customersReducer from './Customers.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  token: confirmationTokenReducer,
  user: userReducer,
  customers: customersReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
