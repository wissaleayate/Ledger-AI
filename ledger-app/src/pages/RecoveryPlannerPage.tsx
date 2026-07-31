import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronDown, AlertTriangle, Brain, GitBranch, Clock,
  User, CheckCircle2, XCircle, Shield, Zap, ArrowRight,
  Activity, GitCommit, Search, Layers, BarChart2,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/Avatar'
import { Container } from '@/components/layout/Container'
import type { CommitmentStatus, Priority } from '@/types/ledger'

// ── Types ──────────────────────────────────────────────────────────────────────

interface RecoveryTask {
  id: string
  taskName: string
  owner: string
  priority: Priority
  riskLevel: 'critical' | 'high' | 'medium'
  currentStatus: CommitmentStatus
  daysWithoutActivity: number
  dependencies: string[]
  githubVerified: boolean
  githubStatus: 'verified' | 'partial' | 'unverified'
  aiConfidence: number
  recoverySteps: string[]
  estimatedRecoveryTime: string
  impact: {
    blocksRemoved: number
    deadlineImprovement: string
    successRate: number
  }
  expandedReason: {
    evidenceFound: string[]
    missingEvidence: string[]
    blockedDeps: string[]
    githubActivity: string
    graniteReasoning: string
  }
  granite: {
    status: 'action-required' | 'recoverable' | 'critical'
    reason: string
    recoverySummary: string
    nextAction: string
    confidence: number
  }
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const RECOVERY_TASKS: RecoveryTask[] = [
  {
    id: 'rt1',
    taskName: 'Ship the new authentication flow to staging',
    owner: 'Sarah Chen',
    priority: 'critical',
    riskLevel: 'critical',
    currentStatus: 'at-risk',
    daysWithoutActivity: 1,
    dependencies: ['OAuth Provider integration', 'Session management module', 'API gateway config'],
    githubVerified: true,
    githubStatus: 'partial',
    aiConfidence: 87,
    recoverySteps: [
      'Break task into 3 smaller subtasks',
      'Complete authentication callback handler first',
      'Assign API gateway review to Jordan Blake',
      'Merge existing feature/auth-flow-oauth branch',
      'Schedule pairing session this morning',
    ],
    estimatedRecoveryTime: '6–8 Hours',
    impact: {
      blocksRemoved: 2,
      deadlineImprovement: 'Same Day',
      successRate: 87,
    },
    expandedReason: {
      evidenceFound: [
        '3 commits on feature/auth-flow-oauth in last 24h',
        '1 open pull request — OAuth handler scaffold',
        'Review requested from Jordan Blake at 14:40',
      ],
      missingEvidence: [
        'No staging deployment event detected',
        'Auth middleware unit tests not committed',
        'QA smoke test report absent',
      ],
      blockedDeps: ['OAuth Provider callback URL not configured', 'Session module awaiting merge'],
      githubActivity: 'Active development detected. Last commit 6 hours ago. PR is open but no merge event. Keyword match: auth, staging, OAuth.',
      graniteReasoning: 'Analysis of commit messages and PR description indicates the authentication scaffold is 60% complete. The OAuth callback is the primary blocker. With a 3-hour pairing session, same-day staging delivery is achievable. Confidence rated at 87% based on existing code velocity.',
    },
    granite: {
      status: 'recoverable',
      reason: 'Active commits detected. Partial implementation in progress on feature branch.',
      recoverySummary: 'Authentication flow is 60% complete. OAuth callback handler is the only remaining blocker. A focused pairing session today can deliver by EOD.',
      nextAction: 'Schedule pairing session with Jordan Blake at 9 AM today.',
      confidence: 87,
    },
  },
  {
    id: 'rt2',
    taskName: 'Migrate legacy API endpoints to GraphQL',
    owner: 'Jordan Blake',
    priority: 'critical',
    riskLevel: 'critical',
    currentStatus: 'blocked',
    daysWithoutActivity: 9,
    dependencies: ['API gateway team approval', 'GraphQL schema design', 'Client-side query updates'],
    githubVerified: true,
    githubStatus: 'unverified',
    aiConfidence: 91,
    recoverySteps: [
      'Escalate API gateway dependency to CTO today',
      'Begin GraphQL schema design in parallel',
      'Set up server scaffolding independently',
      'Migrate first 2 endpoints as proof of concept',
      'Assign Amara Osei as backup owner if escalation fails',
    ],
    estimatedRecoveryTime: '3–4 Days',
    impact: {
      blocksRemoved: 4,
      deadlineImprovement: 'Aug 5 → Aug 7',
      successRate: 62,
    },
    expandedReason: {
      evidenceFound: [
        'GraphQL schema draft committed 9 days ago',
        'Branch docs/graphql-migration exists',
        'Issue #47 references gateway dependency',
      ],
      missingEvidence: [
        'Zero commits in last 9 days',
        'No API gateway approval found',
        'Client-side query updates not started',
        'No PR activity since last month',
      ],
      blockedDeps: ['API gateway team approval (external)', 'GraphQL schema review pending'],
      githubActivity: 'No commits detected for 9 days. Branch exists but stale. Issue tracker references unresolved dependency on API gateway team. No automated test runs.',
      graniteReasoning: 'This task has been fully stalled for 9 days due to an external dependency on the API gateway team. Without escalation, this will not meet the Aug 5 deadline. Parallel schema design can reduce recovery time by 40%. Executive escalation is the only lever that unlocks progress within the required timeframe.',
    },
    granite: {
      status: 'critical',
      reason: 'Zero GitHub activity for 9 days. External dependency unresolved. Deadline at severe risk.',
      recoverySummary: 'Task is blocked by API gateway team. No commits in 9 days. Requires immediate CTO-level escalation to become recoverable before Aug 5.',
      nextAction: 'Escalate to CTO immediately. Book escalation meeting before 10 AM.',
      confidence: 91,
    },
  },
  {
    id: 'rt3',
    taskName: 'Deploy real-time analytics pipeline to production',
    owner: 'Amara Osei',
    priority: 'high',
    riskLevel: 'high',
    currentStatus: 'at-risk',
    daysWithoutActivity: 2,
    dependencies: ['Kafka cluster provisioning', 'Production environment config', 'Monitoring setup'],
    githubVerified: true,
    githubStatus: 'verified',
    aiConfidence: 78,
    recoverySteps: [
      'Trigger Kafka cluster provisioning via Terraform today',
      'Configure production environment variables',
      'Set up Datadog dashboards in parallel',
      'Deploy to 10% of production traffic first',
      'Monitor for 2 hours then ramp to 100%',
    ],
    estimatedRecoveryTime: '2 Days',
    impact: {
      blocksRemoved: 1,
      deadlineImprovement: 'Aug 7 (on schedule)',
      successRate: 78,
    },
    expandedReason: {
      evidenceFound: [
        'Staging deployment successful 2 days ago',
        'IaC Terraform files present in repository',
        'Monitoring setup 80% complete per PR comments',
      ],
      missingEvidence: [
        'Kafka production cluster not provisioned',
        'Production environment variables not set',
        'No production deployment event',
      ],
      blockedDeps: ['Kafka cluster provisioning (infra team slot)', 'Production secrets pending DevOps'],
      githubActivity: 'Staging pipeline fully deployed and verified. Production blocked by infrastructure provisioning delay (2 days). IaC templates ready to trigger. Active GitHub activity — last commit 2 days ago.',
      graniteReasoning: 'The analytics pipeline has been successfully deployed to staging. The only remaining blocker is Kafka cluster provisioning, which is a 4-hour infra operation. A phased production rollout (10% → 100%) reduces risk significantly. With DevOps coordination today, Aug 7 deadline is achievable at 78% confidence.',
    },
    granite: {
      status: 'recoverable',
      reason: 'Staging complete. Production blocked only by infrastructure provisioning — a solvable constraint.',
      recoverySummary: 'Analytics pipeline is production-ready. Kafka cluster provisioning is the final blocker. Phased rollout strategy reduces deployment risk significantly.',
      nextAction: 'Coordinate with DevOps to provision Kafka cluster before noon today.',
      confidence: 78,
    },
  },
]

const SUMMARY_STATS = [
  { label: 'Tasks At Risk',           value: '3',  color: '#DA1E28', sub: 'Require immediate action' },
  { label: 'Tasks Blocking Others',   value: '4',  color: '#F1C21B', sub: 'Dependency chains affected' },
  { label: 'Recovery Probability',    value: '72%', color: '#24A148', sub: 'With recommended actions' },
  { label: 'Avg Recovery Time',       value: '2.4d', color: '#0F62FE', sub: 'Across all plans' },
]

const TIMELINE_EVENTS = [
  { day: 'Today',      label: 'Recovery Started',   desc: 'Pairing sessions & escalations begin',  active: true  },
  { day: 'Tomorrow',   label: 'Checkpoint',          desc: 'Auth flow shipped · Gateway escalated', active: false },
  { day: 'Friday',     label: 'Expected Completion', desc: 'Analytics pipeline live in production',  active: false },
  { day: 'Monday',     label: 'Verification Review', desc: 'Granite re-verifies all commitments',   active: false },
]

// ── Color Maps ─────────────────────────────────────────────────────────────────

const RISK_MAP = {
  critical: { color: '#DA1E28', bg: 'rgba(218,30,40,0.10)', border: 'rgba(218,30,40,0.22)', label: 'Critical Risk' },
  high:     { color: '#F1C21B', bg: 'rgba(241,194,27,0.10)', border: 'rgba(241,194,27,0.22)', label: 'High Risk'     },
  medium:   { color: '#0F62FE', bg: 'rgba(15,98,254,0.10)',  border: 'rgba(15,98,254,0.22)',  label: 'Medium Risk'   },
}

const STATUS_MAP = {
  'on-track':  { color: '#24A148', bg: 'rgba(36,161,72,0.10)',   border: 'rgba(36,161,72,0.22)',   label: 'On Track'  },
  'at-risk':   { color: '#F1C21B', bg: 'rgba(241,194,27,0.10)',  border: 'rgba(241,194,27,0.22)',  label: 'At Risk'   },
  'blocked':   { color: '#DA1E28', bg: 'rgba(218,30,40,0.10)',   border: 'rgba(218,30,40,0.22)',   label: 'Blocked'   },
  'completed': { color: '#4589FF', bg: 'rgba(69,137,255,0.10)',  border: 'rgba(69,137,255,0.22)',  label: 'Verified'  },
}

const PRIORITY_MAP = {
  critical: { color: '#DA1E28', label: 'Critical' },
  high:     { color: '#F1C21B', label: 'High'     },
  medium:   { color: '#0F62FE', label: 'Medium'   },
  low:      { color: '#5A6478', label: 'Low'       },
}

const GRANITE_STATUS_MAP = {
  'critical':         { color: '#DA1E28', bg: 'rgba(218,30,40,0.10)', label: 'Critical'         },
  'action-required':  { color: '#F1C21B', bg: 'rgba(241,194,27,0.10)', label: 'Action Required' },
  'recoverable':      { color: '#24A148', bg: 'rgba(36,161,72,0.10)',  label: 'Recoverable'     },
}

const GITHUB_STATUS_MAP = {
  verified:   { color: '#24A148', label: 'Verified',   icon: CheckCircle2  },
  partial:    { color: '#F1C21B', label: 'Partial',    icon: AlertTriangle },
  unverified: { color: '#DA1E28', label: 'Unverified', icon: XCircle       },
}

// ── Animation Variants ─────────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 18 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

const staggerChild = (i: number) => ({
  initial:    { opacity: 0, y: 14 },
  animate:    { opacity: 1, y: 0  },
  transition: { duration: 0.45, delay: 0.1 + i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

// ── Small Primitives ───────────────────────────────────────────────────────────

function FieldLabel({ children, color = '#616E85' }: { children: React.ReactNode; color?: string }) {
  return (
    <p className="text-[10px] font-semibold tracking-widest uppercase" style={{ color }}>
      {children}
    </p>
  )
}

function StatusBadge({ status }: { status: CommitmentStatus }) {
  const { color, bg, border, label } = STATUS_MAP[status]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-[5px] text-[11px] font-semibold rounded-lg tracking-wide leading-none whitespace-nowrap"
      style={{ color, background: bg, border: `1px solid ${border}` }}
    >
      {label}
    </span>
  )
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = PRIORITY_MAP[priority]
  return (
    <span
      className="inline-flex items-center px-2 py-[3px] text-[9.5px] font-bold tracking-widest uppercase rounded leading-none border"
      style={{ color: cfg.color, borderColor: `${cfg.color}2e`, background: `${cfg.color}0e` }}
    >
      {cfg.label}
    </span>
  )
}

function RiskBadge({ level }: { level: RecoveryTask['riskLevel'] }) {
  const cfg = RISK_MAP[level]
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-[5px] text-[11px] font-semibold rounded-lg tracking-wide leading-none whitespace-nowrap border"
      style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.border }}
    >
      <AlertTriangle size={9} strokeWidth={2.5} />
      {cfg.label}
    </span>
  )
}

