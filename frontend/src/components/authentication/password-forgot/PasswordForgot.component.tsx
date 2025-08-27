import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  passwordForgotForm: { email: string }
  authPasswordForgotLoading: boolean
  onPasswordForgotFormChange: (value: string) => void
  onPasswordForgotFormSubmit: (e: React.FormEvent) => void
  onBackToLogin: () => void
}

const PasswordForgot = ({
  passwordForgotForm,
  authPasswordForgotLoading,
  onPasswordForgotFormChange,
  onPasswordForgotFormSubmit,
  onBackToLogin,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Forgot Password</CardTitle>
        <CardDescription>Enter your email to receive a reset OTP.</CardDescription>
      </CardHeader>
      <form onSubmit={onPasswordForgotFormSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={passwordForgotForm.email}
              onChange={(e) => onPasswordForgotFormChange(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button type="submit" className="w-full bg-waterboy-600 hover:bg-waterboy-700" disabled={authPasswordForgotLoading}>
            {authPasswordForgotLoading ? 'Sending...' : 'Send OTP'}
          </Button>
          <Button type="button" variant="outline" className="w-full" onClick={onBackToLogin} disabled={authPasswordForgotLoading}>
            Back to login
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default PasswordForgot
