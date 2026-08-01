import { cn } from '@/lib/utils'
import type { Status, Priority } from '@/types'

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'blue' | 'purple' | 'cyan' | 'outline'

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
  size?: 'sm' | 'md'
  dot?: boolean
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#242C38] text-[#A8B3C5] border-[#2E3848]',
  success: 'bg-[rgba(36,161,72,0.12)] text-[#24A148] border-[rgba(36,161,72,0.2)]',
  warning: 'bg-[rgba(241,194,27,0.12)] text-[#F1C21B] border-[rgba(241,194,27,0.2)]',
  danger: 'bg-[rgba(218,30,40,0.12)] text-[#DA1E28] border-[rgba(218,30,40,0.2)]',
  blue: 'bg-[rgba(15,98,254,0.12)] text-[#0F62FE] border-[rgba(15,98,254,0.2)]',
  purple: 'bg-[rgba(138,63,252,0.12)] text-[#8A3FFC] border-[rgba(138,63,252,0.2)]',
  cyan: 'bg-[rgba(17,146,232,0.12)] text-[#1192E8] border-[rgba(17,146,232,0.2)]',
  outline: 'bg-transparent text-[#A8B3C5] border-[#242C38]',
}

const dotClasses: Record<BadgeVariant, string> = {
  default: 'bg-[#A8B3C5]',
  success: 'bg-[#24A148]',
  warning: 'bg-[#F1C21B]',
  danger: 'bg-[#DA1E28]',
  blue: 'bg-[#0F62FE]',
  purple: 'bg-[#8A3FFC]',
  cyan: 'bg-[#1192E8]',
  outline: 'bg-[#A8B3C5]',
}

const Badge = ({ variant = 'default', size = 'sm', dot = false, className, children, ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center gap-1.5 font-medium border rounded-[3px]',
      size === 'sm' ? 'px-1.5 py-0.5 text-[11px]' : 'px-2 py-1 text-xs',
      variantClasses[variant],
      className
    )}
    {...props}
  >
    {dot && <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', dotClasses[variant])} />}
    {children}
  </span>
)

export function statusBadgeProps(status: Status): BadgeProps {
  const map: Record<Status, { variant: BadgeVariant; label: string }> = {
    'on-track': { variant: 'success', label: 'On Track' },
    'at-risk': { variant: 'warning', label: 'At Risk' },
    behind: { variant: 'danger', label: 'Behind' },
    completed: { variant: 'blue', label: 'Completed' },
    'not-started': { variant: 'default', label: 'Not Started' },
  }
  return { variant: map[status].variant, dot: true, children: map[status].label }
}

export function priorityBadgeProps(priority: Priority): BadgeProps {
  const map: Record<Priority, { variant: BadgeVariant; label: string }> = {
    critical: { variant: 'danger', label: 'Critical' },
    high: { variant: 'warning', label: 'High' },
    medium: { variant: 'blue', label: 'Medium' },
    low: { variant: 'default', label: 'Low' },
  }
  return { variant: map[priority].variant, children: map[priority].label }
}

export { Badge }
export type { BadgeProps, BadgeVariant }
