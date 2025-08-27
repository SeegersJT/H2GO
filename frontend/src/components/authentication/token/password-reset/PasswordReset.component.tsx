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

interface Props {
  passwordResetForm: { password: string; confirmPassword: string }
  loading: boolean
  onPasswordResetFormChange: (value: string, type: 'password' | 'confirmPassword') => void
  onPasswordResetFormSubmit: (e: React.FormEvent) => void
}

const PasswordReset = ({
  passwordResetForm,
  loading,
  onPasswordResetFormChange,
  onPasswordResetFormSubmit,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-bold">Reset Password</CardTitle>
        <CardDescription>Enter and confirm your new password.</CardDescription>
      </CardHeader>
      <form onSubmit={onPasswordResetFormSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={passwordResetForm.password}
              onChange={(e) => onPasswordResetFormChange(e.target.value, 'password')}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={passwordResetForm.confirmPassword}
              onChange={(e) => onPasswordResetFormChange(e.target.value, 'confirmPassword')}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-waterboy-600 hover:bg-waterboy-700"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

export default PasswordReset
