import datetime
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.models.db_models import Person, Commitment, ScoreRecord, VerificationEvent
from app.models.schemas import ScoreBreakdown, TeamScoreBreakdown

def calculate_person_health_score(db: Session, person_id: str) -> ScoreBreakdown:
    """
    Non-AI Scoring Engine:
    Computes deterministic Commitment Health Score (0-100) using pure arithmetic.
    """
    person = db.query(Person).filter(Person.id == person_id).first()
    if not person:
        raise ValueError(f"Person with ID {person_id} does not exist.")
        
    commitments = db.query(Commitment).filter(Commitment.owner_id == person_id).all()
    
    total = len(commitments)
    if total == 0:
        return ScoreBreakdown(
            person_id=person.id,
            person_name=person.name,
            health_score=100.0,
            overdue_ratio=0.0,
            avg_days_overdue=0.0,
            blocked_dependency_ratio=0.0,
            early_completion_ratio=0.0,
            total_commitments=0,
            open_commitments=0,
            overdue_commitments=0,
            verified_completed_commitments=0,
            at_risk_commitments=0,
            formula_explanation="No commitments recorded yet. Baseline score: 100.0"
        )
    
    today_str = datetime.date.today().strftime("%Y-%m-%d")
    today_dt = datetime.datetime.utcnow()
    
    open_count = 0
    overdue_count = 0
    verified_completed_count = 0
    at_risk_count = 0
    early_completion_count = 0
    total_days_overdue = 0.0
    blocked_dependency_count = 0
    
    for c in commitments:
        if c.status == "verified_complete":
            verified_completed_count += 1
            # Check if verified complete before deadline
            if c.deadline and c.deadline >= today_str:
                early_completion_count += 1
        elif c.status == "overdue" or (c.deadline and c.deadline < today_str and c.status != "verified_complete"):
            overdue_count += 1
            if c.deadline:
                try:
                    d_dt = datetime.datetime.strptime(c.deadline, "%Y-%m-%d")
                    diff_days = (today_dt - d_dt).days
                    if diff_days > 0:
                        total_days_overdue += diff_days
                except Exception:
                    total_days_overdue += 2.0
            else:
                total_days_overdue += 2.0
                
            # Check if this overdue item blocks other commitments
            if len(c.blocking) > 0:
                blocked_dependency_count += 1
        elif c.status == "at_risk":
            at_risk_count += 1
            open_count += 1
        else:
            open_count += 1

    # Ratios
    overdue_ratio = overdue_count / total
    avg_days_overdue = (total_days_overdue / overdue_count) if overdue_count > 0 else 0.0
    blocked_dependency_ratio = (blocked_dependency_count / total) if total > 0 else 0.0
    early_completion_ratio = (early_completion_count / total) if total > 0 else 0.0

    # Deterministic Formula:
    # score = 100 - (25 * overdue_ratio) - (15 * avg_days_overdue / 7) - (20 * blocked_dependency_ratio) + (10 * early_completion_ratio)
    score_raw = (
        100.0
        - (25.0 * overdue_ratio)
        - (15.0 * min(avg_days_overdue / 7.0, 4.0))  # capped avg overdue contribution to max 4 weeks
        - (20.0 * blocked_dependency_ratio)
        + (10.0 * early_completion_ratio)
    )

    # Strict clamping between [0, 100]
    final_score = round(max(0.0, min(100.0, score_raw)), 1)

    # Persist score to DB
    sr = ScoreRecord(
        person_id=person.id,
        score=final_score,
        overdue_ratio=overdue_ratio,
        avg_days_overdue=avg_days_overdue,
        blocked_dependency_ratio=blocked_dependency_ratio,
        early_completion_ratio=early_completion_ratio
    )
    db.add(sr)
    db.commit()

    formula_exp = (
        f"Score {final_score}/100 = 100 "
        f"- (25 × {overdue_ratio:.2f} overdue ratio) "
        f"- (15 × {avg_days_overdue:.1f}/7 avg overdue weeks) "
        f"- (20 × {blocked_dependency_ratio:.2f} blocked dependency ratio) "
        f"+ (10 × {early_completion_ratio:.2f} early completion ratio)"
    )

    return ScoreBreakdown(
        person_id=person.id,
        person_name=person.name,
        health_score=final_score,
        overdue_ratio=round(overdue_ratio, 3),
        avg_days_overdue=round(avg_days_overdue, 1),
        blocked_dependency_ratio=round(blocked_dependency_ratio, 3),
        early_completion_ratio=round(early_completion_ratio, 3),
        total_commitments=total,
        open_commitments=open_count,
        overdue_commitments=overdue_count,
        verified_completed_commitments=verified_completed_count,
        at_risk_commitments=at_risk_count,
        formula_explanation=formula_exp
    )

def calculate_team_health_score(db: Session) -> TeamScoreBreakdown:
    """
    Calculates weighted team score based on individual open commitment volume.
    """
    people = db.query(Person).all()
    if not people:
        return TeamScoreBreakdown(
            team_score=100.0,
            total_people=0,
            total_commitments=0,
            individual_scores=[]
        )
        
    individual_scores = []
    total_commitments_team = 0
    weighted_score_sum = 0.0
    
    total_weight = 0
    for p in people:
        score_data = calculate_person_health_score(db, p.id)
        individual_scores.append(score_data)
        
        weight = max(1, score_data.total_commitments)
        weighted_score_sum += score_data.health_score * weight
        total_weight += weight
        total_commitments_team += score_data.total_commitments

    team_score = round(max(0.0, min(100.0, weighted_score_sum / max(1, total_weight))), 1)

    return TeamScoreBreakdown(
        team_score=team_score,
        total_people=len(people),
        total_commitments=total_commitments_team,
        individual_scores=individual_scores
    )
