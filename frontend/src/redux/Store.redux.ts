/* eslint-disable @typescript-eslint/no-explicit-any */
import { legacy_createStore as createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage
import rootReducer from './reducers/_Root.reducer'
import { getAppVersion } from '@/utils/version'
import rootSaga from './sagas/_Root.saga'

const CURRENT_KEY = `H2GO-${getAppVersion()}`

// --- Persist config with versioning ---
const persistConfig = {
  key: CURRENT_KEY,
  storage,
  migrate: async (state: any) => {
    if (typeof window !== 'undefined' && window.localStorage) {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('persist:H2GO-') && key !== `persist:${CURRENT_KEY}`) {
          localStorage.removeItem(key)
        }
      })
    }
    return undefined
  },
  whitelist: ['auth'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// --- Saga middleware ---
const sagaMiddleware = createSagaMiddleware()

// --- Create store ---
export const store = createStore(persistedReducer, applyMiddleware(sagaMiddleware))

// --- Run root saga ---
sagaMiddleware.run(rootSaga)

// --- Persistor (controls rehydration / purge) ---
export const persistor = persistStore(store)

// --- Types for hooks ---
export type AppDispatch = typeof store.dispatch
export type { RootState } from './reducers/_Root.reducer'
