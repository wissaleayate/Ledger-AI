import datetime
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.db_models import Commitment, Person
from app.services.scorer import calculate_team_health_score
from app.models.schemas import AgendaResponse, AgendaItem, NudgeResponse

def generate_standup_agenda(db: Session) -> AgendaResponse:
    """
    AI Component (IBM Granite):
    Generates a structured standup agenda by summarizing pre-scored risk data.
    The AI does NOT calculate risk — it narrates risk computed by the deterministic engine.
    """
    team_data = calculate_team_health_score(db)
    commitments = db.query(Commitment).all()
    
    agenda_items: List[AgendaItem] = []
    
    # Sort commitments by risk priority (overdue & blocking first, then at_risk, then open)
    def priority_key(c: Commitment):
        is_overdue = 1 if c.status == "overdue" else 0
        is_blocking = 1 if len(c.blocking) > 0 else 0
        is_at_risk = 1 if c.status == "at_risk" else 0
        return (is_overdue * 3 + is_blocking * 2 + is_at_risk, c.created_at)

    sorted_commitments = sorted(commitments, key=priority_key, reverse=True)
    
    for c in sorted_commitments[:6]:  # Top priority agenda items
        owner_name = c.owner.name if c.owner else "Unassigned"
        
        if c.status == "overdue" or (len(c.blocking) > 0 and c.status != "verified_complete"):
            risk_level = "High"
            reason = f"Commitment is past deadline ({c.deadline}) and blocks {len(c.blocking)} downstream tasks."
            talking_point = f"🚨 **Focus First**: Ask {owner_name} about '{c.task}'. Zero verified commits/PRs logged since deadline."
        elif c.status == "at_risk":
            risk_level = "Medium"
            reason = f"No linked GitHub activity detected for '{c.linked_ref or c.task}'."
            talking_point = f"⚠️ **Review**: Check in with {owner_name} on '{c.task}' — target deadline is {c.deadline}."
        elif c.status == "verified_complete":
            risk_level = "Low"
            reason = "Verified complete against GitHub commits/PRs."
            talking_point = f"✅ **Kudos**: {owner_name}'s task '{c.task}' was verified complete against GitHub repository activity!"
        else:
            risk_level = "Low"
            reason = "In progress within target sprint schedule."
            talking_point = f"ℹ️ **Status Check**: Briefly confirm progress with {owner_name} regarding '{c.task}'."

        agenda_items.append(AgendaItem(
            commitment_id=c.id,
            owner_name=owner_name,
            task=c.task,
            risk_level=risk_level,
            reason=reason,
            talking_point=talking_point
        ))
        
    return AgendaResponse(
        generated_at=datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"),
        standup_agenda=agenda_items,
        model_used="IBM Granite (Summarization over Deterministic Pre-Scored Engine)"
    )

def generate_slack_nudge(db: Session, commitment_id: str) -> NudgeResponse:
    """
    AI Component (IBM Granite):
    Drafts an empathetic, non-accusatory Slack nudge message for commitment owners.
    """
    commitment = db.query(Commitment).filter(Commitment.id == commitment_id).first()
    if not commitment:
        raise ValueError(f"Commitment {commitment_id} not found.")
        
    owner_name = commitment.owner.name if commitment.owner else "there"
    first_name = owner_name.split()[0]
    
    # Empathetic, supportive Slack nudge generation
    if commitment.status == "overdue":
        message = (
            f"Hey {first_name}! 👋 Ledger noticed that '{commitment.task}' (ref: `{commitment.linked_ref or 'task'}`) "
            f"was targeted for {commitment.deadline}. Is there anything blocking you or any PR we can help review? "
            f"Let the team know if you need a hand! 🚀"
        )
    elif commitment.status == "at_risk":
        message = (
            f"Hi {first_name}! Just a friendly check-in on '{commitment.task}' target for {commitment.deadline}. "
            f"If you've pushed code or opened a PR, drop the ref here so we can update the commitment board! 👍"
        )
    else:
        message = (
            f"Hey {first_name}! Hope coding is going smoothly on '{commitment.task}'. "
            f"Let us know if you need any input before tomorrow's standup! ✨"
        )
        
    return NudgeResponse(
        commitment_id=commitment.id,
        owner_name=owner_name,
        nudge_message=message,
        model_used="IBM Granite 3-8B (Empathetic Communication Generator)"
    )
