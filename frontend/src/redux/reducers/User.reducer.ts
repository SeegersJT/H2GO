import * as actions from '../actions/User.action'
import { User } from '../types/User.type'

export interface UserState extends User {
  userLoading: boolean
}

const initialState: UserState = {
  _id: null,
  branch_id: null,
  name: null,
  surname: null,
  id_number: null,
  email_address: null,
  mobile_number: null,
  gender: null,
  password_expiry: null,
  user_type: null,
  confirmed: null,
  active: null,
  failedLoginAttempts: null,
  createdBy: null,
  updatedBy: null,
  user_no: null,
  createdAt: null,
  updatedAt: null,
  lastLoginAt: null,
  userLoading: false,
}

export default function userReducer(state: UserState = initialState, action: actions.UserAction): UserState {
  switch (action.type) {
    case actions.CLEAR_USER:
      return initialState

    case actions.SET_USER:
      return {
        ...state,
        ...action.payload,
      }

    default:
      return state
  }
}
