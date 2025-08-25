import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { Provider as ReduxProvider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/Store.redux'

createRoot(document.getElementById('root')!).render(
  <ReduxProvider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </ReduxProvider>,
)
