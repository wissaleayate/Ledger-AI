import { motion } from 'framer-motion'
import {
  TrendingUp, TrendingDown, Target, Users, CheckCircle2,
  AlertTriangle, Activity, Sparkles, ArrowRight, Flame,
} from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { StatCard } from '@/components/ui/StatCard'
import { Badge, statusBadgeProps } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/Progress'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { MOCK_OBJECTIVES, MOCK_ACTIVITIES, MOCK_USERS, CHART_DATA } from '@/data/mock'
import { formatRelativeDate } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1B222D] border border-[#242C38] rounded-lg px-3 py-2 text-xs">
      <p className="text-[#5A6478] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }} className="font-mono">
          {p.name}: {p.value}%
        </p>
      ))}
    </div>
  )
}

export function DashboardPage() {
  const atRiskCount = MOCK_OBJECTIVES.filter((o) => o.status === 'at-risk' || o.status === 'behind').length
  const onTrackCount = MOCK_OBJECTIVES.filter((o) => o.status === 'on-track').length
  const avgProgress = Math.round(MOCK_OBJECTIVES.reduce((a, b) => a + b.progress, 0) / MOCK_OBJECTIVES.length)

  return (
    <>
      <TopBar
        title="Dashboard"
        description="Q3 2026 · Jul 31, 2026"
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 flex flex-col gap-6"
      >
        {/* AI Insight Banner */}
        <motion.div variants={itemVariants}>
          <div className="flex items-start gap-3 px-4 py-3 bg-[rgba(138,63,252,0.06)] border border-[rgba(138,63,252,0.18)] rounded-lg">
            <Sparkles size={14} className="text-[#8A3FFC] mt-0.5 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-[#8A3FFC] mb-0.5">AI Weekly Digest</p>
              <p className="text-xs text-[#A8B3C5] leading-relaxed">
                2 objectives are at risk of missing Q3 targets. <strong className="text-white">Data &amp; AI</strong> is the most behind team at 31% progress.
                Recommended action: escalate "Real-Time Analytics Pipeline" blocker by Friday.
              </p>
            </div>
            <Button variant="ghost" size="sm" iconRight={<ArrowRight size={11} />} className="shrink-0">
              View
            </Button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard
            label="Avg. Progress"
            value={`${avgProgress}%`}
            change={4}
            changeLabel="vs last week"
            icon={<TrendingUp size={14} />}
            color="#0F62FE"
          />
          <StatCard
            label="On Track"
            value={onTrackCount}
            subValue={`of ${MOCK_OBJECTIVES.length} objectives`}
            change={1}
            changeLabel="this week"
            icon={<CheckCircle2 size={14} />}
            color="#24A148"
          />
          <StatCard
            label="At Risk / Behind"
            value={atRiskCount}
            subValue="need attention"
            change={-1}
            changeLabel="vs last week"
            icon={<AlertTriangle size={14} />}
            color="#F1C21B"
          />
          <StatCard
            label="Team Members"
            value={MOCK_USERS.length}
            subValue="across 4 teams"
            icon={<Users size={14} />}
            color="#8A3FFC"
          />
        </motion.div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Progress Trend */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card padding="none" className="overflow-hidden">
              <CardHeader className="px-5 pt-5 pb-0">
                <div>
                  <CardTitle>Progress Trend</CardTitle>
                  <CardDescription>6-week rolling status distribution</CardDescription>
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[#5A6478]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#24A148]" />On Track</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F1C21B]" />At Risk</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#DA1E28]" />Behind</span>
                </div>
              </CardHeader>
              <div className="px-2 pb-3 pt-3 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={CHART_DATA.weeklyProgress} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                    <defs>
                      <linearGradient id="gGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#24A148" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#24A148" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gYellow" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#F1C21B" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#F1C21B" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="gRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#DA1E28" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#DA1E28" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1D2533" vertical={false} />
                    <XAxis dataKey="week" tick={{ fill: '#5A6478', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5A6478', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Area type="monotone" dataKey="onTrack" name="On Track" stroke="#24A148" strokeWidth={2} fill="url(#gGreen)" />
                    <Area type="monotone" dataKey="atRisk" name="At Risk" stroke="#F1C21B" strokeWidth={2} fill="url(#gYellow)" />
                    <Area type="monotone" dataKey="behind" name="Behind" stroke="#DA1E28" strokeWidth={2} fill="url(#gRed)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Team Performance */}
          <motion.div variants={itemVariants}>
            <Card padding="none" className="overflow-hidden h-full">
              <CardHeader className="px-5 pt-5 pb-0">
                <div>
                  <CardTitle>Team Performance</CardTitle>
                  <CardDescription>Avg. objective progress</CardDescription>
                </div>
              </CardHeader>
              <div className="px-4 pb-4 pt-3 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA.teamPerformance} margin={{ top: 4, right: 4, bottom: 0, left: -30 }} barSize={20}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1D2533" horizontal={true} vertical={false} />
                    <XAxis dataKey="team" tick={{ fill: '#5A6478', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5A6478', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip content={({ active, payload }) => {
                      if (!active || !payload?.length) return null
                      return (
                        <div className="bg-[#1B222D] border border-[#242C38] rounded-lg px-3 py-2 text-xs">
                          <p className="font-mono text-white">{payload[0].value}%</p>
                        </div>
                      )
                    }} />
                    <Bar dataKey="score" radius={[2, 2, 0, 0]}>
                      {CHART_DATA.teamPerformance.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.score >= 70 ? '#24A148' : entry.score >= 50 ? '#0F62FE' : '#DA1E28'}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Objectives at a Glance */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card padding="none">
              <CardHeader className="px-5 pt-5 pb-4 border-b border-[#1D2533]">
                <div>
                  <CardTitle>Active Objectives</CardTitle>
                  <CardDescription>Q3 2026 · All teams</CardDescription>
                </div>
                <Button variant="ghost" size="sm" iconRight={<ArrowRight size={11} />}>
                  View All
                </Button>
              </CardHeader>
              <div className="flex flex-col divide-y divide-[#1D2533]">
                {MOCK_OBJECTIVES.slice(0, 4).map((obj) => {
                  const owner = MOCK_USERS.find((u) => u.id === obj.ownerId)
                  const bp = statusBadgeProps(obj.status)
                  return (
                    <div key={obj.id} className="flex items-center gap-4 px-5 py-3 hover:bg-[#1D2533] transition-colors cursor-pointer group">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-white truncate">{obj.title}</span>
                          <Badge {...bp} size="sm" />
                        </div>
                        <ProgressBar value={obj.progress} animated={false} />
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-mono text-[#5A6478] tabular-nums">{obj.progress}%</span>
                        {owner && <Avatar name={owner.name} size="xs" />}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>

          {/* Activity Feed */}
          <motion.div variants={itemVariants}>
            <Card padding="none" className="h-full">
              <CardHeader className="px-4 pt-4 pb-3 border-b border-[#1D2533]">
                <div>
                  <CardTitle>Activity</CardTitle>
                  <CardDescription>Last 7 days</CardDescription>
                </div>
                <Activity size={13} className="text-[#5A6478]" />
              </CardHeader>
              <div className="flex flex-col px-4 py-3 gap-3 overflow-y-auto max-h-72">
                {MOCK_ACTIVITIES.map((act) => {
                  const user = MOCK_USERS.find((u) => u.id === act.userId)
                  if (!user) return null
                  return (
                    <div key={act.id} className="flex gap-2.5">
                      <Avatar name={user.name} size="xs" className="mt-0.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-medium text-white leading-tight mb-0.5">{user.name}</p>
                        <p className="text-[11px] text-[#A8B3C5] leading-relaxed">{act.message}</p>
                        <span className="text-[10px] text-[#3A4255]">{formatRelativeDate(act.timestamp)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Top Performers */}
        <motion.div variants={itemVariants}>
          <Card padding="none">
            <CardHeader className="px-5 pt-5 pb-4 border-b border-[#1D2533]">
              <div>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>This quarter by on-time completion rate</CardDescription>
              </div>
              <Badge variant="purple" size="sm">
                <Flame size={10} />
                Streak leaders
              </Badge>
            </CardHeader>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 divide-x divide-[#1D2533]">
              {MOCK_USERS.map((user) => (
                <div key={user.id} className="flex flex-col items-center gap-2 p-4 hover:bg-[#1D2533] transition-colors cursor-pointer">
                  <Avatar name={user.name} size="lg" showStatus status="online" />
                  <div className="text-center">
                    <p className="text-xs font-medium text-white leading-tight">{user.name.split(' ')[0]}</p>
                    <p className="text-[10px] text-[#5A6478]">{user.title}</p>
                  </div>
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-sm font-semibold font-mono text-white">{user.metrics.onTimeRate}%</span>
                    <span className="text-[10px] text-[#5A6478]">on-time</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame size={10} className="text-[#F1C21B]" />
                    <span className="text-[10px] font-mono text-[#F1C21B]">{user.metrics.streak}d</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </>
  )
}
