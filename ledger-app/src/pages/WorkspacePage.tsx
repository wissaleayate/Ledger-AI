import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, GitCommit, GitPullRequest, GitMerge,
  Clock, Tag, CheckCircle2, AlertTriangle, XCircle,
  Brain, Calendar, RefreshCw, Activity, GitBranch,
  User, ShieldCheck, AlertCircle, Info, CircleDot,
  Layers, Cpu, ArrowRight, ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { Container } from '@/components/layout/Container'
import type { Commitment, GitEvidence, GraniteAnalysis, CommitmentStatus } from '@/types/ledger'

// ── Mock data ──────────────────────────────────────────────────────────────────
const COMMITMENTS: Commitment[] = [
  {
    id: 'c1',
    owner: 'Sarah Chen',
    task: 'Ship the new authentication flow to staging',
    deadline: 'Jul 31',
    status: 'at-risk',
    priority: 'critical',
    confidence: 92,
  },
  {
    id: 'c2',
    owner: 'Marcus Rivera',
    task: 'Complete Q3 product roadmap documentation',
    deadline: 'Aug 2',
    status: 'on-track',
    priority: 'high',
    confidence: 88,
  },
  {
    id: 'c3',
    owner: 'Jordan Blake',
    task: 'Migrate legacy API endpoints to GraphQL',
    deadline: 'Aug 5',
    status: 'blocked',
    priority: 'critical',
    confidence: 95,
  },
  {
    id: 'c4',
    owner: 'Priya Nair',
    task: 'Deliver final design specs for onboarding v2',
    deadline: 'Aug 1',
    status: 'completed',
    priority: 'high',
    confidence: 97,
  },
  {
    id: 'c5',
    owner: 'Amara Osei',
    task: 'Deploy real-time analytics pipeline to production',
    deadline: 'Aug 7',
    status: 'at-risk',
    priority: 'high',
    confidence: 84,
  },
]

interface GitEvidenceExtended extends GitEvidence {
  branchName: string
  timelineEvents: { time: string; label: string; type: 'commit' | 'pr' | 'merge' | 'review' }[]
}

const GIT_EVIDENCE: Record<string, GitEvidenceExtended> = {
  c1: {
    commitmentId: 'c1',
    commits: 3,
    pullRequests: 1,
    lastActivity: '6 hours ago',
    matchedKeywords: ['auth', 'staging', 'OAuth'],
    timeline: 'Active — last commit 6h ago',
    branchName: 'feature/auth-flow-oauth',
    verificationConfidence: 71,
    timelineEvents: [
      { time: '09:20', label: 'Commit pushed — OAuth handler scaffold', type: 'commit' },
      { time: '10:15', label: 'Pull Request opened', type: 'pr' },
      { time: '14:40', label: 'Review requested from Jordan', type: 'review' },
    ],
  },
  c2: {
    commitmentId: 'c2',
    commits: 7,
    pullRequests: 2,
    lastActivity: '2 hours ago',
    matchedKeywords: ['roadmap', 'Q3', 'docs', 'product'],
    timeline: 'Strong activity — PR under review',
    branchName: 'docs/q3-roadmap-update',
    verificationConfidence: 89,
    timelineEvents: [
      { time: '08:10', label: 'Initial roadmap draft committed', type: 'commit' },
      { time: '11:00', label: 'PR opened for review', type: 'pr' },
      { time: '13:22', label: 'Milestone sections merged', type: 'merge' },
      { time: '14:50', label: 'Final revisions committed', type: 'commit' },
    ],
  },
  c3: {
    commitmentId: 'c3',
    commits: 0,
    pullRequests: 0,
    lastActivity: '9 days ago',
    matchedKeywords: ['api'],
    timeline: 'Stalled — no commits in 9 days',
    branchName: 'feature/graphql-migration',
    verificationConfidence: 18,
    timelineEvents: [
      { time: '9d ago', label: 'Last commit — unrelated hotfix', type: 'commit' },
    ],
  },
  c4: {
    commitmentId: 'c4',
    commits: 12,
    pullRequests: 3,
    lastActivity: '1 hour ago',
    matchedKeywords: ['onboarding', 'design', 'specs', 'v2'],
    timeline: 'Complete — merged 3 PRs',
    branchName: 'design/onboarding-v2-specs',
    verificationConfidence: 97,
    timelineEvents: [
      { time: '08:30', label: 'Design tokens committed', type: 'commit' },
      { time: '10:05', label: 'PR #1 merged — wireframes', type: 'merge' },
      { time: '11:30', label: 'PR #2 merged — component specs', type: 'merge' },
      { time: '13:45', label: 'PR #3 merged — final review', type: 'merge' },
    ],
  },
  c5: {
    commitmentId: 'c5',
    commits: 4,
    pullRequests: 1,
    lastActivity: '18 hours ago',
    matchedKeywords: ['analytics', 'pipeline', 'streaming'],
    timeline: 'Moderate — deployment blocked by infra',
    branchName: 'feature/realtime-analytics-pipeline',
    verificationConfidence: 58,
    timelineEvents: [
      { time: '07:45', label: 'Kafka connector committed', type: 'commit' },
      { time: '09:30', label: 'PR opened for staging deploy', type: 'pr' },
      { time: '12:10', label: 'Staging deployment blocked', type: 'review' },
    ],
  },
}

