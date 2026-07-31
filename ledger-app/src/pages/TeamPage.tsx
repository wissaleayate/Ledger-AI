import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Search, Filter, Mail, MoreHorizontal, TrendingUp,
  Award, Flame, UserPlus, ChevronRight,
} from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Avatar, AvatarGroup } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { ProgressBar } from '@/components/ui/Progress'
import { Tabs } from '@/components/ui/Tabs'
import { MOCK_USERS, MOCK_TEAMS } from '@/data/mock'
import type { User, Team } from '@/types'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.04 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

const roleMap: Record<string, { label: string; variant: 'blue' | 'purple' | 'default' | 'cyan' }> = {
  admin: { label: 'Admin', variant: 'blue' },
  manager: { label: 'Manager', variant: 'purple' },
  member: { label: 'Member', variant: 'default' },
  viewer: { label: 'Viewer', variant: 'cyan' },
}

function MemberCard({ user }: { user: User }) {
  const role = roleMap[user.role]
  const completionRate = Math.round((user.metrics.goalsCompleted / user.metrics.goalsTotal) * 100)
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ y: -2 }}
      className="bg-[#1B222D] border border-[#242C38] rounded-lg p-4 flex flex-col gap-4 cursor-pointer group hover:border-[#2E3848] transition-all"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <Avatar name={user.name} size="lg" showStatus status="online" />
          <div>
            <p className="text-sm font-semibold text-white leading-tight">{user.name}</p>
            <p className="text-xs text-[#5A6478]">{user.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={role.variant} size="sm">{role.label}</Badge>
          <button className="text-[#5A6478] hover:text-white opacity-0 group-hover:opacity-100 transition-all">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center gap-0.5 p-2 bg-[#141A22] rounded-[4px]">
          <span className="text-sm font-semibold font-mono text-white">{user.metrics.goalsCompleted}</span>
          <span className="text-[10px] text-[#5A6478]">Completed</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 p-2 bg-[#141A22] rounded-[4px]">
          <span className="text-sm font-semibold font-mono text-white">{user.metrics.onTimeRate}%</span>
          <span className="text-[10px] text-[#5A6478]">On-time</span>
        </div>
        <div className="flex flex-col items-center gap-0.5 p-2 bg-[#141A22] rounded-[4px]">
          <div className="flex items-center gap-0.5">
            <Flame size={11} className="text-[#F1C21B]" />
            <span className="text-sm font-semibold font-mono text-[#F1C21B]">{user.metrics.streak}</span>
          </div>
          <span className="text-[10px] text-[#5A6478]">Day streak</span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-[#5A6478]">Goal Completion</span>
          <span className="text-[11px] font-mono text-[#A8B3C5]">{user.metrics.goalsCompleted}/{user.metrics.goalsTotal}</span>
        </div>
        <ProgressBar value={completionRate} animated={false} />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-[#1D2533]">
        <span className="text-[10px] text-[#3A4255]">{user.department}</span>
        <span className="text-[10px] text-[#3A4255]">{user.email}</span>
      </div>
    </motion.div>
  )
}

function TeamCard({ team }: { team: Team }) {
  const lead = MOCK_USERS.find((u) => u.id === team.leadId)
  const members = MOCK_USERS.filter((u) => team.memberIds.includes(u.id))
  return (
    <motion.div
      variants={itemVariants}
      className="bg-[#1B222D] border border-[#242C38] rounded-lg p-4 flex flex-col gap-3 cursor-pointer hover:border-[#2E3848] transition-all"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-[4px] flex items-center justify-center text-xs font-bold text-white"
          style={{ backgroundColor: team.color }}
        >
          {team.name[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-white">{team.name}</p>
          <p className="text-xs text-[#5A6478] truncate">{team.description}</p>
        </div>
        <ChevronRight size={14} className="text-[#3A4255]" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-[#5A6478]">Lead</span>
          <span className="text-xs font-medium text-[#A8B3C5]">{lead?.name.split(' ')[0]}</span>
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] text-[#5A6478]">Members</span>
          <AvatarGroup names={members.map((m) => m.name)} size="xs" />
        </div>
        <div className="flex flex-col items-end gap-0.5">
          <span className="text-[10px] text-[#5A6478]">Objectives</span>
          <span className="text-xs font-mono text-white">{team.objectives.length}</span>
        </div>
      </div>
    </motion.div>
  )
}

export function TeamPage() {
  const [search, setSearch] = useState('')
  const [tab, setTab] = useState('members')

  const filtered = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <TopBar
        title="Team"
        description={`${MOCK_USERS.length} members · 4 teams`}
        actions={
          <Button variant="secondary" size="sm" icon={<UserPlus size={13} />}>
            Invite
          </Button>
        }
      />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 flex flex-col gap-6"
      >
        {/* Toolbar */}
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Tabs
            tabs={[
              { id: 'members', label: 'Members', count: MOCK_USERS.length },
              { id: 'teams', label: 'Teams', count: MOCK_TEAMS.length },
            ]}
            active={tab}
            onChange={setTab}
          />
          <div className="flex-1" />
          <div className="w-52">
            <Input
              placeholder="Search members..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              icon={<Search size={13} />}
            />
          </div>
          <Button variant="secondary" size="sm" icon={<Filter size={13} />}>
            Filter
          </Button>
        </motion.div>

        {tab === 'members' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filtered.map((user) => (
              <MemberCard key={user.id} user={user} />
            ))}
          </motion.div>
        )}

        {tab === 'teams' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {MOCK_TEAMS.map((team) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </motion.div>
        )}
      </motion.div>
    </>
  )
}
