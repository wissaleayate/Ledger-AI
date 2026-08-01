import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp, Download, Calendar, BarChart3, Sparkles,
  ArrowUpRight, ArrowDownRight,
} from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Tabs } from '@/components/ui/Tabs'
import { LineTabs } from '@/components/ui/Tabs'
import { CHART_DATA, MOCK_TEAMS, MOCK_USERS, MOCK_OBJECTIVES } from '@/data/mock'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1B222D] border border-[#242C38] rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-[#5A6478] mb-1.5 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="font-mono" style={{ color: p.color }}>
          {p.name}: {p.value}{typeof p.value === 'number' && p.value <= 100 && p.unit !== 'count' ? '%' : ''}
        </p>
      ))}
    </div>
  )
}

const AI_PREDICTIONS = [
  { id: 'pred1', text: 'Engineering team on track to close 100% of Q3 objectives at current velocity.', confidence: 'high', type: 'success' },
  { id: 'pred2', text: 'Data & AI team is 68% likely to miss pipeline deadline without intervention.', confidence: 'high', type: 'danger' },
  { id: 'pred3', text: 'Jordan Blake\'s review cycle metric shows improving trend, likely to hit target if acceleration continues.', confidence: 'medium', type: 'warning' },
  { id: 'pred4', text: 'Design team maintains the highest consistency score at 94% check-in rate.', confidence: 'high', type: 'success' },
]

const COMPLETION_BY_TEAM = MOCK_TEAMS.map((team) => {
  const objs = MOCK_OBJECTIVES.filter((o) => o.teamId === team.id)
  const avg = objs.length > 0 ? Math.round(objs.reduce((a, b) => a + b.progress, 0) / objs.length) : 0
  return { team: team.name, progress: avg, color: team.color }
})

const INDIVIDUAL_PERFORMANCE = MOCK_USERS.map((u) => ({
  name: u.name.split(' ')[0],
  onTime: u.metrics.onTimeRate,
  completed: u.metrics.goalsCompleted,
}))

