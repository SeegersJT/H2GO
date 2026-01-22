import * as React from 'react'
import { cn } from '@/lib/utils'
import { Input } from '../input'
import { Label } from '../label'

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
  clearable?: boolean
  disabled?: boolean
  error?: boolean
  errorMessage?: string
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
  clearable = false,
  disabled = false,
  error = false,
  errorMessage = '',
}) => {
  const handleClear = () => {
    if (onChange) {
      onChange('')
    }
  }

  return (
    <div className={cn('flex flex-col w-full', className)}>
      {/* Titles */}
      <div className="flex justify-between items-center mb-1">
        <Label className="text-sm font-medium text-gray-800">{title}</Label>
        {error ? (
          <span className="text-xs text-red-500">{errorMessage}</span>
        ) : (
          secondaryTitle && <span className="text-xs text-gray-500">{secondaryTitle}</span>
        )}
      </div>

      {/* Input */}
      <div className="relative w-full">
        {icon && <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">{icon}</div>}

        <Input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange && onChange(e.target.value)}
          disabled={disabled} // pass down disabled
          className={cn(
            'mt-1',
            icon ? 'pl-8' : '',
            clearable ? 'pr-8' : '',
            disabled ? 'bg-gray-100 cursor-not-allowed text-gray-500' : '',
            error ? 'border border-red-500 focus:border-red-500 focus:ring-red-500' : '',
            inputClassName,
          )}
        />

        {/* Clear Button */}
        {clearable && value && !disabled && (
          <button type="button" onClick={handleClear} className="absolute inset-y-0 right-0 flex items-center px-5 text-gray-400 hover:text-gray-600">
            ×
          </button>
        )}
      </div>
    </div>
  )
}

export default CustomLabel