function GitHubBadge({ status }: { status: RecoveryTask['githubStatus'] }) {
  const cfg = GITHUB_STATUS_MAP[status]
  const Icon = cfg.icon
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-[5px] text-[11px] font-semibold rounded-lg tracking-wide leading-none whitespace-nowrap"
      style={{ color: cfg.color, background: `${cfg.color}14`, border: `1px solid ${cfg.color}28` }}
    >
      <Icon size={10} strokeWidth={2.5} />
      GitHub {cfg.label}
    </span>
  )
}

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
  const style = accent && accentColor
    ? { background: `${accentColor}08`, borderColor: `${accentColor}28` }
    : { background: 'rgba(255,255,255,0.028)', borderColor: 'rgba(255,255,255,0.07)' }

  return (
    <div className={cn('p-5 rounded-xl border', className)} style={style}>
      {children}
    </div>
  )
}

// ── Recovery Card ──────────────────────────────────────────────────────────────

function RecoveryCard({ task, index }: { task: RecoveryTask; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const risk = RISK_MAP[task.riskLevel]
  const graniteStatus = GRANITE_STATUS_MAP[task.granite.status]

  return (
    <motion.div
      {...staggerChild(index)}
      whileHover={{ y: -3, boxShadow: '0 20px 60px rgba(0,0,0,0.45)' }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      className="relative rounded-3xl overflow-hidden cursor-default"
      style={{
        background: 'linear-gradient(145deg, #171E28 0%, #111720 100%)',
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      {/* Risk accent bar */}
      <div className="h-[3px] w-full" style={{ background: `linear-gradient(90deg, ${risk.color}90, transparent)` }} />

      <div className="p-8 pb-7">
        {/* ── Card top row ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex flex-wrap items-center gap-2.5">
            <RiskBadge level={task.riskLevel} />
            <StatusBadge status={task.currentStatus} />
            <PriorityBadge priority={task.priority} />
          </div>
          <div className="flex items-center gap-2">
            <GitHubBadge status={task.githubStatus} />
            <div
              className="flex items-center gap-1.5 px-2.5 py-[5px] rounded-lg border"
              style={{ background: 'rgba(138,63,252,0.08)', borderColor: 'rgba(138,63,252,0.22)' }}
            >
              <Brain size={11} className="text-[#8A3FFC]" />
              <span className="text-[11px] font-mono font-semibold text-[#8A3FFC]">
                {task.aiConfidence}% Confidence
              </span>
            </div>
          </div>
        </div>

        {/* ── Task name ── */}
        <h3 className="text-[20px] font-semibold text-white leading-snug tracking-tight mb-4">
          {task.taskName}
        </h3>

        {/* ── Meta row ── */}
        <div className="flex flex-wrap items-center gap-5 mb-8">
          <div className="flex items-center gap-2">
            <Avatar name={task.owner} size="sm" />
            <span className="text-[13px] text-[#B4BFCE]">{task.owner}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#616E85]">
            <Clock size={12} />
            <span className="text-[12px]">{task.daysWithoutActivity}d without activity</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#616E85]">
            <Layers size={12} />
            <span className="text-[12px]">{task.dependencies.length} dependencies</span>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="h-px bg-[rgba(255,255,255,0.055)] mb-7" />

        {/* ── Two column body ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

          {/* LEFT — Recovery Strategy + Impact */}
          <div className="flex flex-col gap-7">

            {/* Recovery Strategy checklist */}
            <div>
              <FieldLabel color="#616E85">Recovery Strategy</FieldLabel>
              <div className="mt-4 flex flex-col gap-2.5">
                {task.recoverySteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + index * 0.06 + i * 0.04 }}
                    className="flex items-start gap-3"
                  >
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-[1px]"
                      style={{ background: 'rgba(36,161,72,0.15)', border: '1px solid rgba(36,161,72,0.3)' }}
                    >
                      <CheckCircle2 size={9} className="text-[#24A148]" />
                    </span>
                    <span className="text-[13.5px] text-[#C8D0DC] leading-snug">{step}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Estimated Recovery Time */}
            <InnerCard accent accentColor="#0F62FE">
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-[#4589FF] shrink-0" />
                <div>
                  <p className="text-[10px] text-[#4589FF] uppercase tracking-widest font-semibold mb-0.5">
                    Estimated Recovery Time
                  </p>
                  <p className="text-[20px] font-semibold text-white leading-tight">{task.estimatedRecoveryTime}</p>
                </div>
              </div>
            </InnerCard>

            {/* Expected Team Impact */}
            <div>
              <FieldLabel color="#616E85">Expected Team Impact</FieldLabel>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-[10px] text-[#616E85] uppercase tracking-wider font-medium mb-2">Blocks Removed</p>
                  <p className="text-[22px] font-light text-[#24A148] leading-none">{task.impact.blocksRemoved}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-[10px] text-[#616E85] uppercase tracking-wider font-medium mb-2">Deadline</p>
                  <p className="text-[12px] font-semibold text-white leading-snug">{task.impact.deadlineImprovement}</p>
                </div>
                <div className="p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.028)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <p className="text-[10px] text-[#616E85] uppercase tracking-wider font-medium mb-2">Success Rate</p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-[22px] font-light leading-none" style={{ color: task.impact.successRate >= 80 ? '#24A148' : task.impact.successRate >= 60 ? '#F1C21B' : '#DA1E28' }}>
                      {task.impact.successRate}
                    </p>
                    <span className="text-[12px] text-[#616E85]">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — IBM Granite Card */}
          <div>
            <GraniteAdvisorCard task={task} graniteStatus={graniteStatus} />
          </div>
        </div>
      </div>

      {/* ── Expandable: Why this recommendation? ── */}
      <div className="border-t border-[rgba(255,255,255,0.06)]">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between px-8 py-5 hover:bg-[rgba(255,255,255,0.025)] transition-colors group"
        >
          <span className="text-[13px] text-[#616E85] font-medium group-hover:text-[#B4BFCE] transition-colors">
            Why this recommendation?
          </span>
          <ChevronDown
            size={15}
            className={cn('text-[#616E85] transition-transform duration-300', expanded && 'rotate-180')}
          />
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Evidence Found */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={12} className="text-[#24A148]" />
                    <FieldLabel color="#24A148">Evidence Found</FieldLabel>
                  </div>
                  <div className="flex flex-col gap-2">
                    {task.expandedReason.evidenceFound.map((e, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <GitCommit size={11} className="text-[#24A148] shrink-0 mt-[3px]" />
                        <span className="text-[12.5px] text-[#A8B3C5] leading-snug">{e}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Missing Evidence */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={12} className="text-[#DA1E28]" />
                    <FieldLabel color="#DA1E28">Missing Evidence</FieldLabel>
                  </div>
                  <div className="flex flex-col gap-2">
                    {task.expandedReason.missingEvidence.map((e, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <Search size={11} className="text-[#DA1E28] shrink-0 mt-[3px]" />
                        <span className="text-[12.5px] text-[#A8B3C5] leading-snug">{e}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blocked Dependencies */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <XCircle size={12} className="text-[#F1C21B]" />
                    <FieldLabel color="#F1C21B">Blocked Dependencies</FieldLabel>
                  </div>
                  <div className="flex flex-col gap-2">
                    {task.expandedReason.blockedDeps.map((dep, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <GitBranch size={11} className="text-[#F1C21B] shrink-0 mt-[3px]" />
                        <span className="text-[12.5px] text-[#A8B3C5] leading-snug">{dep}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* GitHub Activity Analysis */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Activity size={12} className="text-[#4589FF]" />
                    <FieldLabel color="#4589FF">GitHub Activity Analysis</FieldLabel>
                  </div>
                  <p className="text-[12.5px] text-[#A8B3C5] leading-relaxed">
                    {task.expandedReason.githubActivity}
                  </p>
                </div>

                {/* Granite Reasoning — full width */}
                <div className="md:col-span-2 p-5 rounded-2xl" style={{ background: 'rgba(138,63,252,0.06)', border: '1px solid rgba(138,63,252,0.2)' }}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <Brain size={13} className="text-[#8A3FFC]" />
                    <FieldLabel color="#8A3FFC">Granite Reasoning</FieldLabel>
                  </div>
                  <p className="text-[13px] text-[#C8D0DC] leading-[1.75]">
                    {task.expandedReason.graniteReasoning}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ── Granite Advisor Card (right panel of each Recovery Card) ───────────────────

function GraniteAdvisorCard({
  task,
  graniteStatus,
}: {
  task: RecoveryTask
  graniteStatus: { color: string; bg: string; label: string }
}) {
  const g = task.granite

  return (
    <div
      className="h-full flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: 'rgba(138,63,252,0.04)',
        border: '1px solid rgba(138,63,252,0.18)',
      }}
    >
      {/* Granite header */}
      <div
        className="px-5 py-4 flex items-center gap-3 border-b"
        style={{ borderColor: 'rgba(138,63,252,0.15)', background: 'rgba(138,63,252,0.07)' }}
      >
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(138,63,252,0.18)', border: '1px solid rgba(138,63,252,0.3)' }}
        >
          <Brain size={14} className="text-[#8A3FFC]" />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold text-white leading-tight">IBM Granite</p>
          <p className="text-[10px] text-[#8A3FFC] font-mono">Recommendation</p>
        </div>
        {/* Large Granite badge */}
        <div className="ml-auto shrink-0 px-2 py-1 rounded-lg" style={{ background: 'rgba(138,63,252,0.14)', border: '1px solid rgba(138,63,252,0.25)' }}>
          <span className="text-[9px] font-mono font-bold text-[#8A3FFC] tracking-widest uppercase">Granite 3.3</span>
        </div>
      </div>

      <div className="p-5 flex flex-col gap-5 flex-1">
        {/* Status */}
        <div className="flex flex-col gap-2">
          <FieldLabel>Status</FieldLabel>
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-[5px] text-[11px] font-semibold rounded-lg tracking-wide leading-none w-fit border"
            style={{ color: graniteStatus.color, background: graniteStatus.bg, borderColor: `${graniteStatus.color}28` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: graniteStatus.color }} />
            {graniteStatus.label}
          </span>
        </div>

        {/* Reason */}
        <div className="flex flex-col gap-2">
          <FieldLabel>Reason</FieldLabel>
          <p className="text-[12.5px] text-[#B4BFCE] leading-relaxed">{g.reason}</p>
        </div>

        {/* Recovery Summary */}
        <div className="flex flex-col gap-2">
          <FieldLabel>Recovery Summary</FieldLabel>
          <p className="text-[12.5px] text-[#B4BFCE] leading-relaxed">{g.recoverySummary}</p>
        </div>

        {/* Next Action */}
        <div
          className="flex items-start gap-3 p-3.5 rounded-xl mt-auto"
          style={{ background: 'rgba(15,98,254,0.07)', border: '1px solid rgba(15,98,254,0.2)' }}
        >
          <ArrowRight size={13} className="text-[#4589FF] shrink-0 mt-0.5" />
          <div>
            <p className="text-[10px] text-[#4589FF] uppercase tracking-wider font-semibold mb-1">Next Action</p>
            <p className="text-[12.5px] text-white leading-snug">{g.nextAction}</p>
          </div>
        </div>

        {/* Confidence */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <FieldLabel>Confidence</FieldLabel>
            <span className="text-[11px] font-mono font-semibold text-[#8A3FFC]">{g.confidence}%</span>
          </div>
          <div className="h-[3px] bg-[#1A2130] rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${g.confidence}%` }}
              transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
              style={{ background: '#8A3FFC', boxShadow: '0 0 8px rgba(138,63,252,0.5)' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Recovery Timeline ──────────────────────────────────────────────────────────

function RecoveryTimeline() {
  return (
    <motion.div {...fadeUp(0.5)} className="mt-14">
      <div className="flex items-center gap-2.5 mb-8">
        <div
          className="w-6 h-6 rounded-lg flex items-center justify-center"
          style={{ background: 'rgba(15,98,254,0.12)', border: '1px solid rgba(15,98,254,0.25)' }}
        >
          <BarChart2 size={12} className="text-[#4589FF]" />
        </div>
        <h2 className="text-[11px] font-semibold text-[#616E85] uppercase tracking-[0.2em]">
          Recovery Timeline
        </h2>
      </div>

      <div
        className="p-8 rounded-3xl"
        style={{ background: '#111720', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="relative pl-8">
          {/* Vertical line */}
          <div
            className="absolute left-[11px] top-3 bottom-3 w-[2px] rounded-full"
            style={{ background: 'linear-gradient(180deg, #0F62FE 0%, rgba(15,98,254,0.1) 100%)' }}
          />

          <div className="flex flex-col gap-10">
            {TIMELINE_EVENTS.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-6"
              >
                {/* Dot */}
                <div
                  className="w-[10px] h-[10px] rounded-full shrink-0 mt-[5px] absolute left-[7px]"
                  style={{
                    background: event.active ? '#0F62FE' : '#1F2A38',
                    border: event.active ? '2px solid rgba(15,98,254,0.5)' : '2px solid #2A3347',
                    boxShadow: event.active ? '0 0 10px rgba(15,98,254,0.6)' : 'none',
                  }}
                />

                <div className={cn(
                  'flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-6 flex-1',
                  event.active && 'opacity-100',
                  !event.active && 'opacity-60'
                )}>
                  <div className="w-20 shrink-0">
                    <span
                      className="text-[12px] font-semibold"
                      style={{ color: event.active ? '#4589FF' : '#616E85' }}
                    >
                      {event.day}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className={cn('text-[14px] font-semibold leading-tight', event.active ? 'text-white' : 'text-[#B4BFCE]')}>
                      {event.label}
                    </p>
                    <p className="text-[12px] text-[#616E85] mt-0.5">{event.desc}</p>
                  </div>
                  {event.active && (
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-semibold rounded-lg tracking-wider uppercase"
                      style={{ background: 'rgba(15,98,254,0.12)', color: '#4589FF', border: '1px solid rgba(15,98,254,0.25)' }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0F62FE] animate-pulse" />
                      Active
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ── Summary Stats Row ──────────────────────────────────────────────────────────

function SummaryStats() {
  return (
    <motion.div {...fadeUp(0.1)} className="mb-8 md:mb-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 + i * 0.07, duration: 0.4 }}
            className="p-6 rounded-2xl"
            style={{
              background: '#111720',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <p className="text-[10px] font-semibold text-[#616E85] uppercase tracking-widest mb-3">
              {stat.label}
            </p>
            <p className="text-[28px] font-light leading-none mb-1.5" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-[11px] text-[#3D4860]">{stat.sub}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ── Page Header ────────────────────────────────────────────────────────────────

function PageHeader() {
  return (
    <motion.div {...fadeUp(0)} className="mb-8 md:mb-10">
      {/* Eyebrow */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: 'rgba(218,30,40,0.12)', border: '1px solid rgba(218,30,40,0.28)' }}
        >
          <Shield size={15} className="text-[#DA1E28]" />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-semibold text-[#DA1E28] uppercase tracking-[0.18em]">
            3 recoveries required
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#DA1E28] animate-pulse" />
        </div>
      </div>

      {/* Title */}
      <h1 className="text-[38px] font-light text-white tracking-tight leading-[1.15] mb-4">
        Recovery Planner
      </h1>
      <p className="text-[15px] text-[#616E85] leading-relaxed max-w-[580px]">
        AI-generated action plans based on verified GitHub evidence.
        Each recommendation is grounded in commit history, PR activity, and dependency analysis.
      </p>

      {/* IBM Granite attribution */}
      <div className="flex items-center gap-2.5 mt-5">
        <Brain size={13} className="text-[#8A3FFC]" />
        <span className="text-[11px] font-mono text-[#8A3FFC]">IBM Granite 3.3 · 8B Instruct</span>
        <span className="text-[11px] text-[#3D4860]">·</span>
        <Zap size={11} className="text-[#3D4860]" />
        <span className="text-[11px] text-[#3D4860]">Ledger AI</span>
      </div>
    </motion.div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function RecoveryPlannerPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Container className="py-8 md:py-12">
        
        <PageHeader />
        <SummaryStats />

        {/* Section label */}
        <motion.div {...fadeUp(0.2)} className="flex items-center gap-3 mb-6">
          <h2 className="text-[11px] font-semibold text-[#616E85] uppercase tracking-[0.2em]">
            Recovery Plans
          </h2>
          <div className="flex-1 h-px bg-[rgba(255,255,255,0.055)]" />
          <span className="text-[11px] text-[#3D4860] font-medium">
            {RECOVERY_TASKS.length} plans generated
          </span>
        </motion.div>

        {/* Recovery cards */}
        <div className="flex flex-col gap-8">
          {RECOVERY_TASKS.map((task, i) => (
            <RecoveryCard key={task.id} task={task} index={i} />
          ))}
        </div>

        {/* Recovery Timeline */}
        <RecoveryTimeline />

        {/* Bottom note */}
        <motion.div {...fadeUp(0.6)} className="mt-12 flex items-center justify-center gap-3">
          <Brain size={12} className="text-[#3D4860]" />
          <span className="text-[11px] text-[#3D4860] text-center">
            Recovery plans are regenerated each time Ledger analyzes your GitHub repository.
            Evidence confidence updates in real time.
          </span>
        </motion.div>
      </Container>
    </div>
  )
}
