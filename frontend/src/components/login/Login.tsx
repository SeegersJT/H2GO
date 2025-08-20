import AuthLoginFormContainer from '@/containers/login/AuthLoginForm.container'
import H2GOLogo from '../WaterboyLogo'
import PoweredByContainer from '@/containers/powered-by/PoweredBy.container'

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Hero Image */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-b from-waterboy-600 to-waterboy-800 items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-water-pattern opacity-10" />
        <div className="z-10 text-white text-center p-8">
          <H2GOLogo className="mb-6 mx-auto" showText={false} />
          <h1 className="text-4xl font-bold mb-4">Clean Water Delivered</h1>
          <p className="text-xl mb-6">Straight to your doorstep</p>
          <div className="max-w-md text-waterboy-100">
            <p>WaterBoy delivers pure, fresh water on a weekly schedule.</p>
            <p className="mt-4">No more heavy containers to carry!</p>
          </div>
        </div>
        {/* Water bubble animations */}
        <div className="water-drop absolute h-32 w-32 bottom-1/4 left-1/4" />
        <div className="water-drop absolute h-24 w-24 top-1/4 right-1/3 animation-delay-1000" />
      </div>

      {/* Right side - Auth Form */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-6 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center mb-8">
            <H2GOLogo className="mx-auto mb-4 md:hidden" />
            <h2 className="text-2xl font-bold">Welcome to WaterBoy</h2>
            <p className="text-gray-500">Log in to manage your water delivery service</p>
          </div>

          <AuthLoginFormContainer />

          <PoweredByContainer />
        </div>
      </div>
    </div>
  )
}

export default Login
