import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload, FileText, FileCode, File, X,
  GitFork, ChevronRight, ArrowDown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'
import type { DroppedFile } from '@/types/ledger'

const ACCEPTED_EXTENSIONS = ['.txt', '.pdf', '.docx', '.md']
const ACCEPTED_MIME = ['text/plain', 'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/markdown', 'text/x-markdown']

const FILE_TYPES = [
  { ext: 'TXT',  color: '#B4BFCE' },
  { ext: 'PDF',  color: '#0F62FE' },
  { ext: 'DOCX', color: '#4589FF' },
  { ext: 'MD',   color: '#8A3FFC' },
]

const PIPELINE_STEPS = [
  {
    step: '01',
    label: 'Upload Meeting Notes',
    sub: 'Standup notes, sprint reviews, team syncs',
    color: '#0F62FE',
    done: false,
    current: true,
  },
  {
    step: '02',
    label: 'IBM Granite Extraction',
    sub: 'AI parses and extracts commitments with confidence scores',
    color: '#8A3FFC',
    done: false,
    current: false,
  },
  {
    step: '03',
    label: 'GitHub Verification',
    sub: 'Every commitment cross-referenced against real evidence',
    color: '#1192E8',
    done: false,
    current: false,
  },
  {
    step: '04',
    label: 'AI Recovery Planner',
    sub: 'Granite generates realistic recovery strategies',
    color: '#F1C21B',
    done: false,
    current: false,
  },
  {
    step: '05',
    label: 'Executive Report',
    sub: 'Export-ready report with full audit trail',
    color: '#24A148',
    done: false,
    current: false,
  },
]

const FEATURE_CARDS = [
  {
    tag: 'AI Extraction',
    title: 'IBM Granite extracts commitments using structured AI',
    body: 'No manual entry. Upload your standup notes and Granite identifies every commitment, owner, deadline, and priority automatically.',
    color: '#8A3FFC',
    bg: 'rgba(138, 63, 252, 0.055)',
    border: 'rgba(138, 63, 252, 0.18)',
    icon: '◈',
  },
  {
    tag: 'Evidence Verification',
    title: 'Every recommendation is backed by GitHub evidence',
    body: 'Ledger connects to your repositories and verifies claims against real commits, pull requests, and activity timelines — not estimations.',
    color: '#1192E8',
    bg: 'rgba(17, 146, 232, 0.055)',
    border: 'rgba(17, 146, 232, 0.18)',
    icon: '◉',
  },
  {
    tag: 'Recovery Planner',
    title: 'AI generates realistic recovery plans before deadlines are missed',
    body: 'When risks are detected, Granite crafts actionable recovery strategies with ownership reassignment, timeline adjustments, and escalation paths.',
    color: '#24A148',
    bg: 'rgba(36, 161, 72, 0.055)',
    border: 'rgba(36, 161, 72, 0.18)',
    icon: '◆',
  },
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return <FileText size={15} className="text-[#0F62FE]" />
  if (ext === 'md') return <FileCode size={15} className="text-[#8A3FFC]" />
  return <File size={15} className="text-[#B4BFCE]" />
}

