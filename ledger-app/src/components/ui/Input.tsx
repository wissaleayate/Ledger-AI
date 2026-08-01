import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  error?: string
  icon?: React.ReactNode
  iconRight?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, icon, iconRight, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-xs font-medium text-[#A8B3C5]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <span className="absolute left-3 text-[#5A6478] pointer-events-none flex items-center">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full h-8 rounded-[4px] bg-[#141A22] border text-sm text-white placeholder:text-[#3A4255]',
              'transition-all duration-150 outline-none',
              'focus:border-[#0F62FE] focus:ring-1 focus:ring-[#0F62FE]',
              error ? 'border-[#DA1E28]' : 'border-[#242C38] hover:border-[#2E3848]',
              icon ? 'pl-9' : 'pl-3',
              iconRight ? 'pr-9' : 'pr-3',
              className
            )}
            {...props}
          />
          {iconRight && (
            <span className="absolute right-3 text-[#5A6478] pointer-events-none flex items-center">
              {iconRight}
            </span>
          )}
        </div>
        {(hint || error) && (
          <p className={cn('text-xs', error ? 'text-[#DA1E28]' : 'text-[#5A6478]')}>
            {error ?? hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export { Input }
