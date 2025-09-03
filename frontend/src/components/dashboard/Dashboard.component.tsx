import DashboardNavigationContainer from '@/containers/layout/DashboardNavigation.container'
import DashboardSidebarContainer from '@/containers/layout/DashboardSidebar.container'
import { Outlet } from 'react-router-dom'
import { Sheet, SheetContent } from '../ui/sheet'

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  return (
    // Fill the viewport height
    <div className="h-screen grid lg:grid-cols-[280px_1fr]">
      {/* Sticky desktop sidebar */}
      <aside className="hidden lg:block sticky top-0 h-screen overflow-y-auto border-r">
        <DashboardSidebarContainer />
      </aside>

      {/* Mobile drawer (unchanged) */}
      <Sheet open={false} onOpenChange={() => {}}>
        <SheetContent side="left" className="p-0 w-[280px]">
          <DashboardSidebarContainer />
        </SheetContent>
      </Sheet>

      {/* Right column: sticky nav + scrollable main */}
      <div className="flex min-h-0 flex-col">
        {/* Sticky top navigation */}
        <div className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b">
          <DashboardNavigationContainer onLogout={onLogout} />
        </div>

        {/* Only this area scrolls */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboard
