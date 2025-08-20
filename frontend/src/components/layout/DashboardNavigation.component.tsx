import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { BellIcon, MenuIcon, Settings as SettingsIcon, User as UserIcon } from 'lucide-react'
import WaterboyLogo from '../WaterboyLogo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

const DashboardNavigation = ({
  className,
  sideBarOpen,
  userRole,
  onSideBarOpenClick,
  onAccountClick,
  onLogout,
}) => {
  return (
    <div
      className={cn(
        // sticky + frosted glass
        'sticky top-0 z-50 border-b bg-background/60 backdrop-blur-md',
        // better color on browsers that support backdrop-filter
        'supports-[backdrop-filter]:bg-background/60',
        // optional: slight elevation
        'shadow-sm',
        className,
      )}
    >
      <div className="flex h-16 items-center px-4 gap-4">
        <Button
          variant="outline"
          size="icon"
          className="md:hidden"
          onClick={() => onSideBarOpenClick(true)}
        >
          <MenuIcon className="h-5 w-5" />
          <span className="sr-only">Toggle sidebar</span>
        </Button>

        <div className="flex items-center gap-2 md:hidden">
          <WaterboyLogo />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Delivery confirmed</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Payment successful</p>
                  <p className="text-xs text-muted-foreground">Yesterday</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <SettingsIcon className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Preferences</DropdownMenuItem>
              <DropdownMenuItem>System Settings</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative rounded-full">
                <UserIcon className="h-9 w-9" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onAccountClick('/dashboard/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAccountClick('/dashboard/orders')}>
                My Orders
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAccountClick('/dashboard/billing')}>
                Billing
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

export default DashboardNavigation
