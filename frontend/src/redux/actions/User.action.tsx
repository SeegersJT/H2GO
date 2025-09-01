import { User } from '../types/User.type'

export const CLEAR_USER = '[USER] - USER - CLEAR' as const
export const SET_USER = '[USER] - USER - SET' as const

export const clearUser = () => ({
  type: CLEAR_USER,
})

export const setUser = (payload: User) => ({
  type: SET_USER,
  payload,
})

export const userActions = {
  clearUser,
  setUser,
}

export type UserAction = ReturnType<(typeof userActions)[keyof typeof userActions]>
