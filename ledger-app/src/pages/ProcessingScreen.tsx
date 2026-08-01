import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Loader2, Zap } from 'lucide-react'
import type { ProcessingStage } from '@/types/ledger'

const STAGES: { id: ProcessingStage; label: string; sub: string; duration: number }[] = [
  { id: 'uploading',   label: 'Upload Complete',           sub: 'File received and validated',                  duration: 900  },
  { id: 'extracting',  label: 'IBM Granite Extracting',    sub: 'Parsing commitments, owners and deadlines',    duration: 2200 },
  { id: 'verifying',   label: 'GitHub Verifying',          sub: 'Cross-referencing evidence in repositories',   duration: 1800 },
  { id: 'scoring',     label: 'Computing Health Score',    sub: 'Calculating commitment confidence',             duration: 1200 },
  { id: 'planning',    label: 'Generating Recovery Plan',  sub: 'Granite crafting targeted recommendations',    duration: 1600 },
  { id: 'complete',    label: 'Analysis Complete',         sub: 'Ready to review results',                      duration: 0    },
]

type StageStatus = 'pending' | 'active' | 'done'

interface StageState {
  id: ProcessingStage
  status: StageStatus
}

interface ProcessingScreenProps {
  onComplete: () => void
}

export function ProcessingScreen({ onComplete }: ProcessingScreenProps) {
  const [states, setStates] = useState<StageState[]>(
    STAGES.map((s, i) => ({ id: s.id, status: i === 0 ? 'active' : 'pending' }))
  )
  const [currentIdx, setCurrentIdx] = useState(0)

  useEffect(() => {
    let cancelled = false
    let idx = 0

    const advance = () => {
      if (cancelled) return
      const stage = STAGES[idx]
      if (!stage || stage.duration === 0) {
        // Final stage — complete
        setStates((prev) =>
          prev.map((s, i) => ({ ...s, status: i <= idx ? 'done' : s.status }))
        )
        setTimeout(onComplete, 800)
        return
      }
      setTimeout(() => {
        if (cancelled) return
        // Mark current done, next active
        setStates((prev) =>
          prev.map((s, i) => {
            if (i === idx) return { ...s, status: 'done' }
            if (i === idx + 1) return { ...s, status: 'active' }
            return s
          })
        )
        idx++
        setCurrentIdx(idx)
        advance()
      }, stage.duration)
    }

    advance()
    return () => { cancelled = true }
  }, [onComplete])

  return (
    <div className="min-h-screen bg-[#090D12] flex items-center justify-center px-4 sm:px-8">
      <div className="w-full max-w-[520px]">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10 md:mb-16"
        >
          <div className="inline-flex items-center justify-center w-[60px] h-[60px] rounded-2xl
                          bg-[rgba(15,98,254,0.12)] border border-[rgba(15,98,254,0.28)] mb-8
                          shadow-[0_0_24px_rgba(15,98,254,0.18)]">
            <Zap size={24} className="text-[#0F62FE]" fill="rgba(15,98,254,0.35)" />
          </div>
          <h1 className="text-[clamp(24px,6vw,32px)] font-light text-white tracking-tight mb-3">
            Analyzing your notes
          </h1>
          <p className="text-[14px] text-[#616E85] leading-relaxed">
            IBM Granite is processing your standup data
          </p>
        </motion.div>

        {/* Pipeline stages */}
        <div className="flex flex-col">
          {STAGES.map((stage, i) => {
            const state = states[i]
            const isDone   = state.status === 'done'
            const isActive = state.status === 'active'
            const _isPending = state.status === 'pending'

            return (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                {/* Connector line above (between cards) */}
                {i > 0 && (
                  <div className="flex justify-start pl-[19px] h-5">
                    <div
                      className="w-px h-full transition-colors duration-500"
                      style={{
                        background: states[i - 1].status === 'done'
                          ? 'rgba(36,161,72,0.3)'
                          : 'rgba(255,255,255,0.05)',
                      }}
                    />
                  </div>
                )}

                <div
                  className="flex items-center gap-4 px-6 py-5 rounded-2xl border transition-all duration-500"
                  style={{
                    background: isDone
                      ? 'rgba(36,161,72,0.045)'
                      : isActive
                      ? 'rgba(15,98,254,0.07)'
                      : 'rgba(23,30,40,0.5)',
                    borderColor: isDone
                      ? 'rgba(36,161,72,0.22)'
                      : isActive
                      ? 'rgba(15,98,254,0.32)'
                      : 'rgba(255,255,255,0.06)',
                    boxShadow: isActive
                      ? '0 0 24px rgba(15,98,254,0.1)'
                      : 'none',
                  }}
                >
                  {/* Status icon */}
                  <div className="shrink-0 w-9 h-9 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                      {isDone ? (
                        <motion.div
                          key="done"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        >
                          <CheckCircle2 size={20} className="text-[#24A148]" />
                        </motion.div>
                      ) : isActive ? (
                        <motion.div
                          key="active"
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                        >
                          <Loader2 size={20} className="text-[#0F62FE] animate-spin" />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="pending"
                          className="w-2 h-2 rounded-full bg-[#1F2A38]"
                        />
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Labels */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[14px] font-semibold leading-tight transition-colors duration-300"
                      style={{
                        color: isDone ? '#FFFFFF' : isActive ? '#FFFFFF' : '#3D4860',
                      }}
                    >
                      {stage.label}
                    </p>
                    <p
                      className="text-[12px] mt-1 transition-colors duration-300 leading-relaxed"
                      style={{
                        color: isDone ? '#616E85' : isActive ? '#B4BFCE' : '#2A3245',
                      }}
                    >
                      {stage.sub}
                    </p>
                  </div>

                  {/* Active pulsing dot */}
                  {isActive && (
                    <motion.div
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="w-2 h-2 rounded-full bg-[#0F62FE] shrink-0"
                    />
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[12px] text-[#616E85] font-medium">Processing</span>
            <span className="text-[12px] font-mono text-[#616E85]">
              {Math.round((currentIdx / (STAGES.length - 1)) * 100)}%
            </span>
          </div>
          <div className="h-[3px] bg-[#171E28] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#0F62FE] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${(currentIdx / (STAGES.length - 1)) * 100}%` }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              style={{ boxShadow: '0 0 8px rgba(15,98,254,0.5)' }}
            />
          </div>
        </div>

        {/* IBM Granite badge */}
        <div className="mt-10 flex items-center justify-center gap-2.5">
          <span className="text-[11px] text-[#3D4860]">Powered by</span>
          <span className="text-[11px] font-mono font-semibold text-[#616E85]">IBM Granite</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0F62FE] animate-pulse" />
        </div>

      </div>
    </div>
  )
}
