from typing import List, Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

class LoginRequest(BaseModel):
    email: str
    name: str
    role: str = "Engineering Lead"
    workspace_name: str = "Acme Corp"

class UserSessionResponse(BaseModel):
    session_id: str
    email: str
    name: str
    role: str
    workspace_name: str
    created_at: str

class TeamMemberCreate(BaseModel):
    name: str
    email: str
    role: str = "Developer"
    github_username: Optional[str] = None
    jira_username: Optional[str] = None

class ExtractedCommitmentSchema(BaseModel):
    id: Optional[str] = None
    owner: str = Field(..., description="Name of the person responsible for the commitment")
    task: str = Field(..., description="Short summary of the task committed to")
    raw_text: str = Field(..., description="Exact or near-exact quote from standup notes")
    deadline: Optional[str] = Field(None, description="Deadline in YYYY-MM-DD or descriptive format")
    deadline_inferred: bool = Field(False, description="True if deadline was inferred by AI")
    linked_ref: Optional[str] = Field(None, description="Ticket reference or branch keyword if mentioned, e.g. AUTH-142")
    depends_on: List[str] = Field(default_factory=list, description="IDs or tasks this depends on")
    blocks: List[str] = Field(default_factory=list, description="IDs or tasks blocked by this commitment")
    confidence_score: int = Field(92, description="Extraction confidence score 0-100%")

class ExtractionResponse(BaseModel):
    commitments: List[ExtractedCommitmentSchema]
    raw_standup_text: str
    extraction_status: str = "success"
    model_used: str = "IBM Granite 3-8B (watsonx.ai)"

class ExtractRequest(BaseModel):
    raw_text: str

class VerificationRequest(BaseModel):
    repo_name: Optional[str] = None
    since_date: Optional[str] = None

class EvidencePayload(BaseModel):
    commits_count: int
    matched_commit_sha: Optional[str] = None
    files_changed: List[str] = Field(default_factory=list)
    pr_number: Optional[int] = None
    pr_title: Optional[str] = None
    pr_status: Optional[str] = None
    last_activity: str
    matched_keywords: List[str]
    confidence_score: int
    raw_payload: Optional[Any] = None

class VerificationEventSchema(BaseModel):
    id: str
    commitment_id: str
    source: str
    match_type: str
    external_ref: Optional[str]
    event_timestamp: Optional[datetime]
    evidence: Optional[EvidencePayload] = None
    created_at: datetime

    class Config:
        from_attributes = True

class RecoveryPlan(BaseModel):
    commitment_id: str
    task_name: str
    owner_name: str
    current_risk: str  # High | Medium | Low
    reasons: List[str]
    split_tasks: List[str]
    complete_first: str
    assign_review: str
    estimated_days: int
    confidence_score: int
    model_used: str = "IBM Granite 3-8B (AI Recovery Planner)"

class ScoreBreakdown(BaseModel):
    person_id: str
    person_name: str
    health_score: float
    overdue_ratio: float
    avg_days_overdue: float
    blocked_dependency_ratio: float
    early_completion_ratio: float
    total_commitments: int
    open_commitments: int
    overdue_commitments: int
    verified_completed_commitments: int
    at_risk_commitments: int
    formula_explanation: str

class TeamScoreBreakdown(BaseModel):
    team_score: float
    total_people: int
    total_commitments: int
    individual_scores: List[ScoreBreakdown]

class AgendaItem(BaseModel):
    commitment_id: str
    owner_name: str
    task: str
    risk_level: str
    reason: str
    talking_point: str

class AgendaResponse(BaseModel):
    generated_at: str
    standup_agenda: List[AgendaItem]
    model_used: str = "IBM Granite (Summarization over Deterministic Engine)"

class NudgeResponse(BaseModel):
    commitment_id: str
    owner_name: str
    nudge_message: str
    model_used: str = "IBM Granite"

class ExecutiveReport(BaseModel):
    title: str = "Execution Intelligence Report"
    generated_at: str
    team_health_score: float
    total_commitments: int
    verified_commitments: int
    at_risk_commitments: int
    blocked_commitments: int
    ai_recovery_summary: List[str]
    team_recommendation: str
    model_used: str = "IBM Granite & Deterministic Verification Engine"
