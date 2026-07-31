import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, Target, BarChart3, Settings,
  ChevronDown, Zap, Bell, HelpCircle, LogOut, Shield,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'

interface NavItemDef {
  id: string
  label: string
  path: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: number
}

const PRIMARY_NAV: NavItemDef[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { id: 'team', label: 'Team', path: '/team', icon: Users },
  { id: 'goals', label: 'Goals & OKRs', path: '/goals', icon: Target },
  { id: 'reports', label: 'Reports', path: '/reports', icon: BarChart3 },
]

const SECONDARY_NAV: NavItemDef[] = [
  { id: 'settings', label: 'Settings', path: '/settings', icon: Settings },
]

function SidebarNavItem({ item }: { item: NavItemDef }) {
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      className={({ isActive }) =>
        cn(
          'group flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-medium transition-all duration-150',
          isActive
            ? 'bg-[rgba(15,98,254,0.12)] text-white border border-[rgba(15,98,254,0.2)]'
            : 'text-[#5A6478] hover:text-[#A8B3C5] hover:bg-[#141A22] border border-transparent'
        )
      }
    >
      {({ isActive }) => (
        <>
          <item.icon
            size={15}
            className={cn('shrink-0 transition-colors', isActive ? 'text-[#0F62FE]' : 'text-current')}
          />
          <span className="flex-1">{item.label}</span>
          {item.badge !== undefined && (
            <span className="px-1.5 py-0.5 text-[10px] font-mono bg-[#0F62FE] text-white rounded-full">
              {item.badge}
            </span>
          )}
        </>
      )}
    </NavLink>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[240px] bg-[#141A22] border-r border-[#242C38] flex flex-col z-40">
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-[#242C38]">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-[4px] bg-[#0F62FE] flex items-center justify-center">
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-white tracking-tight leading-tight">Ledger</span>
            <span className="text-[10px] text-[#5A6478] leading-tight">AI Accountability</span>
          </div>
        </div>
        {/* Workspace pill */}
        <div className="ml-auto flex items-center gap-1 px-2 py-1 bg-[#1B222D] border border-[#242C38] rounded-[4px] cursor-pointer hover:border-[#2E3848] transition-colors">
          <Shield size={10} className="text-[#0F62FE]" />
          <span className="text-[10px] text-[#5A6478]">Acme</span>
          <ChevronDown size={10} className="text-[#5A6478]" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col px-2 py-4 gap-0.5 overflow-y-auto">
        <span className="px-3 mb-2 text-[10px] font-semibold text-[#3A4255] uppercase tracking-widest">
          Workspace
        </span>
        {PRIMARY_NAV.map((item) => (
          <SidebarNavItem key={item.id} item={item} />
        ))}

        <div className="mt-auto pt-4 border-t border-[#1D2533] flex flex-col gap-0.5">
          <span className="px-3 mb-2 text-[10px] font-semibold text-[#3A4255] uppercase tracking-widest">
            Account
          </span>
          {SECONDARY_NAV.map((item) => (
            <SidebarNavItem key={item.id} item={item} />
          ))}
          <button className="group flex items-center gap-2.5 px-3 py-2 rounded-[4px] text-xs font-medium text-[#5A6478] hover:text-[#A8B3C5] hover:bg-[#141A22] transition-all duration-150 border border-transparent">
            <HelpCircle size={15} />
            Help & Docs
          </button>
        </div>
      </nav>

      {/* User footer */}
      <div className="p-3 border-t border-[#242C38]">
        <div className="flex items-center gap-2.5 p-2 rounded-[4px] hover:bg-[#1B222D] transition-colors cursor-pointer group">
          <Avatar name="Sarah Chen" size="sm" showStatus status="online" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-white truncate">Sarah Chen</p>
            <p className="text-[10px] text-[#5A6478] truncate">VP of Engineering</p>
          </div>
          <button className="opacity-0 group-hover:opacity-100 transition-opacity text-[#5A6478] hover:text-[#DA1E28]">
            <LogOut size={12} />
          </button>
        </div>
      </div>
    </aside>
  )
}