interface GraniteAnalysisExtended extends GraniteAnalysis {
  suggestedOwner: string
  evidenceFound: string[]
  missingEvidence: string[]
  dependencies: string[]
  riskExplanation: string
}

const GRANITE_ANALYSIS: Record<string, GraniteAnalysisExtended> = {
  c1: {
    commitmentId: 'c1',
    status: 'at-risk',
    reason: 'Auth flow is partially implemented. OAuth callback handler is incomplete per commit history.',
    potentialRisk: 'Deadline slip of 2–3 days without immediate unblocking action.',
    recoveryRecommendation: 'Pair Sarah with Jordan to complete the callback handler today.',
    nextCheck: 'Tomorrow, 09:00',
    suggestedOwner: 'Jordan Blake',
    confidence: 87,
    reasoning: 'Based on 3 commits touching authentication modules, none covering the callback handler identified in the PR description.',
    evidenceFound: ['3 commits in feature/auth-flow-oauth', 'PR #142 opened', 'OAuth keyword matched'],
    missingEvidence: ['Callback handler implementation', 'Staging environment confirmation', 'Test coverage for auth edge cases'],
    dependencies: ['API Gateway config', 'SSO provider credentials'],
    riskExplanation: 'The missing callback handler is a critical blocker. Without it, the auth flow cannot complete. 6 hours remain before the deadline.',
  },
  c2: {
    commitmentId: 'c2',
    status: 'on-track',
    reason: 'Roadmap doc is 85% complete. 7 commits and active PR review.',
    potentialRisk: 'Low. Reviewer availability is the only potential delay.',
    recoveryRecommendation: 'No recovery needed. Ensure reviewer availability on Aug 1.',
    nextCheck: 'Aug 2, end of day',
    suggestedOwner: 'Marcus Rivera',
    confidence: 91,
    evidenceFound: ['7 commits in docs/q3-roadmap-update', '2 PRs opened', 'Roadmap and Q3 keywords matched', 'PR under active review'],
    missingEvidence: ['Final sign-off from stakeholders'],
    dependencies: ['Stakeholder review availability'],
    riskExplanation: 'All evidence points to on-track delivery. The only risk is reviewer scheduling.',
  },
  c3: {
    commitmentId: 'c3',
    status: 'blocked',
    reason: 'Zero commits in 9 days. No PR opened. GraphQL schema not started.',
    potentialRisk: 'High likelihood of missing deadline. Dependency on API gateway team.',
    recoveryRecommendation: 'Escalate to API gateway team immediately. Consider reassigning to Amara Osei.',
    nextCheck: 'Today, 14:00',
    suggestedOwner: 'Amara Osei',
    confidence: 95,
    reasoning: 'Repository shows no activity in graphql/ directory for 9 days. The API gateway dependency mentioned in Slack remains unresolved.',
    evidenceFound: ['Branch feature/graphql-migration exists', 'API keyword loosely matched'],
    missingEvidence: ['GraphQL schema definition', 'Any commits in graphql/ directory', 'API gateway dependency resolved', 'PR opened'],
    dependencies: ['API Gateway team unblocking', 'GraphQL schema design approval', 'Legacy endpoint audit'],
    riskExplanation: 'With zero commits in 9 days and a hard deadline in 4 days, this commitment is effectively blocked. The API gateway dependency has not been addressed.',
  },
  c4: {
    commitmentId: 'c4',
    status: 'completed',
    reason: 'All design specs delivered and merged. 3 PRs closed with full approvals.',
    potentialRisk: 'None.',
    recoveryRecommendation: 'No action needed. Mark as complete.',
    nextCheck: 'N/A',
    suggestedOwner: 'Priya Nair',
    confidence: 97,
    evidenceFound: ['12 commits in design/onboarding-v2-specs', '3 PRs merged with approvals', 'All keywords matched', 'Design and specs files confirmed'],
    missingEvidence: [],
    dependencies: [],
    riskExplanation: 'No risk. Commitment is fully complete with strong evidence across all verification signals.',
  },
  c5: {
    commitmentId: 'c5',
    status: 'at-risk',
    reason: 'Pipeline deployed to staging but prod deployment blocked by infra provisioning.',
    potentialRisk: 'Moderate. Infrastructure team needs 2 days to complete provisioning.',
    recoveryRecommendation: 'Pre-provision resources today. Consider a phased rollout to unblock deadline.',
    nextCheck: 'Tomorrow, 10:00',
    suggestedOwner: 'Amara Osei',
    confidence: 82,
    evidenceFound: ['4 commits in feature/realtime-analytics-pipeline', 'Staging deployment confirmed', 'Pipeline keywords matched'],
    missingEvidence: ['Production infrastructure provisioned', 'Prod deployment confirmation'],
    dependencies: ['Infrastructure team provisioning', 'Kafka cluster capacity increase'],
    riskExplanation: 'Staging is complete but production requires infrastructure that is not yet provisioned. A 2-day delay from the infra team creates risk against the Aug 7 deadline.',
  },
}

