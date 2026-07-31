import { motion } from 'framer-motion'

interface PageShellProps {
  children: React.ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <main className="flex flex-col min-h-screen pt-[var(--spacing-topnav)] lg:pl-[var(--layout-sidebar-w)]">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 flex flex-col gap-12 md:gap-20"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
