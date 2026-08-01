import { motion } from 'framer-motion'
import { Download, FileJson, CheckCircle2, AlertTriangle, XCircle, Brain, Zap, GitCommit, GitMerge, Activity, ShieldCheck } from 'lucide-react'
import { Container } from '@/components/layout/Container'
import { Section } from '@/components/layout/Section'

const REPORT = {
  repository: 'ibm-org / ledger-platform',
  sprintName: 'Sprint 24 — Q3 Delivery',
  generatedAt: 'August 1, 2026 — 09:42 AM',
  overallHealth: 58,
  healthExplanation: '58 indicates that immediate intervention is required for two critical commitments.',
  totalCommitments: 5,
  verified: 2,
  atRisk: 2,
  blocked: 1,
  graniteModelVersion: 'IBM Granite 3.3 (8B Instruct)',
  evidence: {
    verifiedCommits: 47,
    mergedPullRequests: 12,
    repositoryActivity: 'High',
    verificationConfidence: '96%',
  },
}

const COMMITMENTS = [
  {
    owner: 'Sarah Chen',
    commitment: 'Ship new authentication flow to staging',
    verification: 'No commits in 9 days',
    risk: 'High',
    recovery: 'Pair session today',
    confidence: '62%',
    status: 'at-risk' as const,
  },
  {
    owner: 'Marcus Rivera',
    commitment: 'Complete Q3 product roadmap documentation',
    verification: '4 commits merged',
    risk: 'None',
    recovery: '—',
    confidence: '97%',
    status: 'on-track' as const,
  },
  {
    owner: 'Jordan Blake',
    commitment: 'Migrate legacy API endpoints to GraphQL',
    verification: 'Blocked — external dep',
    risk: 'Critical',
    recovery: 'CTO escalation required',
    confidence: '28%',
    status: 'blocked' as const,
  },
  {
    owner: 'Priya Nair',
    commitment: 'Deliver final design specs for onboarding v2',
    verification: 'Design files shipped',
    risk: 'None',
    recovery: '—',
    confidence: '99%',
    status: 'completed' as const,
  },
  {
    owner: 'Amara Osei',
    commitment: 'Deploy real-time analytics pipeline to production',
    verification: 'Infrastructure gap',
    risk: 'Medium',
    recovery: 'Infra team sync',
    confidence: '51%',
    status: 'at-risk' as const,
  },
]

const RECOVERY = {
  risks: [
    'GraphQL migration (C3) has been stalled for 9 days due to an unresolved API gateway dependency.',
    'Authentication flow (C1) shows a dangerous commit gap entering the final sprint days.',
  ],
  successes: [
    'Design deliverables (C4) are fully complete and verified — no risk.',
    'Product roadmap documentation (C2) is ahead of schedule with 4 merged commits.',
  ],
  opportunities: [
    'Analytics pipeline (C5) is recoverable with a single infrastructure team coordination session.',
    'A pairing session for C1 scheduled today would materially reduce the authentication risk.',
  ],
}

const RECOMMENDATION = {
  priority: 'High',
  confidence: '96%',
  body: 'Immediate action is required on the GraphQL migration (C3). The API gateway dependency must be escalated to CTO-level today. For the authentication flow (C1), a pairing session should be scheduled this morning. The analytics pipeline (C5) is recoverable with infrastructure team coordination. The design deliverables are complete and pose no risk.',
}

/* ── Helpers ─────────────────────────────────────────────────── */

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

const STATUS_MAP = {
  'on-track':  { Icon: CheckCircle2, color: '#24A148', label: 'Verified' },
  'at-risk':   { Icon: AlertTriangle, color: '#F1C21B', label: 'At Risk' },
  'blocked':   { Icon: XCircle,       color: '#DA1E28', label: 'Blocked' },
  'completed': { Icon: CheckCircle2,  color: '#4589FF', label: 'Complete' },
}

const RISK_COLOR: Record<string, string> = {
  'None':     '#24A148',
  'Medium':   '#F1C21B',
  'High':     '#DA1E28',
  'Critical': '#DA1E28',
}

/* ── Sub-components ──────────────────────────────────────────── */

