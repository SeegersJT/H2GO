// src/redux/configureStore.ts

import { legacy_createStore as createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './reducers/_Root.reducer'
import rootSaga from './sagas/_Root.saga'
import { getAppVersion } from '@/utils/version'

export async function configureStore() {
  const version = getAppVersion()
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

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const sagaMiddleware = createSagaMiddleware()
  const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))
  sagaMiddleware.run(rootSaga)

  const persistor = persistStore(store)

  return { store, persistor, CURRENT_KEY }
}

export type AppDispatch = ReturnType<typeof createStore>['dispatch']
export type { RootState } from './reducers/_Root.reducer'
