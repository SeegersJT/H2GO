import { cn } from '@/lib/utils'

interface H2GOLogoProps {
  className?: string
  showText?: boolean
}

const WaterboyLogo = ({ className, showText = true }: H2GOLogoProps) => {
  return (
    <div className={cn('flex items-center', className)}>
      <div className="relative flex items-center">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-waterboy-600"
        >
          <path
            d="M12 22C16.4183 22 20 18.4183 20 14C20 10.5 17.5 7.5 12 2C6.5 7.5 4 10.5 4 14C4 18.4183 7.58172 22 12 22Z"
            fill="currentColor"
            fillOpacity="0.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {showText && (
          <div className="ml-2 flex items-center font-bold text-xl">
            <span className="text-waterboy-900">Water</span>
            <span className="text-waterboy-500">Boy</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default WaterboyLogo