// ── Design tokens ──────────────────────────────────────────────────────────────
const STATUS_MAP = {
  'on-track':  { color: '#24A148', bg: 'rgba(36,161,72,0.10)',   border: 'rgba(36,161,72,0.22)',   label: 'On Track',  Icon: CheckCircle2  },
  'at-risk':   { color: '#F1C21B', bg: 'rgba(241,194,27,0.10)',  border: 'rgba(241,194,27,0.22)',  label: 'At Risk',   Icon: AlertTriangle  },
  'blocked':   { color: '#DA1E28', bg: 'rgba(218,30,40,0.10)',   border: 'rgba(218,30,40,0.22)',   label: 'Blocked',   Icon: XCircle        },
  'completed': { color: '#4589FF', bg: 'rgba(69,137,255,0.10)',  border: 'rgba(69,137,255,0.22)',  label: 'Verified',  Icon: CheckCircle2   },
}

const PRIORITY_MAP = {
  critical: { color: '#DA1E28', label: 'Critical' },
  high:     { color: '#F1C21B', label: 'High'     },
  medium:   { color: '#0F62FE', label: 'Medium'   },
  low:      { color: '#5A6478', label: 'Low'      },
}

const TIMELINE_EVENT_MAP = {
  commit: { color: '#0F62FE', Icon: GitCommit      },
  pr:     { color: '#8A3FFC', Icon: GitPullRequest  },
  merge:  { color: '#24A148', Icon: GitMerge        },
  review: { color: '#F1C21B', Icon: AlertCircle     },
}

// ── Design primitives ──────────────────────────────────────────────────────────

/** All-caps label for section headers inside cards */
function FieldLabel({ children, color = '#616E85' }: { children: React.ReactNode; color?: string }) {
  return (
    <p
      className="text-[10px] font-semibold tracking-widest uppercase"
      style={{ color }}
    >
      {children}
    </p>
  )
}

