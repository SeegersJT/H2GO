import * as React from 'react'
import { cn } from '@/lib/utils'

interface CustomLabelProps {
  title: string
  secondaryTitle?: string
  placeholder?: string
  icon?: React.ReactNode
  value?: string
  onChange?: (val: string) => void
  type?: string
  className?: string
  inputClassName?: string
}

const CustomLabel: React.FC<CustomLabelProps> = ({
  title,
  secondaryTitle,
  placeholder = '',
  icon,
  value,
  onChange,
  type = 'text',
  className,
  inputClassName,
}) => {
  return (
    <div className={cn('flex flex-col w-full', className)}>
      {/* Titles */}
      <div className="flex justify-between items-center mb-1">
        <label className="text-sm font-medium text-gray-800">{title}</label>
        {secondaryTitle && <span className="text-xs text-gray-500">{secondaryTitle}</span>}
      </div>

      {/* Input */}
      <div className="relative w-full">
        {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">{icon}</div>}

        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          className={cn(
            'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary',
            icon ? 'pl-8' : '', // add padding if icon exists
            inputClassName,
          )}
        />
      </div>
    </div>
  )
}

export default CustomLabel
