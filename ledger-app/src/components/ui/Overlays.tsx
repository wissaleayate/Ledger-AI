import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  content: string
  children: React.ReactNode
  side?: 'top' | 'bottom' | 'left' | 'right'
  className?: string
}

export function Tooltip({ content, children, side = 'top', className }: TooltipProps) {
  return (
    <div className={cn('relative group', className)}>
      {children}
      <div
        className={cn(
          'absolute z-50 px-2 py-1 text-[11px] bg-[#242C38] text-white rounded whitespace-nowrap',
          'opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none',
          'border border-[#2E3848]',
          side === 'top' && 'bottom-full left-1/2 -translate-x-1/2 mb-1.5',
          side === 'bottom' && 'top-full left-1/2 -translate-x-1/2 mt-1.5',
          side === 'left' && 'right-full top-1/2 -translate-y-1/2 mr-1.5',
          side === 'right' && 'left-full top-1/2 -translate-y-1/2 ml-1.5',
        )}
      >
        {content}
      </div>
    </div>
  )
}

interface DropdownItem {
  label: string
  icon?: React.ReactNode
  onClick?: () => void
  destructive?: boolean
  disabled?: boolean
  divider?: boolean
}

interface DropdownProps {
  trigger: React.ReactNode
  items: DropdownItem[]
  align?: 'left' | 'right'
}

export function Dropdown({ trigger, items, align = 'right' }: DropdownProps) {
  return (
    <div className="relative group/dropdown">
      {trigger}
      <div
        className={cn(
          'absolute top-full mt-1 z-50 min-w-[160px] py-1',
          'bg-[#1B222D] border border-[#242C38] rounded-lg shadow-xl',
          'opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible',
          'transition-all duration-150',
          align === 'right' ? 'right-0' : 'left-0'
        )}
      >
        {items.map((item, i) =>
          item.divider ? (
            <div key={i} className="my-1 border-t border-[#242C38]" />
          ) : (
            <button
              key={i}
              onClick={item.onClick}
              disabled={item.disabled}
              className={cn(
                'w-full flex items-center gap-2 px-3 py-2 text-xs text-left transition-colors',
                item.destructive
                  ? 'text-[#DA1E28] hover:bg-[rgba(218,30,40,0.08)]'
                  : 'text-[#A8B3C5] hover:bg-[#242C38] hover:text-white',
                item.disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              {item.icon && <span className="w-3.5 h-3.5">{item.icon}</span>}
              {item.label}
            </button>
          )
        )}
      </div>
    </div>
  )
}

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const modalSizes = {
  sm: 'max-w-sm',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
              'w-full bg-[#1B222D] border border-[#242C38] rounded-xl shadow-2xl',
              modalSizes[size]
            )}
          >
            {title && (
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#242C38]">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-[#5A6478] hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="p-5">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
