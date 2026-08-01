export type Status = 'on-track' | 'at-risk' | 'behind' | 'completed' | 'not-started'
export type Priority = 'critical' | 'high' | 'medium' | 'low'
export type Role = 'admin' | 'manager' | 'member' | 'viewer'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  department: string
  title: string
  joinedAt: string
  lastActive: string
  metrics: {
    goalsCompleted: number
    goalsTotal: number
    onTimeRate: number
    streak: number
  }
}

export interface KeyResult {
  id: string
  title: string
  current: number
  target: number
  unit: string
  status: Status
  ownerId: string
  dueDate: string
  lastUpdated: string
}

export interface Objective {
  id: string
  title: string
  description: string
  status: Status
  priority: Priority
  ownerId: string
  teamId: string
  quarter: string
  progress: number
  keyResults: KeyResult[]
  createdAt: string
  dueDate: string
  tags: string[]
}

export interface Team {
  id: string
  name: string
  description: string
  leadId: string
  memberIds: string[]
  objectives: string[]
  createdAt: string
  color: string
}

export interface Activity {
  id: string
  type: 'update' | 'comment' | 'status_change' | 'goal_created' | 'achievement'
  userId: string
  targetId: string
  targetType: 'objective' | 'key_result' | 'user'
  message: string
  timestamp: string
  metadata?: Record<string, unknown>
}

export interface Metric {
  label: string
  value: number | string
  change?: number
  changeType?: 'increase' | 'decrease' | 'neutral'
  unit?: string
  trend?: number[]
}

export interface NavItem {
  id: string
  label: string
  path: string
  icon: string
  badge?: number
  children?: NavItem[]
}
