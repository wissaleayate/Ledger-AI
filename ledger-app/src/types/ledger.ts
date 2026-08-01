export type Screen = 'home' | 'processing' | 'workspace' | 'recovery' | 'report'

export type ProcessingStage =
  | 'uploading'
  | 'extracting'
  | 'verifying'
  | 'scoring'
  | 'planning'
  | 'complete'

export type CommitmentStatus = 'on-track' | 'at-risk' | 'blocked' | 'completed'
export type Priority = 'critical' | 'high' | 'medium' | 'low'

export interface DroppedFile {
  id: string
  name: string
  size: number
  type: string
}

export interface Commitment {
  id: string
  owner: string
  task: string
  deadline: string
  status: CommitmentStatus
  priority: Priority
  confidence: number
}

export interface GitEvidence {
  commitmentId: string
  commits: number
  pullRequests: number
  lastActivity: string
  matchedKeywords: string[]
  timeline: string
  verificationConfidence: number
}

export interface GraniteAnalysis {
  commitmentId: string
  status: CommitmentStatus
  reason: string
  potentialRisk: string
  recoveryRecommendation: string
  nextCheck: string
  confidence: number
  reasoning?: string
}

export interface RecoveryPlan {
  id: string
  task: string
  risk: string
  dependencies: string[]
  recoveryStrategy: string
  estimatedTime: string
  suggestedOwner: string
  aiConfidence: number
  checklist: { id: string; label: string; done: boolean }[]
  progress: number
  recommendation: string
}

export interface ExecutiveReport {
  generatedAt: string
  overallHealth: number
  totalCommitments: number
  verified: number
  atRisk: number
  blocked: number
  recoverySummary: string
  executiveRecommendation: string
  graniteModelVersion: string
}