function isAccepted(file: File): boolean {
  const nameLower = file.name.toLowerCase()
  const extOk = ACCEPTED_EXTENSIONS.some((e) => nameLower.endsWith(e))
  const mimeOk = ACCEPTED_MIME.includes(file.type)
  return extOk || mimeOk
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

interface LandingPageProps {
  onUpload: (files: DroppedFile[]) => void
  githubConnected: boolean
  onConnectGithub: () => void
}

export function LandingPage({ onUpload, githubConnected, onConnectGithub }: LandingPageProps) {
  const [files, setFiles] = useState<DroppedFile[]>([])
  const [dragging, setDragging] = useState(false)
  const [dragRejected, setDragRejected] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragCounter = useRef(0)

  const processFiles = useCallback((raw: File[]) => {
    const accepted = raw.filter(isAccepted)
    const rejected = raw.filter((f) => !isAccepted(f))
    if (rejected.length > 0) { setDragRejected(true); setTimeout(() => setDragRejected(false), 1800) }
    if (accepted.length === 0) return
    const mapped: DroppedFile[] = accepted.map((f) => ({
      id: `${f.name}-${f.size}-${Date.now()}`,
      name: f.name,
      size: f.size,
      type: f.type,
    }))
    setFiles((prev) => {
      const existing = new Set(prev.map((p) => p.id))
      return [...prev, ...mapped.filter((m) => !existing.has(m.id))]
    })
  }, [])

  const onDragEnter = (e: React.DragEvent) => {
    e.preventDefault(); dragCounter.current++
    setDragging(true)
  }
  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault(); dragCounter.current--
    if (dragCounter.current === 0) setDragging(false)
  }
  const onDragOver = (e: React.DragEvent) => { e.preventDefault() }
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault(); dragCounter.current = 0; setDragging(false)
    processFiles(Array.from(e.dataTransfer.files))
  }
  const onFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files))
    e.target.value = ''
  }
  const removeFile = (id: string) => setFiles((p) => p.filter((f) => f.id !== id))

  const canAnalyze = files.length > 0

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative pt-[100px] pb-[80px] md:pt-[120px] md:pb-[100px] overflow-hidden">

        {/* Background glow — two soft orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[900px] h-[560px] rounded-full
                          bg-[rgba(15,98,254,0.045)] blur-[140px]" />
          <div className="absolute top-[60%] left-[60%]
                          w-[500px] h-[320px] rounded-full
                          bg-[rgba(138,63,252,0.03)] blur-[120px]" />
        </div>

        <Container className="relative z-10 flex flex-col items-center text-center">

          {/* Eyebrow label */}
          <motion.div {...fadeUp(0)}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2 bg-[rgba(15,98,254,0.08)]
                            border border-[rgba(15,98,254,0.22)] rounded-full mb-10">
              <span className="w-1.5 h-1.5 bg-[#0F62FE] rounded-full animate-pulse" />
              <span className="text-[12px] font-semibold text-[#4589FF] tracking-widest font-mono uppercase">
                Powered by IBM Granite
              </span>
            </div>
          </motion.div>

          {/* Main title */}
          <motion.h1
            {...fadeUp(0.08)}
            className="text-gradient-hero text-[clamp(52px,10vw,112px)] font-light
                       leading-[0.92] tracking-[-0.04em] mb-6 md:mb-8"
          >
            Ledger
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            {...fadeUp(0.15)}
            className="text-[clamp(18px,2.8vw,30px)] font-light text-[#B4BFCE]
                       leading-snug mb-4 md:mb-6 max-w-2xl px-2"
          >
            The AI co-worker that verifies work against reality.
          </motion.p>

          {/* Description */}
          <motion.p
            {...fadeUp(0.22)}
            className="text-[14px] md:text-[16px] text-[#616E85] leading-relaxed max-w-xl mb-10 md:mb-16 px-2"
          >
            Upload standup notes. IBM Granite extracts commitments. GitHub verifies
            evidence. Ledger generates recovery plans before deadlines are missed.
          </motion.p>

          {/* ── Upload zone ─────────────────────────────────────────── */}
          <motion.div {...fadeUp(0.3)} className="w-full max-w-[680px]">
            <div
              onDragEnter={onDragEnter}
              onDragLeave={onDragLeave}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onClick={() => inputRef.current?.click()}
              className={cn(
                'relative cursor-pointer rounded-2xl md:rounded-3xl border-2 border-dashed transition-all duration-300 px-4 py-10 sm:px-8 sm:py-12 md:px-12 md:py-14 group',
                dragging
                  ? 'upload-active scale-[1.015]'
                  : dragRejected
                  ? 'border-[#DA1E28] bg-[rgba(218,30,40,0.04)]'
                  : 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.018)]'
                    + ' hover:border-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.028)]'
              )}
            >
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPTED_EXTENSIONS.join(',')}
                onChange={onFileInput}
                className="hidden"
              />

              <div className="flex flex-col items-center gap-5">
                {/* Upload icon */}
                <motion.div
                  animate={dragging ? { scale: 1.12, rotate: 4 } : { scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className={cn(
                    'w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200',
                    dragging
                      ? 'bg-[rgba(15,98,254,0.2)] shadow-[0_0_24px_rgba(15,98,254,0.3)]'
                      : 'bg-[rgba(255,255,255,0.05)] group-hover:bg-[rgba(255,255,255,0.09)]'
                  )}
                >
                  <Upload
                    size={24}
                    className={cn(
                      'transition-colors duration-200',
                      dragging
                        ? 'text-[#0F62FE]'
                        : 'text-[#616E85] group-hover:text-[#B4BFCE]'
                    )}
                  />
                </motion.div>

                {/* Text */}
                <div className="text-center">
                  <p className="text-[17px] font-medium text-white mb-2">
                    {dragging ? 'Drop to upload' : 'Drop your meeting notes here'}
                  </p>
                  <p className="text-[14px] text-[#616E85]">
                    or{' '}
                    <span className="text-[#0F62FE] hover:text-[#4589FF] transition-colors cursor-pointer">
                      browse files
                    </span>
                  </p>
                </div>

                {/* File type badges */}
                <div className="flex items-center gap-2.5 mt-1">
                  {FILE_TYPES.map(({ ext, color }) => (
                    <span
                      key={ext}
                      style={{ color, borderColor: color + '45', background: color + '14' }}
                      className="px-3 py-1.5 text-[11px] font-mono font-semibold rounded-lg border tracking-wide"
                    >
                      {ext}
                    </span>
                  ))}
                </div>
              </div>

              {/* Rejected error */}
              {dragRejected && (
                <div className="absolute inset-x-0 bottom-4 flex justify-center">
                  <span className="text-xs text-[#DA1E28] font-semibold">
                    Unsupported file type
                  </span>
                </div>
              )}
            </div>

            {/* File list */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex flex-col gap-2"
                >
                  {files.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -14 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 14 }}
                      className="flex items-center gap-3 px-5 py-3.5 bg-[#171E28]
                                 border border-[rgba(255,255,255,0.07)] rounded-2xl"
                    >
                      {getFileIcon(file.name)}
                      <span className="flex-1 text-sm text-white truncate">{file.name}</span>
                      <span className="text-xs text-[#616E85] font-mono">{formatBytes(file.size)}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeFile(file.id) }}
                        className="text-[#3D4860] hover:text-[#DA1E28] transition-colors ml-1 p-0.5"
                      >
                        <X size={13} />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* CTAs */}
            <div className="mt-7 flex flex-col sm:flex-row items-center gap-3 justify-center">
              <motion.button
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.975 }}
                onClick={() => canAnalyze && onUpload(files)}
                disabled={!canAnalyze}
                className={cn(
                  'w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-[14px] font-semibold transition-all duration-200',
                  canAnalyze
                    ? 'bg-[#0F62FE] text-white btn-primary-glow hover:bg-[#0353E9]'
                    : 'bg-[rgba(255,255,255,0.06)] text-[#3D4860] cursor-not-allowed'
                )}
              >
                <Upload size={15} />
                Analyze with Granite
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.025 }}
                whileTap={{ scale: 0.975 }}
                onClick={onConnectGithub}
                className={cn(
                  'w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-[14px] font-semibold border transition-all duration-200',
                  githubConnected
                    ? 'border-[rgba(36,161,72,0.35)] bg-[rgba(36,161,72,0.08)] text-[#24A148] hover:bg-[rgba(36,161,72,0.12)]'
                    : 'border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.035)] text-[#B4BFCE]'
                      + ' hover:border-[rgba(255,255,255,0.22)] hover:text-white'
                )}
              >
                <GitFork size={15} />
                {githubConnected ? 'GitHub Connected' : 'Connect GitHub'}
              </motion.button>
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ── Section divider ─────────────────────────────────────────── */}
      <Container>
        <div className="section-divider" />
      </Container>

      {/* ── Pipeline ────────────────────────────────────────────────── */}
      <Section variant="loose">
        <Container>
          {/* Section header */}
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <p className="text-[11px] font-mono text-[#616E85] uppercase tracking-[0.2em] mb-4">
              How It Works
            </p>
            <h2 className="text-[clamp(32px,4.5vw,48px)] font-light text-white tracking-tight leading-tight">
              Five steps. Zero guesswork.
            </h2>
          </motion.div>

          {/* Steps */}
          <div className="flex flex-col w-full">
            {PIPELINE_STEPS.map((step, i) => (
              <motion.div
                key={step.step}
                {...fadeUp(i * 0.08)}
                className="relative"
              >
                {/* Connector line — between cards */}
                {i > 0 && (
                  <div className="flex justify-start pl-[27px] h-8 mb-0">
                    <div className="w-px h-full bg-[rgba(255,255,255,0.06)] pipeline-line" />
                  </div>
                )}

                <div
                  className="relative flex items-center gap-6 px-8 py-7 bg-[#171E28]
                             border border-[rgba(255,255,255,0.07)] rounded-2xl
                             hover:border-[rgba(255,255,255,0.12)] transition-all duration-300 group"
                  style={
                    step.current
                      ? { boxShadow: `0 0 0 1px ${step.color}45, 0 0 40px ${step.color}10` }
                      : {}
                  }
                >
                  {/* Step number badge */}
                  <div
                    className="w-[52px] h-[52px] rounded-2xl flex items-center justify-center
                               text-[14px] font-mono font-semibold shrink-0"
                    style={{
                      background: step.color + '16',
                      color: step.color,
                      border: `1px solid ${step.color}35`,
                    }}
                  >
                    {step.step}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[15px] font-semibold text-white mb-1">{step.label}</p>
                    <p className="text-[13px] text-[#616E85] leading-relaxed">{step.sub}</p>
                  </div>

                  <ChevronRight
                    size={15}
                    style={{ color: step.color + '70' }}
                    className="group-hover:translate-x-0.5 transition-transform shrink-0"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Feature Cards ───────────────────────────────────────────── */}
      <Section variant="loose">
        <Container>

          {/* Section header */}
          <motion.div {...fadeUp(0)} className="text-center mb-14">
            <p className="text-[11px] font-mono text-[#616E85] uppercase tracking-[0.2em] mb-4">
              Capabilities
            </p>
            <h2 className="text-[clamp(32px,4.5vw,48px)] font-light text-white tracking-tight leading-tight">
              Built for accountability at scale.
            </h2>
          </motion.div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURE_CARDS.map((card, i) => (
              <motion.div
                key={card.tag}
                {...fadeUp(i * 0.1)}
                className="relative flex flex-col p-9 rounded-3xl border overflow-hidden
                           cursor-default card-lift"
                style={{ background: card.bg, borderColor: card.border }}
              >
                {/* Icon */}
                <div
                  className="text-[22px] mb-8 w-14 h-14 flex items-center justify-center rounded-2xl"
                  style={{
                    color: card.color,
                    background: card.color + '16',
                    border: `1px solid ${card.color}32`,
                  }}
                >
                  {card.icon}
                </div>

                {/* Tag */}
                <span
                  className="text-[11px] font-mono font-semibold uppercase tracking-[0.18em] mb-4"
                  style={{ color: card.color }}
                >
                  {card.tag}
                </span>

                {/* Title */}
                <h3 className="text-[18px] font-semibold text-white leading-snug mb-5">
                  {card.title}
                </h3>

                {/* Body */}
                <p className="text-[14px] text-[#616E85] leading-[1.75] flex-1">
                  {card.body}
                </p>
              </motion.div>
            ))}
          </div>
        </Container>
      </Section>

      {/* ── Footer CTA ──────────────────────────────────────────────── */}
      <Section variant="loose">
        <Container>
          <motion.div
          {...fadeUp(0)}
          className="w-full text-center
                     px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-24 bg-[#111720]
                     border border-[rgba(255,255,255,0.07)] rounded-2xl md:rounded-3xl
                     shadow-[0_32px_80px_rgba(0,0,0,0.45)]"
        >
          <p className="text-[11px] font-mono text-[#616E85] uppercase tracking-[0.2em] mb-6">
            Get Started
          </p>
          <h2 className="text-[clamp(24px,4vw,44px)] font-light text-white tracking-tight
                         leading-tight mb-5">
            Your team said it.{' '}
            <br className="hidden sm:block" />
            <span className="text-gradient-blue">Ledger will verify it.</span>
          </h2>
          <p className="text-[14px] md:text-[15px] text-[#616E85] mb-8 md:mb-12 leading-relaxed max-w-md mx-auto">
            Drop your standup notes above and let Granite go to work.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2.5 px-7 sm:px-10 py-3.5 sm:py-4 bg-[#0F62FE] text-white
                       text-[14px] font-semibold rounded-2xl hover:bg-[#0353E9] transition-all
                       duration-200 btn-primary-glow"
          >
            <Upload size={15} />
            Upload Notes Now
          </button>
        </motion.div>
        </Container>
      </Section>

    </div>
  )
}
