import { useState } from 'react'
import { Bell, Search, Plus, Sparkles, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Avatar } from '@/components/ui/Avatar'
import { cn } from '@/lib/utils'

interface TopBarProps {
  title: string
  description?: string
  actions?: React.ReactNode
}

const NOTIFICATIONS = [
  { id: 1, type: 'warning', message: '"Real-Time Analytics Pipeline" is falling behind schedule.', time: '5m ago', read: false },
  { id: 2, type: 'info', message: 'Jordan Blake updated progress on AI Code Review.', time: '1h ago', read: false },
  { id: 3, type: 'success', message: 'Priya Nair hit a 21-day accountability streak!', time: '3h ago', read: true },
  { id: 4, type: 'info', message: 'Q3 OKR review meeting scheduled for Friday.', time: '1d ago', read: true },
]

export function TopBar({ title, description, actions }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const unread = NOTIFICATIONS.filter((n) => !n.read).length

  return (
    <header
      className="fixed top-0 left-0 lg:left-[var(--layout-sidebar-w)] right-0 z-30 flex items-center px-6 gap-4 bg-[#0B0F14]/80 backdrop-blur-md border-b border-[#242C38]"
      style={{ height: 'var(--spacing-topnav)' }}
      role="banner"
    >
      {/* Page title */}
      <div className="flex-1 min-w-0">
        <h1 className="text-sm font-semibold text-white leading-tight">{title}</h1>
        {description && <p className="text-[11px] text-[#5A6478] leading-tight">{description}</p>}
      </div>

      {/* AI Insight Chip */}
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(138,63,252,0.08)] border border-[rgba(138,63,252,0.2)] rounded-full">
        <Sparkles size={11} className="text-[#8A3FFC]" />
        <span className="text-[11px] font-medium text-[#8A3FFC]">AI insights active</span>
      </div>

      {/* Search */}
      <div className="w-48 hidden md:block">
        <Input
          placeholder="Search..."
          icon={<Search size={13} />}
          className="h-7 text-xs"
        />
      </div>

      {/* Notifications */}
      <div className="relative">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNotifications((v) => !v)}
          className="relative"
        >
          <Bell size={15} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#0F62FE] rounded-full" />
          )}
        </Button>

        <AnimatePresence>
          {showNotifications && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.97 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-full mt-2 w-80 bg-[#1B222D] border border-[#242C38] rounded-xl shadow-2xl z-20"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#242C38]">
                  <span className="text-xs font-semibold text-white">Notifications</span>
                  <button onClick={() => setShowNotifications(false)} className="text-[#5A6478] hover:text-white transition-colors">
                    <X size={13} />
                  </button>
                </div>
                <div className="flex flex-col">
                  {NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        'flex gap-3 px-4 py-3 border-b border-[#1D2533] last:border-0 hover:bg-[#242C38] transition-colors cursor-pointer',
                        !n.read && 'bg-[rgba(15,98,254,0.04)]'
                      )}
                    >
                      <span
                        className={cn(
                          'mt-0.5 w-1.5 h-1.5 rounded-full shrink-0',
                          n.type === 'warning' ? 'bg-[#F1C21B]' : n.type === 'success' ? 'bg-[#24A148]' : 'bg-[#0F62FE]'
                        )}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] text-[#A8B3C5] leading-relaxed">{n.message}</p>
                        <span className="text-[10px] text-[#3A4255] mt-0.5 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2 border-t border-[#242C38]">
                  <button className="text-[11px] text-[#0F62FE] hover:text-[#0353E9] transition-colors">
                    View all notifications
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Actions */}
      {actions}

      {/* CTA */}
      <Button variant="primary" size="sm" icon={<Plus size={13} />}>
        New Goal
      </Button>
    </header>
  )
}
