import { getAppVersion } from '@/utils/version'
import { configureStore as createToolkitStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import createSagaMiddleware from 'redux-saga'
import rootReducer from './reducers/_Root.reducer'
import rootSaga from './sagas/_Root.saga'

export async function configureStore() {
  const version = await getAppVersion()
  const CURRENT_KEY = `H2GO-${version}`

  const persistConfig = {
    key: CURRENT_KEY, // <-- use the computed key
    storage, // <-- web localStorage
    whitelist: ['auth', 'user'], // <-- array of top-level slice names
    // blacklist: ['ui'],             // (optional) explicitly not persisted
    // version: 1,                    // (optional) if you plan migrations
  }

  const persistedReducer = persistReducer(persistConfig, rootReducer)

  const sagaMiddleware = createSagaMiddleware()
  const store = createToolkitStore({
    reducer: persistedReducer,
    middleware: (getDefault) => getDefault({ thunk: false, serializableCheck: false }).concat(sagaMiddleware),
  })

  sagaMiddleware.run(rootSaga)

  const persistor = persistStore(store)
  return { store, persistor }
}

export type AppDispatch = ReturnType<typeof createToolkitStore>['dispatch']
export type RootState = ReturnType<typeof rootReducer>
