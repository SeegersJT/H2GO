import * as React from 'react'
import { Check, CheckSquare, ChevronDown, Square } from 'lucide-react'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

type Option = {
  label: string
  value: string
}

interface CustomSelectProps {
  title: string
  secondaryTitle?: string
  options: Option[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  placeholder?: string
  className?: string
}

function CustomSelect({
  title,
  secondaryTitle,
  options,
  value,
  onChange,
  multiple = false,
  placeholder = 'Select option',
  className,
}: CustomSelectProps) {
  const [search, setSearch] = React.useState('')

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(search.toLowerCase()))

  /* ---------------- SINGLE SELECT ---------------- */
  if (!multiple) {
    const selectedOption = options.find((o) => o.value === value)

    return (
      <div>
        {/* Titles */}
        {title && (
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-800">{title}</span>
            {secondaryTitle && <span className="text-xs text-gray-500">{secondaryTitle}</span>}
          </div>
        )}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" role="combobox" className={cn('w-full md:w-64 justify-between', className)}>
              {selectedOption?.label ?? placeholder}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-64 p-2">
            <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2 h-8" autoFocus />

            <div className="max-h-48 overflow-auto">
              {filteredOptions.map((option) => {
                const isSelected = selectedOption.value === option.value

                return (
                  <div
                    key={option.value}
                    onClick={() => {
                      onChange(option.value)
                      setSearch('')
                    }}
                    className={cn('flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent')}
                  >
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                    {option.label}
                  </div>
                )
              })}

              {filteredOptions.length === 0 && <div className="px-2 py-1 text-sm text-muted-foreground">No results</div>}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  /* ---------------- MULTI SELECT ---------------- */
  const selectedValues = value as string[]

  const toggleValue = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val))
    } else {
      onChange([...selectedValues, val])
    }
  }

  const selectedLabels = options.filter((o) => selectedValues.includes(o.value)).map((o) => o.label)

  return (
    <div>
      {/* Titles */}
      {title && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-gray-800">{title}</span>
          {secondaryTitle && <span className="text-xs text-gray-500">{secondaryTitle}</span>}
        </div>
      )}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className={cn('w-full md:w-64 justify-between', className)}>
            {selectedLabels.length > 0 ? selectedLabels.join(', ') : placeholder}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-64 p-2">
          <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="mb-2 h-8" />

          <div className="max-h-48 overflow-auto">
            {filteredOptions.map((option) => {
              const isSelected = selectedValues.includes(option.value)

              return (
                <div
                  key={option.value}
                  onClick={() => toggleValue(option.value)}
                  className={cn('flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm cursor-pointer hover:bg-accent')}
                >
                  {isSelected ? <CheckSquare className="h-4 w-4 text-primary" /> : <Square className="h-4 w-4 text-muted-foreground" />}
                  <span>{option.label}</span>
                </div>
              )
            })}

            {filteredOptions.length === 0 && <div className="px-2 py-1 text-sm text-muted-foreground">No results</div>}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default CustomSelect
