import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const customButtonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface CustomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof customButtonVariants> {
  asChild?: boolean
  loading?: boolean
}

const CustomButton = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp ref={ref} className={cn(customButtonVariants({ variant, size }), className)} disabled={disabled || loading} {...props}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {size !== 'icon' && <span>Loading...</span>}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  },
)

CustomButton.displayName = 'CustomButton'

export { CustomButton }
