export const RESET_STORE = '[ROOT] - RESET STORE' as const

export const resetStore = () => ({
  type: RESET_STORE,
})

export type RootAction = ReturnType<typeof resetStore>
