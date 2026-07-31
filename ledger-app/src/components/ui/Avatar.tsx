import { cn, getInitials } from '@/lib/utils'

interface AvatarProps {
  name: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  color?: string
  className?: string
  showStatus?: boolean
  status?: 'online' | 'away' | 'offline'
}

const sizeClasses = {
  xs: 'w-5 h-5 text-[9px]',
  sm: 'w-7 h-7 text-[11px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-12 h-12 text-base',
}

const statusColors = {
  online: 'bg-[#24A148]',
  away: 'bg-[#F1C21B]',
  offline: 'bg-[#5A6478]',
}

const statusSizes = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
  xl: 'w-3 h-3',
}

// Consistent color from name
function getAvatarColor(name: string): string {
  const colors = [
    '#0F62FE', '#8A3FFC', '#1192E8', '#24A148',
    '#F1C21B', '#FF832B', '#DA1E28', '#009D9A',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return colors[Math.abs(hash) % colors.length]
}

export function Avatar({ name, size = 'md', color, className, showStatus, status = 'online' }: AvatarProps) {
  const bg = color ?? getAvatarColor(name)
  return (
    <div className={cn('relative shrink-0', className)}>
      <div
        className={cn(
          'rounded-full flex items-center justify-center font-semibold text-white uppercase select-none',
          sizeClasses[size]
        )}
        style={{ backgroundColor: bg }}
      >
        {getInitials(name)}
      </div>
      {showStatus && (
        <span
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-[#0B0F14]',
            statusColors[status],
            statusSizes[size]
          )}
        />
      )}
    </div>
  )
}

interface AvatarGroupProps {
  names: string[]
  max?: number
  size?: AvatarProps['size']
  className?: string
}

export function AvatarGroup({ names, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const shown = names.slice(0, max)
  const rest = names.length - max
  return (
    <div className={cn('flex items-center', className)}>
      {shown.map((name, i) => (
        <div key={name} style={{ zIndex: shown.length - i, marginLeft: i === 0 ? 0 : '-8px' }}>
          <Avatar name={name} size={size} className="ring-2 ring-[#1B222D]" />
        </div>
      ))}
      {rest > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-[#242C38] text-[#A8B3C5] font-medium ring-2 ring-[#1B222D]',
            sizeClasses[size],
            '-ml-2'
          )}
          style={{ fontSize: '10px' }}
        >
          +{rest}
        </div>
      )}
    </div>
  )
}
