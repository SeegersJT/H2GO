// src/features/auth/actions.ts

// Keep constants in one place
export const SET_TOKEN = '[AUTHENTICATION] - '

// Action creators
export const setToken = (token: string) => ({
  type: SET_TOKEN as typeof SET_TOKEN,
  payload: token,
})

// Collect actions in an object (nice for imports)
export const authActions = {
  setToken,
}

// Infer union type automatically
export type AuthAction = ReturnType<(typeof authActions)[keyof typeof authActions]>
