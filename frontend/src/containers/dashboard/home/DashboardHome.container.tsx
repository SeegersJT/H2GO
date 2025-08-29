import DashboardHome from '@/components/dashboard/home/DashboardHome.component'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { CalendarIcon, Droplets, Package, Truck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage all aspects of the WaterBoy service.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export Data</Button>
          <Button className="bg-waterboy-600 hover:bg-waterboy-700">Add Customer</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Package className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,345</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Deliveries Today</CardTitle>
            <Truck className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">65 completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Distributed</CardTitle>
            <Droplets className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15,780 L</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue</CardTitle>
            <CalendarIcon className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R 452,500</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the current year</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: 'Jan', revenue: 380000 },
                    { month: 'Feb', revenue: 350000 },
                    { month: 'Mar', revenue: 410000 },
                    { month: 'Apr', revenue: 390000 },
                    { month: 'May', revenue: 420000 },
                    { month: 'Jun', revenue: 450000 },
                    { month: 'Jul', revenue: 452500 },
                  ]}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stroke="#0066cc" fill="#e0f2fe" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const DriverDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Driver Dashboard</h1>
          <p className="text-muted-foreground">Manage your deliveries and routes.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Report Issue</Button>
          <Button className="bg-waterboy-600 hover:bg-waterboy-700">Start Route</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Deliveries</CardTitle>
            <Truck className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18 / 24</div>
            <p className="text-xs text-muted-foreground">6 remaining</p>
            <Progress value={75} className="h-2 mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Location</CardTitle>
            <Package className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Sandton</div>
            <p className="text-xs text-muted-foreground">Johannesburg</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Delivered</CardTitle>
            <Droplets className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,890 L</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Delivery</CardTitle>
            <CalendarIcon className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">55 Rivonia Rd</div>
            <p className="text-xs text-muted-foreground">3 containers</p>
            <Button variant="link" className="px-0 text-waterboy-600">
              Navigate
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Delivery Route</CardTitle>
          <CardDescription>Today's delivery schedule and map</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border h-[400px] bg-gray-100 flex items-center justify-center">
            <p className="text-muted-foreground">Map view will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const DashboardHomeContainer = () => {
  const [userRole, setUserRole] = useState<'customer' | 'admin' | 'driver'>('admin')

  useEffect(() => {
    // For demo purposes, get user role from URL parameter
    const params = new URLSearchParams(window.location.search)
    const role = params.get('role')
    if (role && ['customer', 'admin', 'driver'].includes(role)) {
      setUserRole(role as 'customer' | 'admin' | 'driver')
    }
  }, [])

  // Render the appropriate dashboard based on user role
  return <AdminDashboard />
  // return <DriverDashboard />

  const data = [
    { name: 'Jan', usage: 40 },
    { name: 'Feb', usage: 30 },
    { name: 'Mar', usage: 45 },
    { name: 'Apr', usage: 50 },
    { name: 'May', usage: 35 },
    { name: 'Jun', usage: 60 },
    { name: 'Jul', usage: 75 },
  ]

  return <DashboardHome data={data} />
}

export default DashboardHomeContainer
