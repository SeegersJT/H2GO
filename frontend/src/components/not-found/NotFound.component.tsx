import { Home as HomeIcon } from 'lucide-react'
import H2GOLogo from '../WaterboyLogo'
import { Button } from '../ui/button'

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="text-center w-full max-w-md space-y-6">
        <H2GOLogo className="mx-auto mb-6" />
        <div className="space-y-2">
          <h1 className="text-5xl font-bold text-waterboy-600">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Page Not Found</h2>
          <p className="text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        <div className="pt-6">
          <Button
            className="bg-waterboy-600 hover:bg-waterboy-700"
            onClick={() => (window.location.href = '/dashboard')}
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Return to Home
          </Button>
        </div>
        <div className="relative pt-10">
          <div className="border-t border-gray-200 pt-6">
            <p className="text-sm text-muted-foreground">
              Need help?{' '}
              <a href="/" className="font-medium text-waterboy-600 hover:underline">
                Contact our support team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound
