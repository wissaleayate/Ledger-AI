import { useState, useCallback, useRef } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Zap, Upload, GitBranch, FileText, File, FileCode,
  CheckCircle2, Sparkles, X, Shield, Brain, GitMerge,
  ClipboardList, TrendingUp, ArrowRight, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ────────────────────────────────────────────────────────────────────

interface DroppedFile {
  id: string
  name: string
  size: number
  type: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const ACCEPTED_EXTENSIONS = ['.txt', '.pdf', '.docx', '.md']
const ACCEPTED_MIME = [
  'text/plain',
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/markdown',
  'text/x-markdown',
]

const NAV_LINKS = [
  { id: 'projects',    label: 'Projects',       path: '/projects' },
  { id: 'sprint',      label: 'Current Sprint', path: '/goals' },
  { id: 'commitments', label: 'Commitments',    path: '/commitments' },
  { id: 'evidence',    label: 'Evidence',       path: '/evidence' },
  { id: 'insights',    label: 'Insights',       path: '/reports' },
  { id: 'settings',    label: 'Settings',       path: '/settings' },
]

const FILE_TYPES = [
  { icon: FileText, color: '#A8B3C5', bg: 'rgba(168,179,197,0.08)', border: 'rgba(168,179,197,0.15)', label: '.txt'  },
  { icon: File,     color: '#F87171', bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)',  label: '.pdf'  },
  { icon: FileCode, color: '#A78BFA', bg: 'rgba(167,139,250,0.08)', border: 'rgba(167,139,250,0.2)', label: '.md'   },
  { icon: FileText, color: '#60A5FA', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.2)',  label: '.docx' },
] as const

const WORKFLOW_STEPS = [
  {
    id: 'upload',
    icon: Upload,
    label: 'Upload Meeting Notes',
    description: 'Drop standup notes, sprint reviews, or retrospectives — any unstructured text works.',
    state: 'done' as const,
    number: '01',
  },
  {
    id: 'granite',
    icon: Brain,
    label: 'IBM Granite Extraction',
    description: 'Granite AI parses commitments, owners, and deadlines with enterprise-grade accuracy.',
    state: 'active' as const,
    number: '02',
  },
  {
    id: 'github',
    icon: GitMerge,
    label: 'GitHub Verification',
    description: 'Every commitment is cross-referenced against real commits, PRs, and issue history.',
    state: 'pending' as const,
    number: '03',
  },
  {
    id: 'recovery',
    icon: TrendingUp,
    label: 'AI Recovery Planner',
    description: 'Ledger surfaces blockers and proposes recovery paths before deadlines slip.',
    state: 'pending' as const,
    number: '04',
  },
  {
    id: 'report',
    icon: ClipboardList,
    label: 'Executive Report',
    description: 'A concise, evidence-backed report delivered to leadership automatically.',
    state: 'pending' as const,
    number: '05',
  },
]

const TRUST_CARDS = [
  {
    icon: Brain,
    color: '#60A5FA',
    bg: 'rgba(96,165,250,0.07)',
    border: 'rgba(96,165,250,0.15)',
    title: 'AI Extraction',
    description:
      'IBM Granite extracts structured commitments, owners, and deadlines from unstructured standup notes using enterprise-grade LLMs.',
    label: 'Powered by IBM Granite',
  },
  {
    icon: GitBranch,
    color: '#34D399',
    bg: 'rgba(52,211,153,0.07)',
    border: 'rgba(52,211,153,0.15)',
    title: 'Evidence Verification',
    description:
      'Every AI recommendation is backed by real GitHub evidence — commits, pull requests, and issue history — not assumptions.',
    label: 'GitHub native',
  },
  {
    icon: TrendingUp,
    color: '#A78BFA',
    bg: 'rgba(167,139,250,0.07)',
    border: 'rgba(167,139,250,0.15)',
    title: 'Recovery Planner',
    description:
      'Ledger AI suggests targeted recovery plans before deadlines are missed, giving teams time to course-correct with confidence.',
    label: 'Proactive AI',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf')  return <File size={14} style={{ color: '#F87171' }} />
  if (ext === 'md')   return <FileCode size={14} style={{ color: '#A78BFA' }} />
  if (ext === 'docx') return <FileText size={14} style={{ color: '#60A5FA' }} />
  return <FileText size={14} style={{ color: '#A8B3C5' }} />
}

function isAccepted(file: File): boolean {
  const ext = '.' + file.name.split('.').pop()?.toLowerCase()
  return ACCEPTED_EXTENSIONS.includes(ext) || ACCEPTED_MIME.includes(file.type)
}

// ─── Motion presets ───────────────────────────────────────────────────────────

function fadeUp(delay = 0, y = 24) {
  return {
    initial:    { opacity: 0, y },
    animate:    { opacity: 1, y: 0 },
    transition: { duration: 0.55, ease: 'easeOut' as const, delay },
  }
}

// ─── Navigation ───────────────────────────────────────────────────────────────

function LandingNav() {
  return (
    <>
      {/* Accessibility: skip to main content */}
      <a href="#hero" className="skip-link">Skip to main content</a>

      <motion.header
        role="banner"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        className="fixed top-0 inset-x-0 z-50 h-[60px] flex items-center
                   px-5 sm:px-8 lg:px-12
                   bg-[#0B0F14]/90 backdrop-blur-2xl
                   border-b border-white/[0.05]"
      >
        {/* Logo */}
        <NavLink
          to="/"
          aria-label="Ledger — home"
          className="flex items-center gap-2.5 shrink-0 mr-8 group
                     focus-visible:outline-none focus-visible:ring-2
                     focus-visible:ring-[#0F62FE] focus-visible:ring-offset-2
                     focus-visible:ring-offset-[#0B0F14] rounded-md"
        >
          <div
            aria-hidden
            className="w-[30px] h-[30px] rounded-[7px] bg-[#0F62FE] flex items-center justify-center
                       shadow-[0_0_18px_rgba(15,98,254,0.45)]
                       group-hover:shadow-[0_0_28px_rgba(15,98,254,0.65)]
                       transition-shadow duration-300"
          >
            <Zap size={14} className="text-white" fill="white" />
          </div>
          <span className="text-[15px] font-semibold text-white tracking-[-0.025em] leading-none">
            Ledger
          </span>
        </NavLink>

        {/* Primary nav */}
        <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-0.5 flex-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.id}
              to={link.path}
              className={({ isActive }) =>
                cn(
                  'px-3 py-1.5 rounded-[6px] text-[13px] font-medium',
                  'transition-all duration-150 leading-none',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62FE]',
                  isActive
                    ? 'text-white bg-[rgba(15,98,254,0.14)] shadow-[inset_0_0_0_1px_rgba(15,98,254,0.28)]'
                    : 'text-[#5A6478] hover:text-[#C8D1DF] hover:bg-white/[0.04]'
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: auth actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <NavLink
            to="/signin"
            className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-[6px]
                       text-[13px] font-medium text-[#8A96A8]
                       hover:text-white hover:bg-white/[0.05]
                       transition-all duration-150 leading-none
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62FE]"
          >
            Sign in
          </NavLink>

          <motion.a
            href="#hero"
            whileHover={{ boxShadow: '0 0 22px rgba(15,98,254,0.5)' }}
            whileTap={{ scale: 0.96 }}
            className="inline-flex items-center gap-1.5 px-4 py-[7px]
                       text-[13px] font-semibold text-white
                       bg-[#0F62FE] hover:bg-[#0353E9]
                       rounded-[7px] border border-[#0F62FE]/80
                       transition-colors duration-150 leading-none cursor-pointer
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white
                       focus-visible:ring-offset-2 focus-visible:ring-offset-[#0F62FE]"
          >
            Get started
            <ChevronRight size={12} strokeWidth={2.5} />
          </motion.a>
        </div>
      </motion.header>
    </>
  )
}

// ─── Upload Zone ──────────────────────────────────────────────────────────────

interface UploadZoneProps {
  files: DroppedFile[]
  onFiles: (files: DroppedFile[]) => void
  onRemove: (id: string) => void
}

function UploadZone({ files, onFiles, onRemove }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [rejected, setRejected]     = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = useCallback((raw: FileList | null) => {
    if (!raw) return
    const accepted: DroppedFile[] = []
    const bad: string[] = []
    Array.from(raw).forEach((f) => {
      if (isAccepted(f)) {
        accepted.push({ id: crypto.randomUUID(), name: f.name, size: f.size, type: f.type })
      } else {
        bad.push(f.name)
      }
    })
    if (accepted.length) onFiles(accepted)
    if (bad.length) {
      setRejected(bad)
      setTimeout(() => setRejected([]), 4000)
    }
  }, [onFiles])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false); processFiles(e.dataTransfer.files)
  }, [processFiles])
  const onDragOver  = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const onDragLeave = (e: React.DragEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) setIsDragging(false)
  }

  return (
    <div className="flex flex-col gap-2.5">

      {/* ── Drop target ── */}
      <motion.div
        role="button"
        tabIndex={0}
        aria-label="Upload area. Click or drag files here."
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputRef.current?.click() } }}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        whileHover={isDragging ? {} : {
          borderColor: 'rgba(15,98,254,0.45)',
          boxShadow: '0 0 0 1px rgba(15,98,254,0.15), 0 12px 48px rgba(0,0,0,0.45)',
        }}
        animate={{
          borderColor: isDragging ? '#0F62FE' : 'rgba(255,255,255,0.07)',
          backgroundColor: isDragging ? 'rgba(15,98,254,0.06)' : 'rgba(17,22,30,0.75)',
          boxShadow: isDragging
            ? '0 0 0 1px #0F62FE, 0 0 48px rgba(15,98,254,0.18)'
            : '0 4px 32px rgba(0,0,0,0.4)',
        }}
        transition={{ duration: 0.18 }}
        className="relative w-full rounded-2xl border border-dashed
                   flex flex-col items-center justify-center gap-7
                   py-14 px-8 cursor-pointer select-none overflow-hidden
                   focus-visible:outline-none focus-visible:ring-2
                   focus-visible:ring-[#0F62FE] focus-visible:ring-offset-2
                   focus-visible:ring-offset-[#0B0F14]"
        style={{ minHeight: '264px' }}
      >
        {/* Drag-active inner glow */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(15,98,254,0.1) 0%, transparent 70%)',
              }}
            />
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          id="file-upload"
          type="file"
          multiple
          accept=".txt,.pdf,.docx,.md"
          aria-label="Upload standup notes"
          className="sr-only"
          onChange={(e) => processFiles(e.target.files)}
        />

        {/* File-type icon cluster */}
        <motion.div
          animate={{ y: isDragging ? -8 : 0 }}
          transition={{ type: 'spring', stiffness: 320, damping: 20 }}
          className="flex items-end gap-3"
          aria-hidden
        >
          {FILE_TYPES.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
              className="flex flex-col items-center gap-2"
            >
              <motion.div
                whileHover={{ y: -4, scale: 1.08 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                className="w-[46px] h-[46px] rounded-xl flex items-center justify-center border"
                style={{ backgroundColor: item.bg, borderColor: item.border }}
              >
                <item.icon size={20} style={{ color: item.color }} />
              </motion.div>
              <span
                className="text-[10px] font-mono tracking-wider leading-none"
                style={{ color: item.color + '99' }}
              >
                {item.label}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Instruction copy */}
        <div className="flex flex-col items-center gap-2 text-center">
          <AnimatePresence mode="wait">
            {isDragging ? (
              <motion.p
                key="drop"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-[15px] font-semibold text-[#0F62FE] leading-snug"
              >
                Release to upload
              </motion.p>
            ) : (
              <motion.p
                key="idle"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="text-[15px] font-medium text-white/80 leading-snug"
              >
                Drag &amp; drop your standup&nbsp;notes
              </motion.p>
            )}
          </AnimatePresence>

          <p className="text-[13px] text-[#5A6478] leading-none">
            or{' '}
            <span
              className="text-[#4D8FFF] font-medium underline underline-offset-2
                         hover:text-[#7CB3FF] transition-colors"
            >
              browse files
            </span>
            <span className="mx-2 text-[#2E3848]">·</span>
            <span className="font-mono text-[11px] text-[#3A4255] tracking-wide">.txt .pdf .docx .md</span>
          </p>
        </div>
      </motion.div>

      {/* Rejection feedback */}
      <AnimatePresence>
        {rejected.length > 0 && (
          <motion.div
            role="alert"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <p className="text-[12px] text-[#F87171] px-1 py-1.5 flex items-center gap-1.5">
              <X size={11} />
              Unsupported file type: {rejected.join(', ')}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Queued file list */}
      <AnimatePresence initial={false}>
        {files.map((f) => (
          <motion.div
            key={f.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl mt-0.5
                         bg-[#141A22] border border-white/[0.06]
                         hover:border-white/[0.1] transition-colors"
            >
              {getFileIcon(f.name)}
              <span className="flex-1 text-[13px] text-white/85 truncate font-medium leading-none">
                {f.name}
              </span>
              <span className="text-[11px] font-mono text-[#5A6478] shrink-0 leading-none tabular-nums">
                {formatBytes(f.size)}
              </span>
              <button
                aria-label={`Remove ${f.name}`}
                onClick={(e) => { e.stopPropagation(); onRemove(f.id) }}
                className="ml-1 p-1 rounded text-[#3A4255] hover:text-[#F87171]
                           hover:bg-[#F87171]/10 transition-all shrink-0
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-[#F87171]"
              >
                <X size={12} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* IBM Granite tag */}
      <p className="flex items-center justify-center gap-1.5 text-[11px] text-[#3A4255] pt-0.5 select-none">
        <Sparkles size={9} className="text-[#8A3FFC]/70" aria-hidden />
        Powered by IBM&nbsp;Granite for structured AI extraction.
      </p>
    </div>
  )
}

// ─── Workflow Section ─────────────────────────────────────────────────────────

function WorkflowStep({
  step,
  index,
  isLast,
}: {
  step: typeof WORKFLOW_STEPS[0]
  index: number
  isLast: boolean
}) {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const isDone   = step.state === 'done'
  const isActive = step.state === 'active'

  const iconBg     = isDone   ? 'rgba(52,211,153,0.1)'   : isActive ? 'rgba(15,98,254,0.12)' : 'rgba(255,255,255,0.03)'
  const iconBorder = isDone   ? 'rgba(52,211,153,0.3)'   : isActive ? 'rgba(15,98,254,0.4)'  : 'rgba(255,255,255,0.06)'
  const iconColor  = isDone   ? '#34D399'                : isActive ? '#60A5FA'               : '#3A4255'
  const labelColor = isDone || isActive ? '#FFFFFF'      : '#4A5568'
  const descColor  = isDone   ? '#94A3B8'                : isActive ? '#94A3B8'               : '#2D3748'
  const numColor   = isDone   ? '#34D399'                : isActive ? '#3B82F6'               : '#2D3748'

  return (
    <div ref={ref} className="flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.08 }}
        className={cn(
          'relative flex flex-col items-center text-center w-56 px-2',
          'p-5 rounded-2xl border transition-colors duration-300',
          isDone   ? 'bg-[rgba(52,211,153,0.04)] border-[rgba(52,211,153,0.12)]' :
          isActive ? 'bg-[rgba(15,98,254,0.05)] border-[rgba(15,98,254,0.18)]' :
                     'bg-transparent border-transparent'
        )}
      >
        {/* Step number */}
        <span
          className="absolute top-3 right-3 text-[10px] font-mono font-bold tracking-widest leading-none"
          style={{ color: numColor }}
        >
          {step.number}
        </span>

        {/* Icon */}
        <motion.div
          animate={isActive ? {
            boxShadow: [
              '0 0 0px rgba(15,98,254,0)',
              '0 0 20px rgba(15,98,254,0.4)',
              '0 0 10px rgba(15,98,254,0.2)',
            ],
          } : {}}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-[52px] h-[52px] rounded-[14px] flex items-center justify-center border mb-4 shrink-0"
          style={{ backgroundColor: iconBg, borderColor: iconBorder }}
          aria-hidden
        >
          {isDone
            ? <CheckCircle2 size={22} style={{ color: '#34D399' }} />
            : <step.icon size={21} style={{ color: iconColor }} />
          }
        </motion.div>

        <p className="text-[13px] font-semibold mb-2 leading-snug" style={{ color: labelColor }}>
          {step.label}
        </p>
        <p className="text-[12px] leading-relaxed" style={{ color: descColor }}>
          {step.description}
        </p>

        {isActive && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1
                       bg-[rgba(15,98,254,0.1)] border border-[rgba(15,98,254,0.25)]
                       rounded-full text-[10px] font-semibold text-[#60A5FA]
                       tracking-wide uppercase"
          >
            <motion.span
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-[5px] h-[5px] rounded-full bg-[#3B82F6] shrink-0"
              aria-hidden
            />
            Processing
          </motion.span>
        )}
      </motion.div>

      {/* Connector arrow */}
      {!isLast && (
        <motion.div
          initial={{ opacity: 0, y: -4 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: index * 0.08 + 0.25, duration: 0.3 }}
          className="my-1 flex flex-col items-center gap-0"
          aria-hidden
        >
          <div className={cn(
            'w-px h-5',
            isDone ? 'bg-gradient-to-b from-[rgba(52,211,153,0.4)] to-[rgba(52,211,153,0.15)]' : 'bg-[#1D2533]'
          )} />
          <ArrowRight
            size={13}
            strokeWidth={1.5}
            className="rotate-90"
            style={{ color: isDone ? 'rgba(52,211,153,0.5)' : '#2D3748' }}
          />
          <div className="w-px h-5 bg-[#1D2533]" />
        </motion.div>
      )}
    </div>
  )
}

function WorkflowSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section
      ref={ref}
      aria-labelledby="workflow-heading"
      className="relative py-36 px-6"
    >
      {/* Top divider */}
      <div className="section-divider absolute top-0 inset-x-0" aria-hidden />

      {/* Faint background bloom */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(15,98,254,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-3xl mx-auto flex flex-col items-center">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="flex flex-col items-center gap-5 text-center mb-16"
        >
          <span
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5
                       text-[10px] font-bold uppercase tracking-[0.14em]
                       text-[#3B82F6] bg-[rgba(59,130,246,0.08)]
                       border border-[rgba(59,130,246,0.2)] rounded-full"
          >
            <Sparkles size={9} aria-hidden />
            How it works
          </span>

          <div>
            <h2
              id="workflow-heading"
              className="text-[32px] lg:text-[40px] font-semibold text-white
                         tracking-[-0.03em] leading-[1.1]"
            >
              From standup to evidence,
            </h2>
            <p className="text-[32px] lg:text-[40px] font-light text-[#4A5568]
                          tracking-[-0.03em] leading-[1.1]">
              in minutes — not days.
            </p>
          </div>
        </motion.div>

        {/* Step column */}
        <div className="flex flex-col items-center w-full" role="list" aria-label="Workflow steps">
          {WORKFLOW_STEPS.map((step, i) => (
            <div key={step.id} role="listitem">
              <WorkflowStep step={step} index={i} isLast={i === WORKFLOW_STEPS.length - 1} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Trust Section ────────────────────────────────────────────────────────────

function TrustSection() {
  const ref    = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })

  return (
    <section
      ref={ref}
      aria-labelledby="trust-heading"
      className="relative py-32 px-6 lg:px-12"
    >
      <div className="section-divider absolute top-0 inset-x-0" aria-hidden />

      <div className="max-w-5xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.45 }}
          className="text-center mb-16"
        >
          <h2
            id="trust-heading"
            className="text-[30px] lg:text-[38px] font-semibold text-white
                       tracking-[-0.03em] leading-tight mb-4"
          >
            Built for teams that ship.
          </h2>
          <p className="text-[16px] text-[#4A5568] max-w-md mx-auto leading-relaxed">
            Ledger closes the gap between what teams say and what they deliver.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {TRUST_CARDS.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, ease: 'easeOut', delay: i * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group relative flex flex-col gap-6 p-7 rounded-2xl
                         border transition-all duration-300 cursor-default overflow-hidden"
              style={{
                background: card.bg,
                borderColor: card.border,
              }}
            >
              {/* Top shimmer line */}
              <div
                aria-hidden
                className="absolute top-0 left-8 right-8 h-px opacity-70 rounded-full"
                style={{
                  background: `linear-gradient(90deg, transparent, ${card.color}50, transparent)`,
                }}
              />

              {/* Header row */}
              <div className="flex items-start justify-between gap-3">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ backgroundColor: card.bg, borderColor: card.border }}
                  aria-hidden
                >
                  <card.icon size={20} style={{ color: card.color }} />
                </div>
                <span
                  className="text-[10px] font-semibold uppercase tracking-[0.1em] leading-none
                             px-2 py-1 rounded-full border mt-1"
                  style={{
                    color: card.color,
                    borderColor: card.border,
                    backgroundColor: card.bg,
                  }}
                >
                  {card.label}
                </span>
              </div>

              {/* Body */}
              <div className="flex flex-col gap-2.5 flex-1">
                <h3
                  className="text-[16px] font-semibold text-white tracking-[-0.02em] leading-snug"
                >
                  {card.title}
                </h3>
                <p className="text-[13px] text-[#4A5568] leading-[1.65]">
                  {card.description}
                </p>
              </div>

              {/* Footer CTA */}
              <div className="pt-1 border-t border-white/[0.05] mt-auto">
                <span
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium
                             transition-colors duration-200"
                  style={{ color: card.color + 'BB' }}
                >
                  Learn more
                  <ChevronRight size={11} strokeWidth={2.5} aria-hidden />
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Root Page ────────────────────────────────────────────────────────────────

export function LandingPage() {
  const [files, setFiles] = useState<DroppedFile[]>([])

  const handleFiles = useCallback((incoming: DroppedFile[]) => {
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name))
      return [...prev, ...incoming.filter((f) => !existing.has(f.name))]
    })
  }, [])

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0F14] flex flex-col overflow-x-hidden">
      <LandingNav />

      {/* ── Background layers (fixed, decorative) ── */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 select-none">
        {/* Blue radial — top center */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 90% 55% at 50% -5%, rgba(15,98,254,0.11) 0%, transparent 60%)',
        }} />
        {/* Purple accent — bottom right */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 55% 45% at 85% 65%, rgba(139,92,246,0.06) 0%, transparent 65%)',
        }} />
        {/* Dot-grid texture */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.045) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
        }} />
        {/* Vignette — pulls focus to center */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 50%, rgba(11,15,20,0.7) 100%)',
        }} />
      </div>

      {/* ── Hero ── */}
      <main
        id="hero"
        aria-label="Hero"
        className="relative z-10 flex flex-col items-center justify-center
                   min-h-[88vh] px-5 sm:px-8
                   pt-[96px] pb-28"
      >
        {/* Eyebrow badge */}
        <motion.div {...fadeUp(0)} className="mb-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2
                       text-[11px] font-semibold uppercase tracking-[0.1em]
                       text-[#5A6478] border border-white/[0.07] rounded-full
                       bg-white/[0.03]"
            role="note"
            aria-label="Trust signals"
          >
            <Shield size={10} aria-hidden />
            SOC 2 Type II
            <span aria-hidden className="w-px h-3 bg-white/10 mx-0.5" />
            <Zap size={10} className="text-[#3B82F6]" aria-hidden />
            IBM Granite AI
            <span aria-hidden className="w-px h-3 bg-white/10 mx-0.5" />
            <CheckCircle2 size={10} className="text-[#34D399]" aria-hidden />
            Zero-trust
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.07)}
          className="text-gradient-brand
                     text-[76px] sm:text-[92px] lg:text-[104px]
                     font-bold text-center
                     leading-[0.93] tracking-[-0.05em]
                     mb-8 max-w-3xl"
        >
          Ledger
        </motion.h1>

        {/* Subtitle — max contrast for readability */}
        <motion.p
          {...fadeUp(0.14)}
          className="text-[20px] sm:text-[22px] lg:text-[24px]
                     text-white/60 text-center font-light
                     max-w-[480px] leading-[1.45] tracking-[-0.015em]
                     mb-5"
        >
          The AI co-worker that verifies&nbsp;work against reality.
        </motion.p>

        {/* Supporting description */}
        <motion.p
          {...fadeUp(0.2)}
          className="text-[15px] text-[#4A5568] text-center
                     max-w-[400px] leading-[1.7] mb-14"
        >
          Upload today&apos;s standup notes or connect your GitHub&nbsp;repository
          to verify commitments using IBM&nbsp;Granite&nbsp;AI.
        </motion.p>

        {/* CTA group */}
        <motion.div
          {...fadeUp(0.26)}
          className="flex flex-col sm:flex-row items-center gap-3 mb-20"
          role="group"
          aria-label="Primary actions"
        >
          {/* Primary CTA */}
          <motion.button
            whileHover={{ boxShadow: '0 0 32px rgba(15,98,254,0.55)', scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            aria-label="Upload meeting notes"
            className="inline-flex items-center gap-2.5
                       h-[46px] px-7 text-[14px] font-semibold
                       bg-[#0F62FE] text-white
                       rounded-[9px] border border-[#1570FF]
                       hover:bg-[#0353E9] active:bg-[#024AD9]
                       transition-colors duration-150 cursor-pointer
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-white focus-visible:ring-offset-2
                       focus-visible:ring-offset-[#0F62FE]"
          >
            <Upload size={15} strokeWidth={2.2} aria-hidden />
            Upload Meeting Notes
          </motion.button>

          {/* Secondary CTA */}
          <motion.button
            whileHover={{ borderColor: 'rgba(255,255,255,0.2)', color: '#FFFFFF', scale: 1.015 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.18 }}
            aria-label="Connect GitHub repository"
            className="inline-flex items-center gap-2.5
                       h-[46px] px-7 text-[14px] font-medium
                       bg-white/[0.04] text-white/70
                       rounded-[9px] border border-white/[0.09]
                       hover:bg-white/[0.07]
                       transition-all duration-150 cursor-pointer
                       focus-visible:outline-none focus-visible:ring-2
                       focus-visible:ring-[#0F62FE] focus-visible:ring-offset-2
                       focus-visible:ring-offset-[#0B0F14]"
          >
            <GitBranch size={15} strokeWidth={2} aria-hidden />
            Connect GitHub Repository
          </motion.button>
        </motion.div>

        {/* Divider */}
        <motion.div
          {...fadeUp(0.32)}
          className="w-full max-w-[560px] flex items-center gap-5 mb-10"
          aria-hidden
        >
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.07] to-white/[0.07]" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#2D3748] shrink-0 leading-none">
            or drop a file below
          </span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-white/[0.07] to-white/[0.07]" />
        </motion.div>

        {/* Upload zone */}
        <motion.div
          {...fadeUp(0.38)}
          className="w-full max-w-[560px]"
        >
          <UploadZone files={files} onFiles={handleFiles} onRemove={removeFile} />
        </motion.div>

        {/* Analyse CTA — appears when files are queued */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.22 }}
              className="mt-3 w-full max-w-[560px]"
            >
              <motion.button
                whileHover={{ boxShadow: '0 0 32px rgba(15,98,254,0.55)' }}
                whileTap={{ scale: 0.985 }}
                aria-label={`Analyse ${files.length} file${files.length !== 1 ? 's' : ''} with Granite AI`}
                className="w-full inline-flex items-center justify-center gap-2.5
                           h-[46px] text-[14px] font-semibold
                           bg-[#0F62FE] text-white
                           rounded-[9px] border border-[#1570FF]
                           hover:bg-[#0353E9] transition-colors duration-150
                           cursor-pointer
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-white focus-visible:ring-offset-2
                           focus-visible:ring-offset-[#0F62FE]"
              >
                <Sparkles size={15} aria-hidden />
                Analyse {files.length} file{files.length !== 1 ? 's' : ''} with Granite AI
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ── Workflow ── */}
      <WorkflowSection />

      {/* ── Trust cards ── */}
      <TrustSection />

      {/* ── Footer ── */}
      <footer
        role="contentinfo"
        className="relative z-10 border-t border-white/[0.05]
                   px-6 sm:px-10 lg:px-14 py-6"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div
              aria-hidden
              className="w-[22px] h-[22px] rounded-[5px] bg-[#0F62FE] flex items-center justify-center
                         shadow-[0_0_10px_rgba(15,98,254,0.35)]"
            >
              <Zap size={10} className="text-white" fill="white" />
            </div>
            <span className="text-[13px] font-medium text-[#3A4255]">
              © 2026 Ledger, Inc.
            </span>
          </div>

          {/* Links */}
          <nav aria-label="Footer navigation" className="flex items-center gap-6">
            {['Privacy', 'Terms', 'Security', 'Docs', 'Status'].map((label) => (
              <a
                key={label}
                href="#"
                className="text-[12px] text-[#3A4255] hover:text-[#8A96A8]
                           transition-colors duration-150
                           focus-visible:outline-none focus-visible:ring-2
                           focus-visible:ring-[#0F62FE] rounded"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}
