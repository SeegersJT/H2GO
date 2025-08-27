import { combineReducers } from 'redux'
import authReducer from './Authentication.reducer'
import confirmationTokenReducer from './ConfirmationToken.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
  token: confirmationTokenReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
