import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AuthenticationContainer from './containers/authentication/Authentication.container'
import LoginContainer from './containers/authentication/login/Login.container'
import PasswordForgotContainer from './containers/authentication/password-forgot/PasswordForgot.container'
import OneTimePinContainer from './containers/authentication/token/one-time-pin/OneTimePin.container'
import PasswordResetContainer from './containers/authentication/token/password-reset/PasswordReset.container'
import TokenContainer from './containers/authentication/token/Token.container'
import TokenValidateContainer from './containers/authentication/token/validate/TokenValidate.container'
import DashboardContainer from './containers/dashboard/Dashboard.container'
import DashboardHomeContainer from './containers/dashboard/home/DashboardHome.container'
import GlobalContainer from './containers/global/Global.container'
import NotFoundContainer from './containers/not-found/NotFound.container'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalContainer>
          <Routes>
            <Route path="/" element={<AuthenticationContainer />}>
              <Route index element={<Navigate to="/auth/login" replace />} />
              <Route path="/auth/login" element={<LoginContainer />} />

              <Route path="auth/password-forgot" element={<PasswordForgotContainer />} />

              <Route path="auth/token" element={<TokenContainer />}>
                <Route index element={<Navigate to="/auth/token/validate" replace />} />
                <Route path="validate" element={<TokenValidateContainer />} />

                <Route path="one-time-pin" element={<OneTimePinContainer />} />
                <Route path="password-reset" element={<PasswordResetContainer />} />

                <Route path="*" element={<Navigate to="/auth/token" replace />} />
              </Route>
            </Route>

            <Route path="/dashboard" element={<DashboardContainer />}>
              <Route index element={<Navigate to="/dashboard/home" replace />} />
              <Route path="home" element={<DashboardHomeContainer />} />
            </Route>
            {/* 
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<DashboardHome />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="routes" element={<DriverRoutes />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="deliveries" element={<AdminDeliveries />} />
          </Route> */}
            <Route path="*" element={<NotFoundContainer />} />
          </Routes>
        </GlobalContainer>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
