import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const Login = ({ isLoading, onAuthLoginFormClick }) => {
  return (
    <Tabs defaultValue="login" className="w-full max-w-md">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="login">Login</TabsTrigger>
        <TabsTrigger value="register">Register</TabsTrigger>
      </TabsList>
      <TabsContent value="login">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Login</CardTitle>
            <CardDescription>Enter your credentials to access your account.</CardDescription>
          </CardHeader>
          <form onSubmit={(e) => onAuthLoginFormClick(e, 'login')}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="name@example.com" required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <a href="#" className="text-sm text-waterboy-600 hover:text-waterboy-500">
                    Forgot password?
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-waterboy-600 hover:bg-waterboy-700"
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
      <TabsContent value="register">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Create an account</CardTitle>
            <CardDescription>Enter your information to create an account.</CardDescription>
          </CardHeader>
          <form onSubmit={(e) => onAuthLoginFormClick(e, 'register')}>
            <CardContent className="space-y-4">
              {/* First + Last Name side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-first-name">First Name</Label>
                  <Input id="reg-first-name" type="text" placeholder="John" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-last-name">Last Name</Label>
                  <Input id="reg-last-name" type="text" placeholder="Doe" required />
                </div>
              </div>

              {/* ID + Phone side by side */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-id">ID Number</Label>
                  <Input id="reg-id" type="text" placeholder="123456789" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-phone">Phone Number</Label>
                  <Input id="reg-phone" type="text" placeholder="+1 (555) 123 4567" required />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="reg-email">Email</Label>
                <Input id="reg-email" type="email" placeholder="name@example.com" required />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="reg-password">Password</Label>
                <Input id="reg-password" type="password" required />
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="reg-confirm">Confirm Password</Label>
                <Input id="reg-confirm" type="password" required />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                type="submit"
                className="w-full bg-waterboy-600 hover:bg-waterboy-700"
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Create account'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default Login
