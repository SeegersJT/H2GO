export interface AuthState {
  _id: string | null
  branch_id: string | null
  name: string | null
  surname: string | null
  id_number: string | null
  email_address: string | null
  mobile_number: string | null
  gender: string | null
  password_expiry: string | null
  user_type: string | null
  confirmed: string | null
  active: string | null
  failedLoginAttempts: string | null
  createdBy: string | null
  updatedBy: string | null
  user_no: string | null
  createdAt: string | null
  updatedAt: string | null
  lastLoginAt: string | null
}

const initialState: AuthState = {
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
}

export default function authReducer(state: AuthState = initialState, action: UserAction): AuthState {
  switch (action.type) {
    default:
      return state
  }
}
