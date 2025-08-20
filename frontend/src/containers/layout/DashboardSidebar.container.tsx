import DashboardSidebar from '@/components/layout/DashboardSidebar.component'
import {
  Calendar,
  CreditCard,
  LayoutDashboard,
  Package,
  Settings,
  Truck,
  Users,
} from 'lucide-react'

const DashboardSidebarContainer = () => {
  const navigations = {
    customer: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'My Orders', href: '/dashboard/orders', icon: Package },
      { title: 'Delivery Schedule', href: '/dashboard/schedule', icon: Calendar },
      { title: 'Billing', href: '/dashboard/billing', icon: CreditCard },
      { title: 'Profile', href: '/dashboard/profile', icon: Users },
    ],
    admin: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: 'Customers', href: '/dashboard/customers', icon: Users },
      { title: 'Deliveries', href: '/dashboard/deliveries', icon: Truck },
      { title: 'Finance', href: '/dashboard/finance', icon: CreditCard },
      { title: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
    driver: [
      { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { title: "Today's Routes", href: '/dashboard/routes', icon: Map },
      { title: 'Deliveries', href: '/dashboard/deliveries', icon: Truck },
      { title: 'Profile', href: '/dashboard/profile', icon: Users },
    ],
  }

  const navigation = navigations.customer

  return (
    <DashboardSidebar
      title={'Customer Portal'}
      navigation={navigation}
      userRole={'customer'}
      className={''}
    />
  )
}

export default DashboardSidebarContainer
