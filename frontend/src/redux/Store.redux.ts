import { configureStore as createToolkitStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer, { type RootState } from './reducers/_Root.reducer'
import rootSaga from './sagas/_Root.saga'
import { getAppVersion } from '@/utils/version'

export async function configureStore() {
  const version = await getAppVersion()
  const CURRENT_KEY = `H2GO-${version}`

  const persistConfig = {
    key: CURRENT_KEY,
    storage,
    migrate: async (state: any) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        Object.keys(localStorage).forEach((k) => {
          if (k.startsWith('persist:H2GO-') && k !== `persist:${CURRENT_KEY}`) {
            localStorage.removeItem(k)
          }
        })
      }
      return undefined
    },
    whitelist: ['auth'],
  }

  const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer)

  const sagaMiddleware = createSagaMiddleware()
  const store = createToolkitStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
  })

  sagaMiddleware.run(rootSaga)

  const persistor = persistStore(store)

  return { store, persistor, CURRENT_KEY }
}

export type AppDispatch = ReturnType<typeof createToolkitStore>['dispatch']
export type { RootState }
