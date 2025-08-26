// src/app/rootReducer.ts
import { combineReducers } from 'redux'
import authReducer from './Authentication.reducer'

const rootReducer = combineReducers({
  auth: authReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
