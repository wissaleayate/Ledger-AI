import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  icon?: React.ReactNode
  iconRight?: React.ReactNode
  fullWidth?: boolean
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-[#0F62FE] text-white hover:bg-[#0353E9] active:bg-[#002D9C] border border-[#0F62FE] hover:border-[#0353E9]',
  secondary:
    'bg-[#1B222D] text-[#A8B3C5] hover:bg-[#202838] hover:text-white border border-[#242C38] hover:border-[#2E3848]',
  ghost:
    'bg-transparent text-[#A8B3C5] hover:bg-[#141A22] hover:text-white border border-transparent',
  danger:
    'bg-[#DA1E28] text-white hover:bg-[#ba1b23] active:bg-[#750e13] border border-[#DA1E28]',
  outline:
    'bg-transparent text-[#0F62FE] hover:bg-[rgba(15,98,254,0.08)] border border-[#0F62FE]',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-7 px-3 text-xs gap-1.5',
  md: 'h-8 px-4 text-sm gap-2',
  lg: 'h-10 px-5 text-sm gap-2',
  icon: 'h-8 w-8 p-0',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconRight,
      fullWidth,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 cursor-pointer select-none',
          'rounded-[4px] outline-none focus-visible:ring-2 focus-visible:ring-[#0F62FE] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14]',
          'disabled:opacity-40 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          className
        )}
        disabled={disabled || loading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? (
          <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          icon
        )}
        {children && <span>{children}</span>}
        {iconRight && !loading && iconRight}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export { Button }
export type { ButtonProps }
