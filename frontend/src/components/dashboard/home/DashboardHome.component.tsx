import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarIcon, Droplets, Package, Truck } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const DashboardHome = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome back, John</h1>
          <p className="text-muted-foreground">Here's an overview of your water delivery service.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button className="bg-waterboy-600 hover:bg-waterboy-700">Order Water</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Delivery</CardTitle>
            <CalendarIcon className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Wed, July 19</div>
            <p className="text-xs text-muted-foreground">Between 10:00 AM and 2:00 PM</p>
            <Button variant="link" className="px-0 text-waterboy-600">
              Change date
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Water Usage</CardTitle>
            <Droplets className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75 liters</div>
            <p className="text-xs text-muted-foreground">This month</p>
            <div className="mt-2 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Monthly limit</span>
                <span>100L</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Orders</CardTitle>
            <Package className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2 Orders</div>
            <p className="text-xs text-muted-foreground">Regular weekly delivery</p>
            <Button variant="link" className="px-0 text-waterboy-600">
              View details
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivery Status</CardTitle>
            <Truck className="h-4 w-4 text-waterboy-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">On Schedule</div>
            <p className="text-xs text-muted-foreground">Last delivery: July 12</p>
            <Button variant="link" className="px-0 text-waterboy-600">
              Track delivery
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 md:inline-grid">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="deliveries">Deliveries</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Water Consumption</CardTitle>
              <CardDescription>Your water consumption over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={data}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="usage" stroke="#0066cc" fill="#e0f2fe" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Deliveries</CardTitle>
                <CardDescription>Your last 5 deliveries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">Delivery #{3210 - i}</p>
                        <p className="text-sm text-muted-foreground">{new Date(2023, 6, 12 - i * 7).toLocaleDateString()}</p>
                      </div>
                    <div className="text-right">
                        <p className="font-medium">1 Container</p>
                        <p className="text-sm text-muted-foreground">R180</p>
                      </div>
                  </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your water delivery service</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full justify-start" variant="outline">
                  <Package className="mr-2 h-4 w-4" />
                  Order Additional Water
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Change Delivery Schedule
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Truck className="mr-2 h-4 w-4" />
                  Report Delivery Issue
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Droplets className="mr-2 h-4 w-4" />
                  Water Quality Report
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="deliveries" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Delivery History</CardTitle>
              <CardDescription>All your past and upcoming deliveries</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Delivery history content will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="billing" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Billing Information</CardTitle>
              <CardDescription>Manage your payment methods and view invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Billing content will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account" className="mt-2">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Account settings content will be shown here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default DashboardHome
