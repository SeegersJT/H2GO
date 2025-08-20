import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NotFoundContainer from './containers/not-found/NotFound.container'
import LoginContainer from './containers/login/Login.container'
import DashboardContainer from './containers/dashboard/Dashboard.container'
import DashboardHomeContainer from './containers/dashboard/home/DashboardHome.container'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginContainer />} />

          <Route path="/dashboard" element={<DashboardContainer />}>
            <Route index element={<DashboardHomeContainer />} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
