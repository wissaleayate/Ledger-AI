import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wifi, WifiOff, ChevronDown, GitFork, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from './Container'

interface TopNavProps {
  currentScreen: string
  onNavigate: (screen: string) => void
  githubConnected: boolean
  onConnectGithub: () => void
}

const NAV_LINKS = [
  { id: 'home',      label: 'Overview' },
  { id: 'workspace', label: 'Workspace' },
  { id: 'recovery',  label: 'Recovery Planner' },
  { id: 'report',    label: 'Executive Report' },
]

export function TopNav({ currentScreen, onNavigate, githubConnected, onConnectGithub }: TopNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-[#090D12]/92 backdrop-blur-2xl border-b border-[rgba(255,255,255,0.07)]'
          : 'bg-transparent'
      )}
    >
      <Container className="h-[var(--spacing-topnav)] flex items-center justify-between">

        {/* ── Logo (Left) ──────────────────────────────────────── */}
        <div className="flex w-auto md:w-[280px] shrink-0">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-3 shrink-0 group"
          >
          <div className="w-8 h-8 rounded-[10px] bg-[#0F62FE] flex items-center justify-center
                          shadow-[0_0_18px_rgba(15,98,254,0.45)] transition-all duration-200
                          group-hover:shadow-[0_0_24px_rgba(15,98,254,0.6)]">
            <Zap size={15} className="text-white" fill="white" />
          </div>
          <span className="text-[17px] font-semibold text-white tracking-tight">
            Ledger
          </span>
          <span className="hidden xs:inline text-[10px] font-mono font-semibold text-[#616E85]
                           border border-[rgba(255,255,255,0.1)] px-1.5 py-0.5 rounded-md
                           tracking-wider uppercase">
            AI
          </span>
          </button>
        </div>

        {/* ── Nav Links (Center) ───────────────────── */}
        <nav className="hidden md:flex items-center gap-1 justify-center">
          {NAV_LINKS.map((link) => {
            const active = currentScreen === link.id
            return (
              <button
                key={link.id}
                onClick={() => onNavigate(link.id)}
                className={cn(
                  'relative px-4 py-2 text-[13px] font-medium rounded-lg transition-all duration-200',
                  active
                    ? 'text-white'
                    : 'text-[#616E85] hover:text-[#B4BFCE]'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-[rgba(255,255,255,0.07)]
                               border border-[rgba(255,255,255,0.1)] rounded-lg"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            )
          })}
        </nav>

        {/* ── Right Side ────────────────────────────── */}
        <div className="flex items-center gap-2 md:gap-3 shrink-0 w-auto md:w-[280px] justify-end">
          {/* GitHub Connection Status */}
          <button
            onClick={onConnectGithub}
            className={cn(
              'hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-lg border text-[12px] font-medium transition-all duration-200',
              githubConnected
                ? 'bg-[rgba(36,161,72,0.08)] border-[rgba(36,161,72,0.22)] text-[#24A148] hover:bg-[rgba(36,161,72,0.13)]'
                : 'bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.09)] text-[#616E85]'
                  + ' hover:text-[#B4BFCE] hover:border-[rgba(255,255,255,0.15)]'
            )}
          >
            <GitFork size={13} />
            <span>{githubConnected ? 'Connected' : 'Connect GitHub'}</span>
            {githubConnected && (
              <span className="w-1.5 h-1.5 bg-[#24A148] rounded-full animate-pulse" />
            )}
          </button>

          {/* Connection dot */}
          <div className="hidden lg:flex items-center gap-1.5 text-[#616E85]">
            {githubConnected
              ? <Wifi size={13} className="text-[#24A148]" />
              : <WifiOff size={13} />
            }
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex items-center gap-1 text-[#616E85] hover:text-white transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <ChevronDown
              size={16}
              className={cn('transition-transform duration-200', mobileOpen && 'rotate-180')}
            />
          </button>
        </div>
      </Container>

      {/* ── Mobile nav drawer ─────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-[rgba(255,255,255,0.07)]
                       bg-[#090D12]/96 backdrop-blur-2xl overflow-hidden"
          >
            <div className="flex flex-col px-6 py-5 gap-1">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.id}
                  onClick={() => { onNavigate(link.id); setMobileOpen(false) }}
                  className={cn(
                    'text-left px-4 py-3 rounded-xl text-[13px] font-medium transition-colors',
                    currentScreen === link.id
                      ? 'bg-[rgba(255,255,255,0.07)] text-white'
                      : 'text-[#616E85] hover:text-white'
                  )}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