function HealthRing({ score }: { score: number }) {
  const r = 60
  const circ = 2 * Math.PI * r
  const offset = circ - (score / 100) * circ
  const color = score >= 70 ? '#24A148' : score >= 45 ? '#F1C21B' : '#DA1E28'

  return (
    <div className="relative w-40 h-40 flex items-center justify-center shrink-0">
      <svg width="160" height="160" className="rotate-[-90deg]">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#1B222D" strokeWidth="10" />
        <motion.circle
          cx="80" cy="80" r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
          style={{ filter: `drop-shadow(0 0 6px ${color}60)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-4xl font-light text-white leading-none"
        >
          {score}
        </motion.span>
        <span className="text-xs text-[#5A6478] mt-1 tracking-wide">Health Score</span>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[10px] font-semibold text-[#616E85] uppercase tracking-[0.22em] mb-6">
      {children}
    </h2>
  )
}

function RecoveryGroup({
  color,
  label,
  items,
}: {
  color: string
  label: string
  items: string[]
}) {
  return (
    <div>
      <p
        className="text-[10px] font-semibold uppercase tracking-[0.18em] mb-4"
        style={{ color }}
      >
        {label}
      </p>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className="mt-[6px] w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: color }}
            />
            <span className="text-[14px] text-[#B4BFCE] leading-[1.75]">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ── Page ────────────────────────────────────────────────────── */

export function ExecutiveReportPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <Section variant="normal">
        <Container>

          {/* ── 1. Report Header ─────────────────────────────────── */}
        <motion.div {...fadeUp(0)} className="mb-10 md:mb-16">

          {/* Logo + badges row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 md:mb-10">
            <div className="flex items-center gap-4">
              <div
                className="w-11 h-11 rounded-xl bg-[#0F62FE] flex items-center justify-center"
                style={{ boxShadow: '0 0 22px rgba(15,98,254,0.45)' }}
              >
                <Zap size={18} className="text-white" fill="white" />
              </div>
              <div>
                <p className="text-[15px] font-semibold text-white tracking-tight">Ledger</p>
                <p className="text-[11px] text-[#616E85] tracking-wide">Executive Sprint Report</p>
              </div>
            </div>

            {/* Verified badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(138,63,252,0.10)] border border-[rgba(138,63,252,0.22)] text-[11px] font-semibold text-[#8A3FFC]">
                <Brain size={11} />
                IBM Granite
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[rgba(36,161,72,0.10)] border border-[rgba(36,161,72,0.22)] text-[11px] font-semibold text-[#24A148]">
                <ShieldCheck size={11} />
                GitHub Verified
              </span>
            </div>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pb-8 md:pb-10 mb-8 md:mb-10 border-b border-[rgba(255,255,255,0.07)]">
            <div>
              <p className="text-[10px] text-[#616E85] uppercase tracking-[0.18em] mb-1.5">Repository</p>
              <p className="text-[13px] font-mono text-[#B4BFCE]">{REPORT.repository}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#616E85] uppercase tracking-[0.18em] mb-1.5">Sprint</p>
              <p className="text-[13px] font-medium text-[#B4BFCE]">{REPORT.sprintName}</p>
            </div>
            <div>
              <p className="text-[10px] text-[#616E85] uppercase tracking-[0.18em] mb-1.5">Generated</p>
              <p className="text-[13px] font-mono text-[#B4BFCE]">{REPORT.generatedAt}</p>
            </div>
          </div>

          {/* Title block */}
          <div>
            <p className="text-[10px] font-mono text-[#616E85] uppercase tracking-[0.22em] mb-4">
              Sprint Accountability Review
            </p>
            <h1 className="text-[clamp(28px,5vw,44px)] font-light text-white tracking-tight leading-[1.15] mb-4">
              Team Commitment Analysis
            </h1>
            <p className="text-[14px] text-[#616E85] leading-relaxed">
              Verified against GitHub activity · {REPORT.graniteModelVersion}
            </p>
          </div>
        </motion.div>

        {/* ── 2. Health Score + Stats ───────────────────────────── */}
        <motion.div {...fadeUp(0.08)} className="mb-10 md:mb-16">
          <SectionLabel>Sprint Health Overview</SectionLabel>
          <div
            className="flex flex-col sm:flex-row items-center gap-8 md:gap-12 p-6 sm:p-8 md:p-10 bg-[#111720]
                        border border-[rgba(255,255,255,0.07)] rounded-2xl"
          >
            <HealthRing score={REPORT.overallHealth} />
            <div className="flex-1 w-full">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8 mb-8">
                {[
                  { label: 'Total Commitments', value: REPORT.totalCommitments, color: '#B4BFCE' },
                  { label: 'Verified On-Track',  value: REPORT.verified,          color: '#24A148' },
                  { label: 'At Risk',             value: REPORT.atRisk,            color: '#F1C21B' },
                  { label: 'Blocked',             value: REPORT.blocked,           color: '#DA1E28' },
                ].map(({ label, value, color }) => (
                  <div key={label} className="flex flex-col gap-2">
                    <span className="text-[10px] text-[#616E85] uppercase tracking-[0.18em] font-medium">{label}</span>
                    <span className="text-[38px] font-light leading-none" style={{ color }}>{value}</span>
                  </div>
                ))}
              </div>
              {/* Health explanation */}
              <div className="pt-7 border-t border-[rgba(255,255,255,0.07)]">
                <p className="text-[13px] text-[#616E85] leading-[1.7] italic">
                  {REPORT.healthExplanation}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 3. Commitment Status Table ────────────────────────── */}
        <motion.div {...fadeUp(0.12)} className="mb-10 md:mb-16">
          <SectionLabel>Commitment Status</SectionLabel>
          {/* Desktop table */}
          <div className="hidden md:block overflow-hidden border border-[rgba(255,255,255,0.07)] rounded-2xl">
            {/* Table header */}
            <div
              className="grid gap-4 px-6 py-4 bg-[#111720] border-b border-[rgba(255,255,255,0.07)]"
              style={{ gridTemplateColumns: '1.6fr 2.8fr 2fr 1fr 2fr 1fr' }}
            >
              {['Owner', 'Commitment', 'Verification', 'Risk', 'Recovery', 'Confidence'].map(col => (
                <span key={col} className="text-[10px] font-semibold text-[#616E85] uppercase tracking-[0.18em]">
                  {col}
                </span>
              ))}
            </div>
            {/* Rows */}
            {COMMITMENTS.map((row, i) => {
              const { color } = STATUS_MAP[row.status]
              const riskColor = RISK_COLOR[row.risk] ?? '#B4BFCE'
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.14 + i * 0.06 }}
                  className="grid gap-4 px-6 py-5 bg-[#171E28] border-b border-[rgba(255,255,255,0.05)]
                             last:border-b-0 hover:bg-[#1D2535] transition-colors duration-150"
                  style={{ gridTemplateColumns: '1.6fr 2.8fr 2fr 1fr 2fr 1fr' }}
                >
                  <div className="flex flex-col gap-1 justify-center">
                    <span className="text-[13px] text-white font-medium leading-snug">{row.owner}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[12px] text-[#B4BFCE] leading-snug">{row.commitment}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-[12px] text-[#B4BFCE]">{row.verification}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg"
                      style={{ color: riskColor, background: riskColor + '14', border: `1px solid ${riskColor}28` }}>
                      {row.risk}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[12px] text-[#616E85]">{row.recovery}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-[13px] font-mono font-semibold" style={{ color }}>{row.confidence}</span>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* Mobile card layout */}
          <div className="md:hidden flex flex-col gap-3">
            {COMMITMENTS.map((row, i) => {
              const { color } = STATUS_MAP[row.status]
              const riskColor = RISK_COLOR[row.risk] ?? '#B4BFCE'
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  className="p-4 bg-[#171E28] border border-[rgba(255,255,255,0.07)] rounded-xl"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <span className="text-[13px] text-white font-semibold">{row.owner}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                        style={{ color: riskColor, background: riskColor + '14', border: `1px solid ${riskColor}28` }}>
                        {row.risk}
                      </span>
                      <span className="text-[12px] font-mono font-semibold" style={{ color }}>{row.confidence}</span>
                    </div>
                  </div>
                  <p className="text-[12px] text-[#B4BFCE] leading-snug mb-2">{row.commitment}</p>
                  <p className="text-[11px] text-[#616E85]">{row.recovery}</p>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* ── 4. Recovery Summary ───────────────────────────────── */}
        <motion.div {...fadeUp(0.16)} className="mb-10 md:mb-16">
          <SectionLabel>Recovery Summary</SectionLabel>
          <div className="p-6 md:p-8 bg-[#111720] border border-[rgba(255,255,255,0.07)] rounded-2xl">
            <div className="flex flex-col gap-10">
              <RecoveryGroup color="#DA1E28" label="Key Risks" items={RECOVERY.risks} />
              <div className="section-divider" />
              <RecoveryGroup color="#24A148" label="Key Successes" items={RECOVERY.successes} />
              <div className="section-divider" />
              <RecoveryGroup color="#4589FF" label="Recovery Opportunities" items={RECOVERY.opportunities} />
            </div>
          </div>
        </motion.div>

        {/* ── 5. Executive Recommendation ──────────────────────── */}
        <motion.div {...fadeUp(0.20)} className="mb-10 md:mb-16">
          <SectionLabel>Executive Recommendation</SectionLabel>
          <div
            className="p-6 md:p-8 bg-[rgba(15,98,254,0.04)] border border-[rgba(15,98,254,0.22)] rounded-2xl"
          >
            {/* Header row */}
            <div className="flex items-start justify-between gap-6 mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg bg-[rgba(138,63,252,0.14)] border border-[rgba(138,63,252,0.28)]
                              flex items-center justify-center shrink-0"
                >
                  <Brain size={15} className="text-[#8A3FFC]" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-white">{REPORT.graniteModelVersion}</p>
                  <p className="text-[11px] text-[#616E85]">AI-generated · verified against repository</p>
                </div>
              </div>

              {/* Priority + Confidence badges */}
              <div className="flex items-center gap-2.5 shrink-0">
                <div className="text-center px-4 py-2 rounded-xl bg-[#171E28] border border-[rgba(255,255,255,0.08)]">
                  <p className="text-[9px] text-[#616E85] uppercase tracking-[0.18em] mb-1">Priority</p>
                  <p className="text-[13px] font-semibold text-[#DA1E28]">{RECOMMENDATION.priority}</p>
                </div>
                <div className="text-center px-4 py-2 rounded-xl bg-[#171E28] border border-[rgba(255,255,255,0.08)]">
                  <p className="text-[9px] text-[#616E85] uppercase tracking-[0.18em] mb-1">Confidence</p>
                  <p className="text-[13px] font-semibold text-[#24A148]">{RECOMMENDATION.confidence}</p>
                </div>
              </div>
            </div>

            <div className="section-divider mb-8" />

            <p className="text-[15px] text-white leading-[1.85]">{RECOMMENDATION.body}</p>
          </div>
        </motion.div>

        {/* ── 6. Evidence Summary ───────────────────────────────── */}
        <motion.div {...fadeUp(0.24)} className="mb-10 md:mb-16">
          <SectionLabel>Evidence Summary</SectionLabel>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: GitCommit,   label: 'Verified Commits',          value: REPORT.evidence.verifiedCommits,       color: '#4589FF' },
              { icon: GitMerge,    label: 'Merged Pull Requests',       value: REPORT.evidence.mergedPullRequests,    color: '#24A148' },
              { icon: Activity,    label: 'Repository Activity',        value: REPORT.evidence.repositoryActivity,    color: '#F1C21B' },
              { icon: ShieldCheck, label: 'Verification Confidence',    value: REPORT.evidence.verificationConfidence, color: '#8A3FFC' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div
                key={label}
                className="flex flex-col gap-4 p-6 bg-[#111720] border border-[rgba(255,255,255,0.07)] rounded-2xl"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: color + '14', border: `1px solid ${color}28` }}
                >
                  <Icon size={14} style={{ color }} />
                </div>
                <div>
                  <p className="text-[24px] font-light leading-none" style={{ color }}>{value}</p>
                  <p className="text-[11px] text-[#616E85] mt-2 leading-snug">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── 7. Export + PDF Preview ───────────────────────────── */}
        <motion.div {...fadeUp(0.28)}>
          <div className="section-divider mb-8" />
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 md:gap-8">

            {/* PDF Preview card */}
            <div
              className="w-[100px] sm:w-[120px] shrink-0 aspect-[3/4] bg-[#111720] border border-[rgba(255,255,255,0.09)]
                          rounded-xl flex flex-col items-center justify-between p-4"
              style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
            >
              <div className="w-full">
                <div
                  className="w-7 h-7 rounded-lg bg-[#0F62FE] flex items-center justify-center mb-3"
                  style={{ boxShadow: '0 0 14px rgba(15,98,254,0.45)' }}
                >
                  <Zap size={12} className="text-white" fill="white" />
                </div>
                <p className="text-[10px] font-semibold text-white leading-tight">Ledger</p>
                <p className="text-[8px] text-[#616E85] mt-0.5">Sprint Report</p>
              </div>
              <div className="w-full space-y-1.5">
                <div className="h-[2px] w-full rounded bg-[rgba(255,255,255,0.05)]" />
                <div className="h-[2px] w-3/4 rounded bg-[rgba(255,255,255,0.05)]" />
                <div className="h-[2px] w-1/2 rounded bg-[rgba(255,255,255,0.05)]" />
              </div>
              <div className="w-full pt-2 border-t border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-1 mb-1">
                  <Brain size={7} className="text-[#8A3FFC]" />
                  <p className="text-[7px] text-[#616E85]">IBM Granite</p>
                </div>
                <div className="flex items-center gap-1">
                  <ShieldCheck size={7} className="text-[#24A148]" />
                  <p className="text-[7px] text-[#616E85]">GitHub Verified</p>
                </div>
              </div>
            </div>

            {/* Right side: branding + buttons */}
            <div className="flex-1 flex flex-col sm:items-end gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0F62FE] animate-pulse" />
                <span className="text-[12px] text-[#616E85] font-mono">Powered by IBM Granite</span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-6 py-3 bg-[#171E28] border border-[rgba(255,255,255,0.09)]
                             text-[13px] text-[#B4BFCE] rounded-xl hover:border-[rgba(255,255,255,0.16)]
                             hover:text-white transition-all duration-200 font-medium"
                >
                  <FileJson size={14} />
                  Export JSON
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2.5 px-6 py-3 bg-[#0F62FE] text-white
                             text-[13px] font-semibold rounded-xl hover:bg-[#0353E9] transition-colors
                             btn-primary-glow"
                >
                  <Download size={14} />
                  Export PDF
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        </Container>
      </Section>
    </div>
  )
}
