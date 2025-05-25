import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'

import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from '~/theme'
import App from '~/App'

// Cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// cấu hình MUI Dialog
import { ConfirmProvider } from 'material-ui-confirm'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { store } from './redux/store'
import { HelmetProvider } from 'react-helmet-async' // Đảm bảo đúng import
import { PersistGate } from 'redux-persist/integration/react'
import persistStore from 'redux-persist/es/persistStore'
import { injectStore } from './apis/api'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

injectStore(store)
const queryClient = new QueryClient()

const persistor = persistStore(store)
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <CssVarsProvider theme={theme}>
              <ConfirmProvider
                defaultOptions={{
                  allowClose: false,
                  buttonOrder: ['confirm', 'cancel'],

                  dialogProps: { maxWidth: 'xs' },
                  cancellationButtonProps: { color: 'inherit' },
                  confirmationButtonProps: { color: 'secondary', variant: 'outlined' }
                }}
              >
                {/* <GlobalStyles styles={{ textDecoration: 'none' }} /> */}
                <CssBaseline />
                <App />
                <ToastContainer position="bottom-left" theme="colored" />
              </ConfirmProvider>
            </CssVarsProvider>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </HelmetProvider>
  </BrowserRouter>
)
