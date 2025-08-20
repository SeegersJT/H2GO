import { cn } from '@/lib/utils'

const PoweredBy = ({ className = '' }) => {
  return (
    <div className={cn('text-xs text-gray-400 text-center mt-6', className)}>
      <div>
        Powered by <span className="font-semibold text-waterboy-700">H2GO</span>
      </div>
      <div>
        <span className="text-xs text-gray-400 text-center mt-6">v1.0.0</span>
      </div>
    </div>
  )
}

export default PoweredBy
