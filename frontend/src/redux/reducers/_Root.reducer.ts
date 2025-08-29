import { combineReducers } from 'redux'
import authReducer from './Authentication.reducer'
import confirmationTokenReducer from './ConfirmationToken.reducer'
import userReducer from './User.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  token: confirmationTokenReducer,
  user: userReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
