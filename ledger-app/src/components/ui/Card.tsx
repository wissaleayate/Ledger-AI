import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean
  interactive?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg'
  border?: boolean
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ hover = false, interactive = false, padding = 'md', border = true, className, children, ...props }, ref) => {
    if (interactive) {
      return (
        <motion.div
          ref={ref as React.Ref<HTMLDivElement>}
          whileHover={{ y: -1, backgroundColor: '#202838' }}
          transition={{ duration: 0.15 }}
          className={cn(
            'bg-[#1B222D] rounded-lg cursor-pointer',
            border && 'border border-[#242C38]',
            paddingClasses[padding],
            className
          )}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      )
    }

    return (
      <div
        ref={ref}
        className={cn(
          'bg-[#1B222D] rounded-lg',
          border && 'border border-[#242C38]',
          hover && 'transition-colors duration-150 hover:bg-[#202838]',
          paddingClasses[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)

Card.displayName = 'Card'

const CardHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex items-center justify-between mb-4', className)} {...props}>
    {children}
  </div>
)

const CardTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={cn('text-sm font-semibold text-white', className)} {...props}>
    {children}
  </h3>
)

const CardDescription = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-xs text-[#A8B3C5]', className)} {...props}>
    {children}
  </p>
)

export { Card, CardHeader, CardTitle, CardDescription }
