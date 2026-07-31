import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  color?: string
  className?: string
  subValue?: string
}

export function StatCard({ label, value, change, changeLabel, icon, color = '#0F62FE', className, subValue }: StatCardProps) {
  const isPositive = (change ?? 0) >= 0
  return (
    <div
      className={cn(
        'bg-[#1B222D] border border-[#242C38] rounded-lg p-4 flex flex-col gap-3',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-[#A8B3C5] uppercase tracking-wider">{label}</span>
        {icon && (
          <div
            className="w-7 h-7 rounded-[4px] flex items-center justify-center"
            style={{ backgroundColor: `${color}18` }}
          >
            <span style={{ color }}>{icon}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-0.5">
        <span className="text-2xl font-semibold text-white font-mono tabular-nums">{value}</span>
        {subValue && <span className="text-xs text-[#5A6478]">{subValue}</span>}
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'text-xs font-medium',
              isPositive ? 'text-[#24A148]' : 'text-[#DA1E28]'
            )}
          >
            {isPositive ? '+' : ''}{change}%
          </span>
          {changeLabel && <span className="text-xs text-[#5A6478]">{changeLabel}</span>}
        </div>
      )}
    </div>
  )
}
