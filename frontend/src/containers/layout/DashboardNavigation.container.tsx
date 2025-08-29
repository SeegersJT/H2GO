import DashboardNavigation from '@/components/layout/DashboardNavigation.component'

const DashboardNavigationContainer = () => {
  return (
    <DashboardNavigation className={''} sideBarOpen userRole={'admin'} onSideBarOpenClick={() => {}} onAccountClick={() => {}} onLogout={() => {}} />
  )
}

export default DashboardNavigationContainer
