import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface ProgressBarProps {
  value: number
  max?: number
  size?: 'xs' | 'sm' | 'md'
  color?: string
  showLabel?: boolean
  animated?: boolean
  className?: string
}

function getProgressColor(value: number): string {
  if (value >= 80) return '#24A148'
  if (value >= 50) return '#0F62FE'
  if (value >= 30) return '#F1C21B'
  return '#DA1E28'
}

export function ProgressBar({
  value,
  max = 100,
  size = 'sm',
  color,
  showLabel = false,
  animated = true,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100))
  const barColor = color ?? getProgressColor(pct)

  const sizeClasses = {
    xs: 'h-0.5',
    sm: 'h-1',
    md: 'h-1.5',
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-[#242C38] rounded-full overflow-hidden', sizeClasses[size])}>
        {animated ? (
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: barColor }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        ) : (
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: barColor }} />
        )}
      </div>
      {showLabel && (
        <span className="text-[11px] font-mono text-[#A8B3C5] tabular-nums w-8 text-right shrink-0">
          {pct.toFixed(0)}%
        </span>
      )}
    </div>
  )
}

interface CircularProgressProps {
  value: number
  size?: number
  strokeWidth?: number
  color?: string
  label?: string
  className?: string
}

export function CircularProgress({
  value,
  size = 60,
  strokeWidth = 5,
  color,
  label,
  className,
}: CircularProgressProps) {
  const pct = Math.min(100, Math.max(0, value))
  const barColor = color ?? getProgressColor(pct)
  const r = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#242C38" strokeWidth={strokeWidth} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={barColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </svg>
      {label !== undefined && (
        <span className="absolute text-[11px] font-semibold text-white font-mono">{label}</span>
      )}
    </div>
  )
}
