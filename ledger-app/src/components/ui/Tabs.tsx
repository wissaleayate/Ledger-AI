import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface TabsProps {
  tabs: { id: string; label: string; count?: number }[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, active, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex items-center gap-0.5 p-0.5 bg-[#141A22] rounded-[6px] border border-[#242C38]', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-3 py-1.5 text-xs font-medium rounded-[4px] transition-all duration-150 outline-none',
            'focus-visible:ring-2 focus-visible:ring-[#0F62FE]',
            active === tab.id
              ? 'bg-[#1B222D] text-white shadow-sm'
              : 'text-[#5A6478] hover:text-[#A8B3C5]'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={cn(
                'ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full font-mono',
                active === tab.id ? 'bg-[#0F62FE] text-white' : 'bg-[#242C38] text-[#5A6478]'
              )}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

interface LineTabsProps {
  tabs: { id: string; label: string }[]
  active: string
  onChange: (id: string) => void
  className?: string
}

export function LineTabs({ tabs, active, onChange, className }: LineTabsProps) {
  return (
    <div className={cn('flex items-center border-b border-[#242C38] gap-4', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className="relative pb-2 text-xs font-medium transition-colors outline-none"
        >
          <span className={active === tab.id ? 'text-white' : 'text-[#5A6478] hover:text-[#A8B3C5]'}>
            {tab.label}
          </span>
          {active === tab.id && (
            <motion.div
              layoutId="tab-underline"
              className="absolute bottom-0 left-0 right-0 h-px bg-[#0F62FE]"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
        </button>
      ))}
    </div>
  )
}