function StatusBadge({ status }: { status: CommitmentStatus }) {
  const { color, bg, border, label, Icon } = STATUS_MAP[status]
  return (
    <span
      className="inline-flex items-center gap-[5px] px-2.5 py-[5px] text-[11px] font-semibold rounded-md tracking-wide leading-none whitespace-nowrap"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      <Icon size={10} strokeWidth={2.5} />
      {label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: string }) {
  const cfg = PRIORITY_MAP[priority as keyof typeof PRIORITY_MAP] ?? PRIORITY_MAP.low
  return (
    <span
      className="inline-flex items-center px-2 py-[3px] text-[9.5px] font-bold tracking-widest uppercase rounded leading-none border"
      style={{
        color: cfg.color,
        borderColor: `${cfg.color}2e`,
        background: `${cfg.color}0e`,
      }}
    >
      {cfg.label}
    </span>
  )
}

function ConfidenceBar({
  value,
  color = '#0F62FE',
  label,
}: {
  value: number
  color?: string
  label?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      {label && <FieldLabel>{label}</FieldLabel>}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-[3px] bg-[#1A2130] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            style={{ background: color }}
          />
        </div>
        <span
          className="text-[11px] font-mono tabular-nums shrink-0 w-8 text-right"
          style={{ color }}
        >
          {value}%
        </span>
      </div>
    </div>
  )
}

function SectionDivider() {
  return <div className="h-px bg-[rgba(255,255,255,0.055)]" />
}

/** Standard inner card — surface used throughout evidence and analysis panels */
function InnerCard({
  children,
  accent,
  accentColor,
  className,
}: {
  children: React.ReactNode
  accent?: boolean
  accentColor?: string
  className?: string
}) {
  const baseStyle = accent && accentColor
    ? { background: `${accentColor}08`, borderColor: `${accentColor}28` }
    : { background: 'rgba(255,255,255,0.028)', borderColor: 'rgba(255,255,255,0.07)' }

  return (
    <div
      className={cn('p-5 rounded-xl border', className)}
      style={baseStyle}
    >
      {children}
    </div>
  )
}

function ColHeader({
  icon: Icon,
  label,
  sub,
  iconColor = '#0F62FE',
  iconBg = 'rgba(15,98,254,0.10)',
  iconBorder = 'rgba(15,98,254,0.22)',
}: {
  icon: React.ElementType
  label: string
  sub: string
  iconColor?: string
  iconBg?: string
  iconBorder?: string
}) {
  return (
    <div className="flex items-center gap-4 px-6 py-5 border-b border-[rgba(255,255,255,0.07)] shrink-0">
      <div
        className="w-9 h-9 rounded-[10px] flex items-center justify-center shrink-0"
        style={{ background: iconBg, border: `1px solid ${iconBorder}` }}
      >
        <Icon size={15} style={{ color: iconColor }} />
      </div>
      <div className="min-w-0">
        <p className="text-[13.5px] font-semibold text-white leading-tight tracking-tight">{label}</p>
        <p className="text-[11px] text-[#4E5A6E] mt-[3px] leading-none">{sub}</p>
      </div>
    </div>
  )
}

function EmptyState({
  icon: Icon,
  message,
  color = '#2A3347',
}: {
  icon: React.ElementType
  message: string
  color?: string
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center px-10 py-16">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
        style={{ background: `${color}1a`, border: `1px solid ${color}33` }}
      >
        <Icon size={17} style={{ color }} />
      </div>
      <p className="text-[12px] text-[#2E3A4A] leading-relaxed max-w-[180px]">{message}</p>
    </div>
  )
}

// ── GitHub SVG icon ────────────────────────────────────────────────────────────
function GithubIcon({ size = 14, color = '#616E85' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}

// ── Context bar (below TopNav) ─────────────────────────────────────────────────
function WorkspaceTopBar() {
  const pills = [
    { icon: <GithubIcon size={11} color="#4589FF" />, label: 'Repository', value: 'ledger-ai/core',  color: '#4589FF' },
    { icon: <Layers    size={11} />,                  label: 'Sprint',      value: 'Q3 · Sprint 6',  color: '#8E99A8' },
    { icon: <RefreshCw size={11} />,                  label: 'Last Sync',   value: '2 min ago',       color: '#8E99A8' },
    { icon: <Activity  size={11} />,                  label: 'Team Health', value: '74%',             color: '#F1C21B' },
  ]

  return (
    <div className="border-b border-[rgba(255,255,255,0.06)] bg-[#0C1018] overflow-x-auto">
      <Container size="wide" className="h-[52px] flex items-center justify-between gap-4 min-w-0">

        {/* Context pills — scrollable on mobile */}
        <div className="flex items-center gap-2 shrink-0">
          {pills.map(({ icon, label, value, color }) => (
            <div
              key={label}
              className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1.5 rounded-lg border shrink-0"
              style={{
                background: 'rgba(255,255,255,0.028)',
                borderColor: 'rgba(255,255,255,0.07)',
              }}
            >
              <span className="text-[#4E5A6E] flex items-center">{icon}</span>
              <span className="text-[11px] text-[#4E5A6E] hidden sm:inline">{label}</span>
              <span
                className="text-[11px] font-medium"
                style={{ color }}
              >
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Live status */}
        <div
          className="flex items-center gap-2 px-2 md:px-3 py-1.5 rounded-lg border shrink-0"
          style={{
            background: 'rgba(36,161,72,0.06)',
            borderColor: 'rgba(36,161,72,0.18)',
          }}
        >
          <span className="w-[5px] h-[5px] bg-[#24A148] rounded-full animate-pulse" />
          <span className="text-[11px] text-[#24A148] font-medium hidden sm:inline">Live verification</span>
          <span className="text-[11px] text-[#24A148] font-medium sm:hidden">Live</span>
        </div>

      </Container>
    </div>
  )
}

// ── Bottom pipeline timeline ───────────────────────────────────────────────────
function WorkspaceTimeline() {
  const steps = [
    { icon: Cpu,         label: 'Meeting Uploaded',    time: '09:00', done: true },
    { icon: Brain,       label: 'Granite Extraction',  time: '09:03', done: true },
    { icon: GithubIcon,  label: 'GitHub Verification', time: '09:07', done: true },
    { icon: Activity,    label: 'Health Score',        time: '09:08', done: true },
    { icon: ShieldCheck, label: 'Recovery Generated',  time: '09:09', done: true },
  ]

  return (
    <div className="border-t border-[rgba(255,255,255,0.06)] bg-[#0C1018]">
      <Container size="wide" className="py-5">
        <div className="flex items-center">
          {steps.map((step, i) => {
            const Icon = step.icon
            const isLast = i === steps.length - 1
            return (
              <div key={step.label} className="flex items-center flex-1 min-w-0">

                {/* Step */}
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div
                    className="w-7 h-7 rounded-[8px] flex items-center justify-center shrink-0"
                    style={{
                      background: step.done ? 'rgba(15,98,254,0.12)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${step.done ? 'rgba(15,98,254,0.28)' : 'rgba(255,255,255,0.07)'}`,
                    }}
                  >
                    <Icon size={12} color={step.done ? '#4589FF' : '#2E3A4A'} />
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <p
                      className="text-[11px] font-medium leading-tight truncate"
                      style={{ color: step.done ? '#9AA5B4' : '#2E3A4A' }}
                    >
                      {step.label}
                    </p>
                    <p
                      className="text-[10px] font-mono mt-0.5"
                      style={{ color: step.done ? '#4E5A6E' : '#212A38' }}
                    >
                      {step.time}
                    </p>
                  </div>
                </div>

                {/* Connector */}
                {!isLast && (
                  <ChevronRight size={11} className="mx-2 shrink-0 text-[#232D3B]" />
                )}
              </div>
            )
          })}
        </div>
      </Container>
    </div>
  )
}

// ── Left column: Commitments ───────────────────────────────────────────────────
function CommitmentsColumn({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div className="flex flex-col h-full overflow-hidden min-h-[300px]">
      <ColHeader
        icon={CircleDot}
        label="Commitments"
        sub="Today's extracted commitments"
        iconColor="#0F62FE"
        iconBg="rgba(15,98,254,0.10)"
        iconBorder="rgba(15,98,254,0.22)"
      />

      <div className="flex-1 overflow-y-auto px-3 md:px-4 py-4 flex flex-col gap-2.5">
        {COMMITMENTS.map((c, i) => {
          const isSelected = selected === c.id
          return (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.055, duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => onSelect(c.id)}
              whileHover={!isSelected ? { y: -2, transition: { duration: 0.18 } } : {}}
              className={cn(
                'group w-full text-left rounded-xl border transition-all duration-200 relative overflow-hidden',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F62FE] focus-visible:ring-offset-1 focus-visible:ring-offset-[#111720]',
                isSelected
                  ? 'bg-[rgba(15,98,254,0.065)] border-[rgba(15,98,254,0.32)]'
                  : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.07)]'
              )}
              style={
                isSelected
                  ? { boxShadow: '0 0 0 1px rgba(15,98,254,0.22), 0 8px 28px rgba(15,98,254,0.10)' }
                  : { boxShadow: '0 1px 3px rgba(0,0,0,0.25)' }
              }
            >
              {/* Hover overlay */}
              {!isSelected && (
                <div className="absolute inset-0 bg-[rgba(255,255,255,0.015)] opacity-0 group-hover:opacity-100 transition-opacity duration-150 pointer-events-none rounded-xl" />
              )}

              {/* Left selection rail */}
              <motion.div
                className="absolute left-0 top-3 bottom-3 w-[2px] rounded-r-full"
                animate={{
                  opacity: isSelected ? 1 : 0,
                  background: isSelected ? '#0F62FE' : 'transparent',
                }}
                transition={{ duration: 0.18 }}
              />

              <div className="px-5 py-5">
                {/* Row 1 — Owner + Status */}
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={c.owner} size="sm" showStatus status="online" />
                    <span className="text-[12px] text-[#7A8799] font-medium truncate leading-tight">
                      {c.owner}
                    </span>
                  </div>
                  <StatusBadge status={c.status} />
                </div>

                {/* Row 2 — Task title (primary content) */}
                <p
                  className="text-[13.5px] leading-[1.55] mb-4 font-normal"
                  style={{ color: isSelected ? '#E4E8EF' : '#C2CAD6' }}
                >
                  {c.task}
                </p>

                {/* Row 3 — Deadline + Priority */}
                <div className="flex items-center gap-2.5 mb-3.5">
                  <div className="flex items-center gap-1.5">
                    <Calendar size={10} className="text-[#4E5A6E]" strokeWidth={1.5} />
                    <span className="text-[11px] text-[#4E5A6E]">{c.deadline}</span>
                  </div>
                  <span className="text-[#2A3347]">·</span>
                  <PriorityBadge priority={c.priority} />
                </div>

                {/* Row 4 — Confidence */}
                <ConfidenceBar
                  value={c.confidence}
                  color={isSelected ? '#4589FF' : '#1F5FD6'}
                />
              </div>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}

// ── Center column: GitHub Evidence ────────────────────────────────────────────
function EvidenceColumn({ selectedId }: { selectedId: string | null }) {
  const ev = selectedId ? GIT_EVIDENCE[selectedId] : null

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ColHeader
        icon={({ size, style }: { size: number; style: React.CSSProperties }) => (
          <span style={style}>
            <GithubIcon size={size} color={style.color as string} />
          </span>
        )}
        label="GitHub Evidence"
        sub="Verified against repository activity"
        iconColor="#9AA5B4"
        iconBg="rgba(255,255,255,0.05)"
        iconBorder="rgba(255,255,255,0.09)"
      />

      <div className="flex-1 overflow-y-auto">
        {!ev ? (
          <EmptyState
            icon={ShieldCheck}
            message="Select a commitment to view the GitHub evidence"
            color="#1F3A5A"
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="px-4 py-4 flex flex-col gap-3"
            >

              {/* ── Stat row ── */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: GitCommit,      label: 'Commits',      value: ev.commits      },
                  { icon: GitPullRequest, label: 'Pull Requests', value: ev.pullRequests },
                ].map(({ icon: Icon, label, value }) => (
                  <InnerCard key={label}>
                    <div className="flex items-center gap-1.5 mb-3">
                      <Icon size={11} className="text-[#4E5A6E]" strokeWidth={1.5} />
                      <FieldLabel>{label}</FieldLabel>
                    </div>
                    <p className="text-[30px] font-light text-white leading-none tabular-nums">
                      {value}
                    </p>
                  </InnerCard>
                ))}
              </div>

              {/* ── Branch + Last Activity ── */}
              <InnerCard>
                <div className="flex flex-col gap-4">
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <GitBranch size={11} className="text-[#4E5A6E]" strokeWidth={1.5} />
                      <FieldLabel>Branch</FieldLabel>
                    </div>
                    <p className="text-[12px] font-mono text-[#4589FF] leading-snug break-all">
                      {ev.branchName}
                    </p>
                  </div>

                  <SectionDivider />

                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Clock size={11} className="text-[#4E5A6E]" strokeWidth={1.5} />
                      <FieldLabel>Last Activity</FieldLabel>
                    </div>
                    <p className="text-[13px] text-[#D0D6DE] font-medium">{ev.lastActivity}</p>
                    <p className="text-[11.5px] text-[#4E5A6E] mt-1.5 leading-snug">{ev.timeline}</p>
                  </div>
                </div>
              </InnerCard>

              {/* ── Activity Timeline ── */}
              <InnerCard>
                <div className="flex items-center gap-1.5 mb-4">
                  <Activity size={11} className="text-[#4E5A6E]" strokeWidth={1.5} />
                  <FieldLabel>Activity Timeline</FieldLabel>
                </div>

                <div className="flex flex-col">
                  {ev.timelineEvents.map((event, i) => {
                    const cfg = TIMELINE_EVENT_MAP[event.type]
                    const isLast = i === ev.timelineEvents.length - 1
                    return (
                      <div key={i} className="flex gap-3">
                        {/* Track */}
                        <div className="flex flex-col items-center w-5 shrink-0">
                          <div
                            className="w-[18px] h-[18px] rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{
                              background: `${cfg.color}15`,
                              border: `1px solid ${cfg.color}40`,
                            }}
                          >
                            <cfg.Icon size={8} style={{ color: cfg.color }} strokeWidth={2.5} />
                          </div>
                          {!isLast && (
                            <div
                              className="w-px flex-1 mt-[3px] mb-[3px]"
                              style={{ background: 'rgba(255,255,255,0.06)' }}
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className={cn('min-w-0', isLast ? 'pb-0' : 'pb-[14px]')}>
                          <span
                            className="text-[10px] font-mono font-semibold"
                            style={{ color: cfg.color }}
                          >
                            {event.time}
                          </span>
                          <p className="text-[12px] text-[#8E99A8] leading-snug mt-0.5">
                            {event.label}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </InnerCard>

              {/* ── Matched Keywords ── */}
              <InnerCard>
                <div className="flex items-center gap-1.5 mb-3">
                  <Tag size={11} className="text-[#4E5A6E]" strokeWidth={1.5} />
                  <FieldLabel>Matched Keywords</FieldLabel>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ev.matchedKeywords.map((kw) => (
                    <span
                      key={kw}
                      className="px-2.5 py-[5px] text-[11px] font-mono rounded-lg leading-none"
                      style={{
                        background: 'rgba(15,98,254,0.09)',
                        border: '1px solid rgba(15,98,254,0.2)',
                        color: '#4589FF',
                      }}
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </InnerCard>

              {/* ── Verification Confidence ── */}
              <InnerCard>
                <ConfidenceBar
                  value={ev.verificationConfidence}
                  label="Verification Confidence"
                  color={
                    ev.verificationConfidence > 75 ? '#24A148'
                    : ev.verificationConfidence > 45 ? '#F1C21B'
                    : '#DA1E28'
                  }
                />
              </InnerCard>

            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

// ── Right column: Granite Analysis ────────────────────────────────────────────
function GraniteColumn({ selectedId }: { selectedId: string | null }) {
  const [expanded, setExpanded] = useState(false)
  const analysis = selectedId ? GRANITE_ANALYSIS[selectedId] : null

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <ColHeader
        icon={Brain}
        label="IBM Granite Assessment"
        sub="Enterprise AI review"
        iconColor="#8A3FFC"
        iconBg="rgba(138,63,252,0.10)"
        iconBorder="rgba(138,63,252,0.22)"
      />

      <div className="flex-1 overflow-y-auto">
        {!analysis ? (
          <EmptyState
            icon={Brain}
            message="Select a commitment to view the AI assessment"
            color="#3A1F6B"
          />
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="px-4 py-4 flex flex-col gap-3"
            >

              {/* ── Status header card ── */}
              <InnerCard accent accentColor="#8A3FFC">
                <div className="flex items-center justify-between mb-3.5">
                  <StatusBadge status={analysis.status} />
                  <div className="flex items-center gap-1.5">
                    <Brain size={11} className="text-[#8A3FFC]" strokeWidth={1.5} />
                    <span className="text-[11px] font-mono text-[#8A3FFC]">
                      {analysis.confidence}% confidence
                    </span>
                  </div>
                </div>
                <ConfidenceBar value={analysis.confidence} color="#8A3FFC" />
              </InnerCard>

              {/* ── Assessment rows ── */}
              {[
                { label: 'Current Status',          value: analysis.reason,                 icon: Info,          accent: false },
                { label: 'Potential Risk',           value: analysis.potentialRisk,          icon: AlertTriangle, accent: false },
                { label: 'Recovery Recommendation',  value: analysis.recoveryRecommendation, icon: ArrowRight,    accent: true  },
              ].map(({ label, value, icon: Icon, accent }) => (
                <InnerCard key={label} accent={accent} accentColor={accent ? '#0F62FE' : undefined}>
                  <div className="flex items-center gap-1.5 mb-2.5">
                    <Icon
                      size={11}
                      strokeWidth={1.5}
                      style={{ color: accent ? '#4589FF' : '#4E5A6E' }}
                    />
                    <FieldLabel color={accent ? '#4589FF' : '#4E5A6E'}>{label}</FieldLabel>
                  </div>
                  <p
                    className="text-[13px] leading-relaxed"
                    style={{ color: accent ? '#D0D6DE' : '#8E99A8' }}
                  >
                    {value}
                  </p>
                </InnerCard>
              ))}

              {/* ── Suggested Owner + Next Check ── */}
              <div className="grid grid-cols-2 gap-3">
                <InnerCard>
                  <div className="flex items-center gap-1.5 mb-3">
                    <User size={10} className="text-[#4E5A6E]" strokeWidth={1.5} />
                    <FieldLabel>Suggested Owner</FieldLabel>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Avatar name={analysis.suggestedOwner} size="xs" />
                    <span className="text-[12px] text-[#C2CAD6] font-medium truncate">
                      {analysis.suggestedOwner.split(' ')[0]}
                    </span>
                  </div>
                </InnerCard>

                <InnerCard>
                  <div className="flex items-center gap-1.5 mb-3">
                    <Clock size={10} className="text-[#4E5A6E]" strokeWidth={1.5} />
                    <FieldLabel>Next Check</FieldLabel>
                  </div>
                  <p className="text-[12px] text-[#C2CAD6] font-medium leading-snug">
                    {analysis.nextCheck}
                  </p>
                </InnerCard>
              </div>

              {/* ── Why this assessment? (expandable) ── */}
              <div
                className="rounded-xl border overflow-hidden"
                style={{
                  background: 'rgba(138,63,252,0.04)',
                  borderColor: 'rgba(138,63,252,0.18)',
                }}
              >
                {/* Trigger */}
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="group w-full flex items-center justify-between px-5 py-4 transition-colors duration-150 hover:bg-[rgba(138,63,252,0.05)]"
                >
                  <div className="flex items-center gap-2">
                    <Brain size={11} className="text-[#8A3FFC]" strokeWidth={1.5} />
                    <span className="text-[12px] text-[#8A3FFC] font-semibold tracking-wide">
                      Why this assessment?
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: expanded ? 180 : 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                  >
                    <ChevronDown size={13} className="text-[#8A3FFC]" />
                  </motion.div>
                </button>

                {/* Expandable body */}
                <AnimatePresence initial={false}>
                  {expanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-[rgba(138,63,252,0.14)] px-5 pt-4 pb-5 flex flex-col gap-4">

                        {/* Evidence Found */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <CheckCircle2 size={10} className="text-[#24A148]" strokeWidth={2.5} />
                            <FieldLabel color="#24A148">Evidence Found</FieldLabel>
                          </div>
                          <ul className="flex flex-col gap-1.5">
                            {analysis.evidenceFound.length === 0
                              ? <li className="text-[11px] text-[#2E3A4A]">No evidence found</li>
                              : analysis.evidenceFound.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-[5px] h-[5px] rounded-full bg-[#24A148] mt-[5px] shrink-0" />
                                  <span className="text-[11.5px] text-[#8E99A8] leading-snug">{item}</span>
                                </li>
                              ))
                            }
                          </ul>
                        </div>

                        <SectionDivider />

                        {/* Missing Evidence */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <XCircle size={10} className="text-[#DA1E28]" strokeWidth={2.5} />
                            <FieldLabel color="#DA1E28">Missing Evidence</FieldLabel>
                          </div>
                          <ul className="flex flex-col gap-1.5">
                            {analysis.missingEvidence.length === 0
                              ? <li className="text-[11px] text-[#24A148]">Nothing missing</li>
                              : analysis.missingEvidence.map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                  <span className="w-[5px] h-[5px] rounded-full bg-[#DA1E28] mt-[5px] shrink-0" />
                                  <span className="text-[11.5px] text-[#8E99A8] leading-snug">{item}</span>
                                </li>
                              ))
                            }
                          </ul>
                        </div>

                        {analysis.dependencies.length > 0 && (
                          <>
                            <SectionDivider />
                            <div>
                              <div className="flex items-center gap-1.5 mb-2.5">
                                <Layers size={10} className="text-[#F1C21B]" strokeWidth={1.5} />
                                <FieldLabel color="#F1C21B">Dependencies</FieldLabel>
                              </div>
                              <ul className="flex flex-col gap-1.5">
                                {analysis.dependencies.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <span className="w-[5px] h-[5px] rounded-full bg-[#F1C21B] mt-[5px] shrink-0" />
                                    <span className="text-[11.5px] text-[#8E99A8] leading-snug">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </>
                        )}

                        <SectionDivider />

                        {/* Risk Explanation */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-2.5">
                            <AlertTriangle size={10} className="text-[#8A3FFC]" strokeWidth={1.5} />
                            <FieldLabel color="#8A3FFC">Risk Explanation</FieldLabel>
                          </div>
                          <p className="text-[11.5px] text-[#8E99A8] leading-relaxed">
                            {analysis.riskExplanation}
                          </p>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}

// ── Main workspace page ────────────────────────────────────────────────────────
export function WorkspacePage() {
  const [selected, setSelected] = useState<string | null>(COMMITMENTS[0].id)

  const stats = {
    total:     COMMITMENTS.length,
    onTrack:   COMMITMENTS.filter((c) => c.status === 'on-track').length,
    atRisk:    COMMITMENTS.filter((c) => c.status === 'at-risk').length,
    blocked:   COMMITMENTS.filter((c) => c.status === 'blocked').length,
    completed: COMMITMENTS.filter((c) => c.status === 'completed').length,
  }

  return (
    <div className="min-h-screen bg-[#090D12] flex flex-col">

      {/* Context bar */}
      <WorkspaceTopBar />

      {/* Page header */}
      <div className="border-b border-[rgba(255,255,255,0.07)]">
        <Container size="wide" className="py-4 md:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 md:gap-6">

          <div>
            <h1 className="text-[20px] md:text-[22px] font-light text-white tracking-tight leading-tight">
              Workspace
            </h1>
            <p className="text-[12px] text-[#4E5A6E] mt-1.5 leading-none">
              Commitments extracted from standup · verified against GitHub
            </p>
          </div>

          {/* Summary pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { label: 'Total',    value: stats.total,     color: '#8E99A8' },
              { label: 'On Track', value: stats.onTrack,   color: '#24A148' },
              { label: 'At Risk',  value: stats.atRisk,    color: '#F1C21B' },
              { label: 'Blocked',  value: stats.blocked,   color: '#DA1E28' },
              { label: 'Verified', value: stats.completed, color: '#4589FF' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center gap-2 px-2.5 md:px-3 py-[7px] rounded-lg border"
                style={{
                  background: 'rgba(255,255,255,0.028)',
                  borderColor: 'rgba(255,255,255,0.07)',
                }}
              >
                <span
                  className="w-[5px] h-[5px] rounded-full shrink-0"
                  style={{ background: color }}
                />
                <span className="text-[11px] text-[#4E5A6E] hidden sm:inline">{label}</span>
                <span
                  className="text-[11px] font-semibold font-mono tabular-nums"
                  style={{ color }}
                >
                  {value}
                </span>
              </div>
            ))}
          </div>

        </Container>
      </div>

      {/* Three-column workspace */}
      <Container size="wide" className="flex-1 py-4 md:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[30%_1fr_1fr] gap-4 min-h-[500px] lg:min-h-[600px] lg:h-[calc(100vh-var(--spacing-topnav)-52px-56px-60px)]">
          {/* Left — Commitments */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden flex flex-col"
            style={{ background: '#0F1621' }}
          >
            <CommitmentsColumn selected={selected} onSelect={setSelected} />
          </motion.div>

          {/* Center — Evidence */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.07, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden flex flex-col"
            style={{ background: '#0F1621' }}
          >
            <EvidenceColumn selectedId={selected} />
          </motion.div>

          {/* Right — Granite */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl border border-[rgba(255,255,255,0.08)] overflow-hidden flex flex-col"
            style={{ background: '#0F1621' }}
          >
            <GraniteColumn selectedId={selected} />
          </motion.div>
        </div>
      </Container>

      {/* Pipeline timeline */}
      <WorkspaceTimeline />

    </div>
  )
}
