import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import App from './App'
import './index.css'
import { configureStore } from './redux/Store.redux'
import { setupAxiosInterceptors } from './utils/api/AxiosClient.api'

const { store, persistor } = await configureStore()

setupAxiosInterceptors(store)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)
