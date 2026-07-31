import { motion } from 'framer-motion'
import { Sidebar } from './Sidebar'

interface PageShellProps {
  children: React.ReactNode
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="min-h-screen bg-[#0B0F14]">
      <Sidebar />
      <main className="ml-[240px] min-h-screen flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 pt-14"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
