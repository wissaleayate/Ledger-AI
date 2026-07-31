import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User, Bell, Shield, Zap, CreditCard, Key, Globe,
  ChevronRight, Check, ToggleLeft, ToggleRight,
} from 'lucide-react'
import { TopBar } from '@/components/layout/TopBar'
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { Avatar } from '@/components/ui/Avatar'
import { LineTabs } from '@/components/ui/Tabs'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
}
const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.2 } },
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={cn(
        'w-8 h-4 rounded-full relative transition-colors duration-200 cursor-pointer',
        enabled ? 'bg-[#0F62FE]' : 'bg-[#242C38]'
      )}
    >
      <span
        className={cn(
          'absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform duration-200',
          enabled ? 'translate-x-4' : 'translate-x-0.5'
        )}
      />
    </button>
  )
}

interface SettingRowProps {
  label: string
  description?: string
  children?: React.ReactNode
  border?: boolean
}

function SettingRow({ label, description, children, border = true }: SettingRowProps) {
  return (
    <div className={cn('flex items-center justify-between py-3', border && 'border-b border-[#1D2533] last:border-0')}>
      <div className="flex flex-col gap-0.5">
        <span className="text-xs font-medium text-white">{label}</span>
        {description && <span className="text-[11px] text-[#5A6478]">{description}</span>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  )
}

export function SettingsPage() {
  const [tab, setTab] = useState('profile')
  const [notifications, setNotifications] = useState({
    emailDigest: true,
    slackUpdates: true,
    atRiskAlerts: true,
    teamUpdates: false,
    aiInsights: true,
    weeklyReport: true,
  })

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <>
      <TopBar title="Settings" description="Account and workspace preferences" />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 flex flex-col gap-5 max-w-3xl"
      >
        {/* Tabs */}
        <motion.div variants={itemVariants}>
          <LineTabs
            tabs={[
              { id: 'profile', label: 'Profile' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'workspace', label: 'Workspace' },
              { id: 'integrations', label: 'Integrations' },
              { id: 'billing', label: 'Billing' },
            ]}
            active={tab}
            onChange={setTab}
          />
        </motion.div>

        {tab === 'profile' && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
            {/* Avatar */}
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-center gap-4">
                  <Avatar name="Sarah Chen" size="xl" />
                  <div className="flex flex-col gap-1.5">
                    <p className="text-sm font-semibold text-white">Sarah Chen</p>
                    <p className="text-xs text-[#5A6478]">sarah.chen@ledger.ai</p>
                    <Button variant="secondary" size="sm">Change Photo</Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="First Name" defaultValue="Sarah" />
                  <Input label="Last Name" defaultValue="Chen" />
                  <Input label="Email" defaultValue="sarah.chen@ledger.ai" type="email" />
                  <Input label="Job Title" defaultValue="VP of Engineering" />
                  <Input label="Department" defaultValue="Engineering" />
                  <Input label="Timezone" defaultValue="America/New_York" />
                </div>
                <div className="flex justify-end mt-4">
                  <Button variant="primary" size="sm">Save Changes</Button>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Security</CardTitle>
                </CardHeader>
                <div className="flex flex-col">
                  <SettingRow label="Password" description="Last changed 3 months ago">
                    <Button variant="secondary" size="sm" icon={<Key size={12} />}>Change</Button>
                  </SettingRow>
                  <SettingRow label="Two-Factor Authentication" description="Add an extra layer of security">
                    <Button variant="outline" size="sm" icon={<Shield size={12} />}>Enable 2FA</Button>
                  </SettingRow>
                  <SettingRow label="Active Sessions" description="2 devices currently logged in" border={false}>
                    <Button variant="ghost" size="sm">Manage</Button>
                  </SettingRow>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {tab === 'notifications' && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Email Notifications</CardTitle>
                  <CardDescription>Control which emails you receive</CardDescription>
                </CardHeader>
                <div className="flex flex-col">
                  <SettingRow label="Weekly digest" description="Summary of team progress every Monday">
                    <Toggle enabled={notifications.emailDigest} onChange={() => toggleNotif('emailDigest')} />
                  </SettingRow>
                  <SettingRow label="At-risk alerts" description="Immediate notification when an objective falls behind">
                    <Toggle enabled={notifications.atRiskAlerts} onChange={() => toggleNotif('atRiskAlerts')} />
                  </SettingRow>
                  <SettingRow label="Weekly reports" description="AI-generated performance report every Friday" border={false}>
                    <Toggle enabled={notifications.weeklyReport} onChange={() => toggleNotif('weeklyReport')} />
                  </SettingRow>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Integrations</CardTitle>
                  <CardDescription>Notification channels</CardDescription>
                </CardHeader>
                <div className="flex flex-col">
                  <SettingRow label="Slack updates" description="Post updates to connected Slack channels">
                    <Toggle enabled={notifications.slackUpdates} onChange={() => toggleNotif('slackUpdates')} />
                  </SettingRow>
                  <SettingRow label="Team updates" description="Receive updates when teammates post progress" border={false}>
                    <Toggle enabled={notifications.teamUpdates} onChange={() => toggleNotif('teamUpdates')} />
                  </SettingRow>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>AI Insights</CardTitle>
                  <CardDescription>Ledger AI automated recommendations</CardDescription>
                </CardHeader>
                <div className="flex flex-col">
                  <SettingRow label="AI insight notifications" description="Receive AI-generated recommendations and predictions" border={false}>
                    <Toggle enabled={notifications.aiInsights} onChange={() => toggleNotif('aiInsights')} />
                  </SettingRow>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {tab === 'workspace' && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Workspace</CardTitle>
                  <CardDescription>Acme Inc. workspace settings</CardDescription>
                </CardHeader>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <Input label="Workspace Name" defaultValue="Acme Inc." />
                  <Input label="Workspace URL" defaultValue="acme.ledger.ai" />
                  <Input label="Default Quarter" defaultValue="Q3 2026" />
                  <Input label="Fiscal Year Start" defaultValue="January" />
                </div>
                <div className="flex justify-end">
                  <Button variant="primary" size="sm">Save</Button>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Permissions</CardTitle>
                  <CardDescription>Default role and access settings</CardDescription>
                </CardHeader>
                <div className="flex flex-col">
                  <SettingRow label="New member default role" description="Role assigned to newly invited members">
                    <Badge variant="default" size="sm">Member</Badge>
                  </SettingRow>
                  <SettingRow label="Guest access" description="Allow view-only access for external stakeholders">
                    <Toggle enabled={false} onChange={() => {}} />
                  </SettingRow>
                  <SettingRow label="Public profiles" description="Allow team members to have public profile pages" border={false}>
                    <Toggle enabled={true} onChange={() => {}} />
                  </SettingRow>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {tab === 'integrations' && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
            {[
              { name: 'Slack', desc: 'Post goal updates and digests to Slack channels', connected: true, color: '#611f69' },
              { name: 'GitHub', desc: 'Link pull requests and issues to key results', connected: true, color: '#24292e' },
              { name: 'Jira', desc: 'Sync tasks and sprints as key results', connected: false, color: '#0052cc' },
              { name: 'Linear', desc: 'Connect Linear projects to objectives', connected: false, color: '#5E6AD2' },
              { name: 'Google Workspace', desc: 'Sync with Google Calendar and Docs', connected: false, color: '#4285F4' },
            ].map((int) => (
              <motion.div key={int.name} variants={itemVariants}>
                <div className="flex items-center gap-4 bg-[#1B222D] border border-[#242C38] rounded-lg px-4 py-3 hover:border-[#2E3848] transition-colors">
                  <div
                    className="w-8 h-8 rounded-[4px] flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ backgroundColor: int.color }}
                  >
                    {int.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white">{int.name}</p>
                    <p className="text-[11px] text-[#5A6478]">{int.desc}</p>
                  </div>
                  {int.connected ? (
                    <Badge variant="success" size="sm" dot>Connected</Badge>
                  ) : (
                    <Button variant="secondary" size="sm">Connect</Button>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {tab === 'billing' && (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
            <motion.div variants={itemVariants}>
              <Card>
                <div className="flex items-start justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white">Team Pro Plan</span>
                      <Badge variant="blue" size="sm">Active</Badge>
                    </div>
                    <p className="text-xs text-[#5A6478]">$24 / user / month · Billed annually</p>
                    <p className="text-xs text-[#5A6478]">6 seats · Next renewal Aug 1, 2027</p>
                  </div>
                  <Button variant="secondary" size="sm" icon={<CreditCard size={12} />}>Manage</Button>
                </div>
              </Card>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle>Usage</CardTitle>
                </CardHeader>
                <div className="flex flex-col gap-3">
                  {[
                    { label: 'Team Members', used: 6, max: 10 },
                    { label: 'Active Objectives', used: 5, max: 50 },
                    { label: 'AI Queries (this month)', used: 342, max: 1000 },
                  ].map((u) => (
                    <div key={u.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#A8B3C5]">{u.label}</span>
                        <span className="font-mono text-[#5A6478]">{u.used} / {u.max}</span>
                      </div>
                      <div className="h-1 bg-[#242C38] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#0F62FE]"
                          style={{ width: `${(u.used / u.max) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </>
  )
}
