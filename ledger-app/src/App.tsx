import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { TopNav } from '@/components/layout/TopNav'
import { AppFooter } from '@/components/layout/AppFooter'
import { LandingPage } from '@/pages/LandingPage'
import { ProcessingScreen } from '@/pages/ProcessingScreen'
import { WorkspacePage } from '@/pages/WorkspacePage'
import { RecoveryPlannerPage } from '@/pages/RecoveryPlannerPage'
import { ExecutiveReportPage } from '@/pages/ExecutiveReportPage'
import type { Screen, DroppedFile } from '@/types/ledger'

const PAGE_TRANSITION = {
  initial:    { opacity: 0, y: 12 },
  animate:    { opacity: 1,  y: 0  },
  exit:       { opacity: 0, y: -8  },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [githubConnected, setGithubConnected] = useState(false)

  const handleUpload = useCallback((_files: DroppedFile[]) => {
    setScreen('processing')
  }, [])

  const handleProcessingComplete = useCallback(() => {
    setScreen('workspace')
  }, [])

  const handleConnectGithub = useCallback(() => {
    setGithubConnected((v) => !v)
  }, [])

  const handleNavigate = useCallback((dest: string) => {
    // Only navigate to screens that have content
    const valid: Screen[] = ['home', 'workspace', 'recovery', 'report']
    if (valid.includes(dest as Screen)) {
      setScreen(dest as Screen)
    }
  }, [])

  return (
    <div className="min-h-screen bg-[#090D12] text-white overflow-x-hidden">
      {/* Sticky top nav — hidden during processing */}
      {screen !== 'processing' && (
        <TopNav
          currentScreen={screen}
          onNavigate={handleNavigate}
          githubConnected={githubConnected}
          onConnectGithub={handleConnectGithub}
        />
      )}

      {/* Page content — animated transitions. Wrapped in a single top-padding so content never sits under TopNav */}
      <main className="pt-[var(--spacing-topnav)]">
        <AnimatePresence mode="wait">
          {screen === 'home' && (
            <motion.div key="home" {...PAGE_TRANSITION}>
              <LandingPage
                onUpload={handleUpload}
                githubConnected={githubConnected}
                onConnectGithub={handleConnectGithub}
              />
            </motion.div>
          )}

          {screen === 'processing' && (
            <motion.div key="processing" {...PAGE_TRANSITION}>
              <ProcessingScreen onComplete={handleProcessingComplete} />
            </motion.div>
          )}

          {screen === 'workspace' && (
            <motion.div key="workspace" {...PAGE_TRANSITION}>
              <WorkspacePage />
            </motion.div>
          )}

          {screen === 'recovery' && (
            <motion.div key="recovery" {...PAGE_TRANSITION}>
              <RecoveryPlannerPage />
            </motion.div>
          )}

          {screen === 'report' && (
            <motion.div key="report" {...PAGE_TRANSITION}>
              <ExecutiveReportPage />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer — shown on content screens */}
      {screen !== 'processing' && <AppFooter />}
    </div>
  )
}

export default App