export function ReportsPage() {
  const [period, setPeriod] = useState('q3')

  return (
    <>
      <TopBar
        title="Reports & Analytics"
        description="AI-powered performance insights"
        actions={
          <Button variant="secondary" size="sm" icon={<Download size={13} />}>
            Export
          </Button>
        }
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 flex flex-col gap-5"
      >
        {/* Period Selector */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <LineTabs
            tabs={[
              { id: 'q1', label: 'Q1 2026' },
              { id: 'q2', label: 'Q2 2026' },
              { id: 'q3', label: 'Q3 2026' },
            ]}
            active={period}
            onChange={setPeriod}
          />
          <div className="flex items-center gap-2">
            <Button variant="secondary" size="sm" icon={<Calendar size={13} />}>
              Custom Range
            </Button>
          </div>
        </motion.div>

        {/* KPI Summary */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Overall Progress', value: '61%', change: '+4%', up: true, desc: 'vs prev quarter' },
            { label: 'Completion Rate', value: '73%', change: '+12%', up: true, desc: 'goals completed on time' },
            { label: 'Avg Streak', value: '13d', change: '+2d', up: true, desc: 'accountability streak' },
            { label: 'At-Risk Ratio', value: '40%', change: '-5%', up: false, desc: 'objectives needing attention' },
          ].map((kpi) => (
            <div key={kpi.label} className="bg-[#1B222D] border border-[#242C38] rounded-lg p-4 flex flex-col gap-2">
              <span className="text-[10px] font-medium text-[#5A6478] uppercase tracking-wider">{kpi.label}</span>
              <div className="flex items-end justify-between">
                <span className="text-2xl font-semibold font-mono text-white">{kpi.value}</span>
                <div className={`flex items-center gap-0.5 text-xs font-medium ${kpi.up ? 'text-[#24A148]' : 'text-[#DA1E28]'}`}>
                  {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {kpi.change}
                </div>
              </div>
              <span className="text-[10px] text-[#3A4255]">{kpi.desc}</span>
            </div>
          ))}
        </motion.div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Monthly Completions */}
          <motion.div variants={itemVariants}>
            <Card padding="none" className="overflow-hidden">
              <CardHeader className="px-5 pt-5 pb-3">
                <div>
                  <CardTitle>Monthly Goal Completions</CardTitle>
                  <CardDescription>Completed vs total goals per month</CardDescription>
                </div>
              </CardHeader>
              <div className="px-3 pb-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CHART_DATA.monthlyCompletion} barGap={3} barSize={14} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1D2533" vertical={false} />
                    <XAxis dataKey="month" tick={{ fill: '#5A6478', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5A6478', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="total" name="Total" fill="#242C38" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="completed" name="Completed" fill="#0F62FE" radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Team Progress Comparison */}
          <motion.div variants={itemVariants}>
            <Card padding="none" className="overflow-hidden">
              <CardHeader className="px-5 pt-5 pb-3">
                <div>
                  <CardTitle>Team Progress Breakdown</CardTitle>
                  <CardDescription>Average objective progress by team</CardDescription>
                </div>
              </CardHeader>
              <div className="px-3 pb-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={COMPLETION_BY_TEAM} barSize={28} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1D2533" vertical={false} />
                    <XAxis dataKey="team" tick={{ fill: '#5A6478', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5A6478', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="progress" name="Progress" radius={[3, 3, 0, 0]}>
                      {COMPLETION_BY_TEAM.map((entry, i) => (
                        <Cell key={i} fill={entry.color} fillOpacity={0.85} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* Individual On-Time Rate */}
          <motion.div variants={itemVariants}>
            <Card padding="none" className="overflow-hidden">
              <CardHeader className="px-5 pt-5 pb-3">
                <div>
                  <CardTitle>Individual On-Time Rate</CardTitle>
                  <CardDescription>% of goals completed by deadline</CardDescription>
                </div>
              </CardHeader>
              <div className="px-3 pb-4 h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={INDIVIDUAL_PERFORMANCE} barSize={20} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1D2533" vertical={false} />
                    <XAxis dataKey="name" tick={{ fill: '#5A6478', fontSize: 10 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: '#5A6478', fontSize: 10 }} axisLine={false} tickLine={false} unit="%" domain={[60, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="onTime" name="On-Time %" radius={[2, 2, 0, 0]}>
                      {INDIVIDUAL_PERFORMANCE.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.onTime >= 90 ? '#24A148' : entry.onTime >= 80 ? '#0F62FE' : '#F1C21B'}
                          fillOpacity={0.85}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </motion.div>

          {/* AI Distribution */}
          <motion.div variants={itemVariants}>
            <Card padding="none" className="overflow-hidden">
              <CardHeader className="px-5 pt-5 pb-3">
                <div>
                  <CardTitle>AI-Predicted Q3 Outcome</CardTitle>
                  <CardDescription>Probabilistic forecast for quarter close</CardDescription>
                </div>
                <Badge variant="purple" size="sm">
                  <Sparkles size={9} />
                  AI
                </Badge>
              </CardHeader>
              <div className="flex items-center px-4 pb-4 gap-4 h-52">
                <ResponsiveContainer width="50%" height="100%">
                  <PieChart>
                    <Pie
                      data={CHART_DATA.aiInsights}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={72}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {CHART_DATA.aiInsights.map((entry, i) => (
                        <Cell key={i} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="bg-[#1B222D] border border-[#242C38] rounded-lg px-3 py-2 text-xs">
                            <p style={{ color: payload[0].payload.color }} className="font-mono">
                              {payload[0].payload.label}: {payload[0].value}%
                            </p>
                          </div>
                        ) : null
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-3">
                  {CHART_DATA.aiInsights.map((d) => (
                    <div key={d.label} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                      <span className="text-xs text-[#A8B3C5]">{d.label}</span>
                      <span className="ml-auto text-xs font-mono text-white">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* AI Predictions */}
        <motion.div variants={itemVariants}>
          <Card padding="none">
            <CardHeader className="px-5 pt-5 pb-4 border-b border-[#1D2533]">
              <div>
                <CardTitle>AI Predictions & Recommendations</CardTitle>
                <CardDescription>Model-generated insights based on current trajectory</CardDescription>
              </div>
              <Badge variant="purple" size="sm">
                <Sparkles size={9} className="mr-1" />
                Powered by Ledger AI
              </Badge>
            </CardHeader>
            <div className="flex flex-col divide-y divide-[#1D2533]">
              {AI_PREDICTIONS.map((pred) => (
                <div key={pred.id} className="flex items-start gap-4 px-5 py-4 hover:bg-[#1D2533] transition-colors">
                  <div
                    className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${
                      pred.type === 'success' ? 'bg-[#24A148]' : pred.type === 'danger' ? 'bg-[#DA1E28]' : 'bg-[#F1C21B]'
                    }`}
                  />
                  <p className="flex-1 text-xs text-[#A8B3C5] leading-relaxed">{pred.text}</p>
                  <Badge
                    variant={pred.confidence === 'high' ? 'success' : 'warning'}
                    size="sm"
                  >
                    {pred.confidence} conf.
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>
    </>
  )
}
