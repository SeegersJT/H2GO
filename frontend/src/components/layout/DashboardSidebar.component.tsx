import PoweredByContainer from '@/containers/powered-by/PoweredBy.container'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon, Home as HomeIcon, Map as MapIcon, Package as PackageIcon, Truck as TruckIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { Button } from '../ui/button'
import WaterboyLogo from '../WaterboyLogo'

const DashboardSidebar = ({ title, navigation, userType, className }) => {
  return (
    <div className={cn('flex flex-col justify-between pb-12 border-r h-full', className)}>
      {/* Main content */}
      <div className="space-y-4 py-4">
        <div className="px-4 py-2 flex items-center cursor-pointer" onClick={() => console.log('Logo clicked!')}>
          <WaterboyLogo showText className="mx-auto md:mx-0" />
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">{title}</h2>
          <div className="space-y-1">
            {navigation.map((nav: any) => (
              <NavLink
                key={nav.href}
                to={nav.href}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:text-waterboy-900',
                    isActive ? 'bg-waterboy-50 text-waterboy-900 font-medium' : 'text-muted-foreground',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <nav.icon className={cn('h-4 w-4', isActive ? 'text-waterboy-600' : 'text-muted-foreground')} />
                    <span>{nav.title}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </div>

        {userType === 'CUSTOMER' && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Quick Actions</h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 text-sm text-muted-foreground">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>Order Water</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 text-sm text-muted-foreground">
                <HomeIcon className="h-4 w-4 text-muted-foreground" />
                <span>Change Delivery Date</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 text-sm text-muted-foreground">
                <PackageIcon className="h-4 w-4 text-muted-foreground" />
                <span>Track Delivery</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 text-sm text-muted-foreground">
                <TruckIcon className="h-4 w-4 text-muted-foreground" />
                <span>Update Address</span>
              </Button>
            </div>
          </div>
        )}

        {userType === 'DRIVER' && (
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Tools</h2>
            <div className="space-y-1">
              <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 text-sm text-muted-foreground">
                <MapIcon className="h-4 w-4 text-muted-foreground" />
                <span>Navigation</span>
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-3 px-3 py-2 text-sm text-muted-foreground">
                <PackageIcon className="h-4 w-4 text-muted-foreground" />
                <span>Report Issue</span>
              </Button>
            </div>
          </div>
        )}

        {userType !== 'DEVELOPER' && (
          <div className="px-3 py-2">
            <div className="m-2 rounded-md bg-waterboy-50 p-4">
              <h3 className="mb-1 font-medium text-sm text-waterboy-800">Need help?</h3>
              <p className="text-xs text-waterboy-700">Contact our support team for assistance with your water delivery needs.</p>
              <Button variant="default" size="sm" className="mt-3 w-full bg-waterboy-600 hover:bg-waterboy-700">
                Contact Support
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <PoweredByContainer />
    </div>
  )
}

export default DashboardSidebar
