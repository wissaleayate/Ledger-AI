import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, Plus, ChevronDown, ChevronRight,
  Target, Calendar, TrendingUp, AlertTriangle, CheckCircle, Clock,
} from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Badge, statusBadgeProps, priorityBadgeProps } from '@/components/ui/Badge'
import { Avatar, AvatarGroup } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProgressBar, CircularProgress } from '@/components/ui/Progress'
import { Tabs } from '@/components/ui/Tabs'
import { MOCK_OBJECTIVES, MOCK_USERS, MOCK_TEAMS } from '@/data/mock'
import type { Objective, Status } from '@/types'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0 },
}

function KeyResultRow({ kr, users }: { kr: Objective['keyResults'][0]; users: typeof MOCK_USERS }) {
  const owner = users.find((u) => u.id === kr.ownerId)
  const pct = Math.min(100, Math.round((kr.current / kr.target) * 100))
  const bp = statusBadgeProps(kr.status)
  return (
    <div className="flex items-center gap-4 py-2.5 pl-10 pr-4 hover:bg-[#1D2533] transition-colors border-b border-[#1D2533] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-[#A8B3C5] leading-tight truncate">{kr.title}</p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <span className="text-[11px] font-mono text-[#5A6478] tabular-nums">
          {kr.current} / {kr.target} {kr.unit}
        </span>
        <div className="w-20">
          <ProgressBar value={pct} animated={false} size="xs" />
        </div>
        <span className="text-[11px] font-mono text-[#A8B3C5] w-8 text-right tabular-nums">{pct}%</span>
        <Badge {...bp} size="sm" />
        {owner && <Avatar name={owner.name} size="xs" />}
      </div>
    </div>
  )
}

function ObjectiveRow({ obj }: { obj: Objective }) {
  const [expanded, setExpanded] = useState(false)
  const owner = MOCK_USERS.find((u) => u.id === obj.ownerId)
  const team = MOCK_TEAMS.find((t) => t.id === obj.teamId)
  const sbp = statusBadgeProps(obj.status)
  const pbp = priorityBadgeProps(obj.priority)

  return (
    <motion.div variants={itemVariants} className="bg-[#1B222D] border border-[#242C38] rounded-lg overflow-hidden">
      {/* Objective Header Row */}
      <div
        className="flex items-center gap-4 px-4 py-3 cursor-pointer hover:bg-[#1D2533] transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <motion.div animate={{ rotate: expanded ? 90 : 0 }} transition={{ duration: 0.15 }}>
          <ChevronRight size={14} className="text-[#3A4255]" />
        </motion.div>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-semibold text-white">{obj.title}</span>
            <Badge {...sbp} size="sm" />
            <Badge {...pbp} size="sm" />
          </div>
          <div className="flex items-center gap-3 text-[10px] text-[#3A4255]">
            <span className="flex items-center gap-1">
              <Target size={10} />
              {obj.quarter}
            </span>
            <span className="flex items-center gap-1">
              <Calendar size={10} />
              Due {obj.dueDate}
            </span>
            {team && (
              <span
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-[3px] text-[10px] font-medium"
                style={{ backgroundColor: `${team.color}18`, color: team.color }}
              >
                {team.name}
              </span>
            )}
            {obj.tags.map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 bg-[#141A22] rounded-[3px] text-[#5A6478]">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Progress + Owner */}
        <div className="flex items-center gap-4 shrink-0">
          <div className="flex items-center gap-2 w-32">
            <ProgressBar value={obj.progress} animated={false} />
            <span className="text-xs font-mono text-[#A8B3C5] tabular-nums w-8 text-right">{obj.progress}%</span>
          </div>
          {owner && (
            <div className="flex items-center gap-1.5">
              <Avatar name={owner.name} size="xs" />
              <span className="text-[11px] text-[#5A6478] hidden xl:block">{owner.name.split(' ')[0]}</span>
            </div>
          )}
          <span className="text-[11px] text-[#3A4255] font-mono">{obj.keyResults.length} KRs</span>
        </div>
      </div>

      {/* Key Results */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-[#1D2533] bg-[#141A22] overflow-hidden"
          >
            {obj.keyResults.map((kr) => (
              <KeyResultRow key={kr.id} kr={kr} users={MOCK_USERS} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const STATUS_FILTERS: { id: string; label: string; status?: Status }[] = [
  { id: 'all', label: 'All' },
  { id: 'on-track', label: 'On Track', status: 'on-track' },
  { id: 'at-risk', label: 'At Risk', status: 'at-risk' },
  { id: 'behind', label: 'Behind', status: 'behind' },
]

export function GoalsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = MOCK_OBJECTIVES.filter((o) => {
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const onTrack = MOCK_OBJECTIVES.filter((o) => o.status === 'on-track').length
  const atRisk = MOCK_OBJECTIVES.filter((o) => o.status === 'at-risk').length
  const behind = MOCK_OBJECTIVES.filter((o) => o.status === 'behind').length

  return (
    <>
      <TopBar
        title="Goals & OKRs"
        description={`Q3 2026 · ${MOCK_OBJECTIVES.length} objectives`}
        actions={
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>
            Filter
          </Button>
        }
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 flex flex-col gap-5"
      >
        {/* Summary row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Total', value: MOCK_OBJECTIVES.length, icon: <Target size={13} />, color: '#0F62FE' },
            { label: 'On Track', value: onTrack, icon: <CheckCircle size={13} />, color: '#24A148' },
            { label: 'At Risk', value: atRisk, icon: <AlertTriangle size={13} />, color: '#F1C21B' },
            { label: 'Behind', value: behind, icon: <TrendingUp size={13} />, color: '#DA1E28' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 bg-[#1B222D] border border-[#242C38] rounded-lg p-3"
            >
              <div
                className="w-7 h-7 rounded-[4px] flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}18`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-lg font-semibold font-mono text-white leading-tight">{stat.value}</p>
                <p className="text-[10px] text-[#5A6478]">{stat.label}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Toolbar */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Tabs
            tabs={STATUS_FILTERS.map((f) => ({
              id: f.id,
              label: f.label,
              count: f.status ? MOCK_OBJECTIVES.filter((o) => o.status === f.status).length : undefined,
            }))}
            active={statusFilter}
            onChange={setStatusFilter}
          />
          <div className="flex-1" />
          <div className="w-52">
            <Input
              placeholder="Search objectives..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={13} />}
            />
          </div>
        </motion.div>

        {/* Objectives List */}
        <motion.div variants={containerVariants} className="flex flex-col gap-2">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-16 text-[#3A4255]">
              <Target size={24} />
              <p className="text-sm">No objectives found</p>
            </div>
          ) : (
            filtered.map((obj) => <ObjectiveRow key={obj.id} obj={obj} />)
          )}
        </motion.div>
      </motion.div>
    </>
  )
}
