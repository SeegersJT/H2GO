import DashboardSidebar from '@/components/layout/DashboardSidebar.component'
import { useAppSelector } from '@/hooks/use-redux'
import { Utils } from '@/utils/Utils'
import { Calendar, CreditCard, LayoutDashboard, Package, Settings, Truck, Users } from 'lucide-react'

const DashboardSidebarContainer = () => {
  const { user_type } = useAppSelector((state) => state.user)

  const navigations = {
    DEVELOPER: [
      { title: 'Dashboard', href: '/dashboard/home', icon: LayoutDashboard },
      { title: 'Customers', href: '/dashboard/customers', icon: Users },
      { title: 'Deliveries', href: '/dashboard/deliveries', icon: Truck },
      { title: 'Finance', href: '/dashboard/finance', icon: CreditCard },
      { title: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
    ADMIN: [
      { title: 'Dashboard', href: '/dashboard/home', icon: LayoutDashboard },
      { title: 'Customers', href: '/dashboard/customers', icon: Users },
      { title: 'Deliveries', href: '/dashboard/deliveries', icon: Truck },
      { title: 'Finance', href: '/dashboard/finance', icon: CreditCard },
      { title: 'Settings', href: '/dashboard/settings', icon: Settings },
    ],
    DRIVER: [
      { title: 'Dashboard', href: '/dashboard/home', icon: LayoutDashboard },
      { title: "Today's Routes", href: '/dashboard/routes', icon: Map },
      { title: 'Deliveries', href: '/dashboard/deliveries', icon: Truck },
      { title: 'Profile', href: '/dashboard/profile', icon: Users },
    ],
    CUSTOMER: [
      { title: 'Dashboard', href: '/dashboard/home', icon: LayoutDashboard },
      { title: 'My Orders', href: '/dashboard/orders', icon: Package },
      { title: 'Delivery Schedule', href: '/dashboard/schedule', icon: Calendar },
      { title: 'Billing', href: '/dashboard/billing', icon: CreditCard },
      { title: 'Profile', href: '/dashboard/profile', icon: Users },
    ],
  }

  const navigation = navigations[user_type]
  const title = `${Utils.toCapitalCase(user_type)} Portal`

  return <DashboardSidebar title={title} navigation={navigation} userType={user_type} className={''} />
}

export default DashboardSidebarContainer
