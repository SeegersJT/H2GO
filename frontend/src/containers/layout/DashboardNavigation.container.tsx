import DashboardNavigation from '@/components/layout/DashboardNavigation.component'

const DashboardNavigationContainer = ({ onLogout }: { onLogout: () => void }) => {
  return (
    <DashboardNavigation className={''} sideBarOpen userRole={'admin'} onSideBarOpenClick={() => {}} onAccountClick={() => {}} onLogout={onLogout} />
  )
}

export default DashboardNavigationContainer
