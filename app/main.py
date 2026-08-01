import os
from fastapi import FastAPI, Depends, HTTPException, Response, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from app.config import settings
from app.database import get_db, engine, Base
from app.seed_data import seed_database
from app.models.db_models import Person, Commitment, VerificationEvent, UserSession
from app.models.schemas import (
    LoginRequest, UserSessionResponse, TeamMemberCreate,
    ExtractRequest, ExtractionResponse, VerificationRequest,
    ScoreBreakdown, TeamScoreBreakdown, AgendaResponse, NudgeResponse,
    RecoveryPlan, ExecutiveReport
)
from app.services.extractor import extract_commitments_from_text
from app.services.verifier import verify_commitment_against_github
from app.services.scorer import calculate_person_health_score, calculate_team_health_score
from app.services.generator import generate_standup_agenda, generate_slack_nudge
from app.services.recovery import generate_ai_recovery_plan
from app.services.pdf_report import generate_executive_pdf_report

# Initialize Database Schema & Seed Data on Startup
Base.metadata.create_all(bind=engine)
seed_database()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="The AI co-worker that checks whether commitments actually happened — not what an AI thinks about them.",
    version="2.6.0"
)

@app.get("/")
def root_status():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "tagline": "The AI co-worker that checks whether commitments actually happened — not what an AI thinks about them.",
        "ai_engine": "IBM Granite 3-8B (watsonx.ai) + Groq Fallback",
        "verifier_engine": "Deterministic GitHub REST API Evidence Engine",
        "active_keys": {
            "watsonx_configured": bool(settings.WATSONX_APIKEY and settings.WATSONX_PROJECT_ID),
            "groq_configured": bool(settings.GROQ_API_KEY),
            "openai_configured": bool(settings.OPENAI_API_KEY),
            "github_pat_configured": bool(settings.GITHUB_PAT)
        }
    }

# ---------------------------------------------------------------------------
# 0. API Keys & Workspace Configuration Endpoints
# ---------------------------------------------------------------------------
@app.post("/config/keys", tags=["0. Authentication & Configuration"])
def update_api_keys_endpoint(keys: Dict[str, str] = Body(...)):
    """Dynamically updates active LLM & GitHub API keys in memory and persists them to .env."""
    if "WATSONX_APIKEY" in keys and keys["WATSONX_APIKEY"].strip():
        settings.WATSONX_APIKEY = keys["WATSONX_APIKEY"].strip()
    if "WATSONX_PROJECT_ID" in keys and keys["WATSONX_PROJECT_ID"].strip():
        settings.WATSONX_PROJECT_ID = keys["WATSONX_PROJECT_ID"].strip()
    if "GROQ_API_KEY" in keys and keys["GROQ_API_KEY"].strip():
        settings.GROQ_API_KEY = keys["GROQ_API_KEY"].strip()
    if "OPENAI_API_KEY" in keys and keys["OPENAI_API_KEY"].strip():
        settings.OPENAI_API_KEY = keys["OPENAI_API_KEY"].strip()
    if "GITHUB_PAT" in keys and keys["GITHUB_PAT"].strip():
        settings.GITHUB_PAT = keys["GITHUB_PAT"].strip()
    if "DEFAULT_GITHUB_REPO" in keys and keys["DEFAULT_GITHUB_REPO"].strip():
        settings.DEFAULT_GITHUB_REPO = keys["DEFAULT_GITHUB_REPO"].strip()

    # Persist to .env file
    env_content = f"""WATSONX_APIKEY={settings.WATSONX_APIKEY}
WATSONX_PROJECT_ID={settings.WATSONX_PROJECT_ID}
WATSONX_URL={settings.WATSONX_URL}
GRANITE_MODEL_ID={settings.GRANITE_MODEL_ID}
GROQ_API_KEY={settings.GROQ_API_KEY}
GROQ_MODEL={settings.GROQ_MODEL}
OPENAI_API_KEY={settings.OPENAI_API_KEY}
OPENAI_MODEL={settings.OPENAI_MODEL}
GITHUB_PAT={settings.GITHUB_PAT}
DEFAULT_GITHUB_REPO={settings.DEFAULT_GITHUB_REPO}
"""
    try:
        with open(".env", "w", encoding="utf-8") as f:
            f.write(env_content)
    except Exception as e:
        print(f"[Config Save Warning] Failed to write to .env file: {e}")

    return {
        "status": "success",
        "message": "API keys updated and saved to .env permanently!",
        "active_keys": {
            "watsonx_configured": bool(settings.WATSONX_APIKEY and settings.WATSONX_PROJECT_ID),
            "groq_configured": bool(settings.GROQ_API_KEY),
            "openai_configured": bool(settings.OPENAI_API_KEY),
            "github_pat_configured": bool(settings.GITHUB_PAT)
        }
    }

@app.post("/auth/login", response_model=UserSessionResponse, tags=["0. Authentication & Configuration"])
def login_user_endpoint(req: LoginRequest, db: Session = Depends(get_db)):
    sess = UserSession(
        email=req.email,
        name=req.name,
        role=req.role,
        workspace_name=req.workspace_name
    )
    db.add(sess)
    db.commit()
    db.refresh(sess)
    
    person = db.query(Person).filter(Person.email == req.email).first()
    if not person:
        p_name = req.name
        gh = req.email.split("@")[0]
        p = Person(name=p_name, email=req.email, role=req.role, github_username=gh, workspace_id=req.workspace_name)
        db.add(p)
        db.commit()

    return UserSessionResponse(
        session_id=sess.id,
        email=sess.email,
        name=sess.name,
        role=sess.role,
        workspace_name=sess.workspace_name,
        created_at=sess.created_at.strftime("%Y-%m-%d %H:%M:%S")
    )

@app.post("/team/members", tags=["0. Authentication & Configuration"])
def add_team_member_endpoint(req: TeamMemberCreate, db: Session = Depends(get_db)):
    p = Person(
        name=req.name,
        email=req.email,
        role=req.role,
        github_username=req.github_username or req.name.lower().replace(" ", "-"),
        jira_username=req.jira_username
    )
    db.add(p)
    db.commit()
    db.refresh(p)
    return {"status": "success", "member_id": p.id, "name": p.name, "github_username": p.github_username}

@app.get("/team/members", tags=["0. Authentication & Configuration"])
def list_team_members_endpoint(db: Session = Depends(get_db)):
    people = db.query(Person).all()
    return [{"id": p.id, "name": p.name, "email": p.email, "role": p.role, "github_username": p.github_username} for p in people]

# ---------------------------------------------------------------------------
# 1. Extraction Endpoint (AI Component)
# ---------------------------------------------------------------------------
@app.post("/extract", response_model=ExtractionResponse, tags=["1. Extraction (AI)"])
def extract_commitments_endpoint(request: ExtractRequest):
    if not request.raw_text.strip():
        raise HTTPException(status_code=400, detail="Standup text cannot be empty.")
    return extract_commitments_from_text(request.raw_text)

# ---------------------------------------------------------------------------
# 2. Verification Endpoints (Non-AI Evidence Component)
# ---------------------------------------------------------------------------
@app.post("/verify/{commitment_id}", tags=["2. Verification (Non-AI Evidence)"])
def verify_commitment_endpoint(
    commitment_id: str,
    request: Optional[VerificationRequest] = None,
    db: Session = Depends(get_db)
):
    repo = request.repo_name if request else None
    result = verify_commitment_against_github(db, commitment_id, repo=repo)
    if result.get("status") == "error":
        raise HTTPException(status_code=404, detail=result.get("message"))
    return result

@app.post("/verify/all", tags=["2. Verification (Non-AI Evidence)"])
def verify_all_commitments_endpoint(
    request: Optional[VerificationRequest] = None,
    db: Session = Depends(get_db)
):
    commitments = db.query(Commitment).all()
    results = []
    repo = request.repo_name if request else None
    for c in commitments:
        res = verify_commitment_against_github(db, c.id, repo=repo)
        results.append(res)
    return {
        "verified_count": len(results),
        "details": results,
        "engine": "Deterministic Non-AI Evidence Engine"
    }

# ---------------------------------------------------------------------------
# 3. AI Recovery Planner Endpoint (Feature 1)
# ---------------------------------------------------------------------------
@app.get("/recover/{commitment_id}", response_model=RecoveryPlan, tags=["3. AI Recovery Planner (AI)"])
def get_ai_recovery_plan_endpoint(commitment_id: str, db: Session = Depends(get_db)):
    try:
        return generate_ai_recovery_plan(db, commitment_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

# ---------------------------------------------------------------------------
# 4. Scoring Endpoints (Non-AI Component)
# ---------------------------------------------------------------------------
@app.get("/score/{person_id}", response_model=ScoreBreakdown, tags=["4. Scoring (Non-AI)"])
def get_person_health_score(person_id: str, db: Session = Depends(get_db)):
    try:
        return calculate_person_health_score(db, person_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@app.get("/team-score", response_model=TeamScoreBreakdown, tags=["4. Scoring (Non-AI)"])
def get_team_health_score_endpoint(db: Session = Depends(get_db)):
    return calculate_team_health_score(db)

# ---------------------------------------------------------------------------
# 5. Executive PDF Report Endpoint (Feature 3)
# ---------------------------------------------------------------------------
@app.get("/report/pdf", tags=["5. Executive Decision Report"])
def export_executive_pdf_report_endpoint(db: Session = Depends(get_db)):
    pdf_bytes = generate_executive_pdf_report(db)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=ledger_execution_intelligence_report.pdf"}
    )

# ---------------------------------------------------------------------------
# Data CRUD Helper Endpoints
# ---------------------------------------------------------------------------
@app.get("/commitments", tags=["Data Management"])
def list_commitments(db: Session = Depends(get_db)):
    commitments = db.query(Commitment).all()
    output = []
    for c in commitments:
        owner_name = c.owner.name if c.owner else "Unassigned"
        output.append({
            "id": c.id,
            "owner_id": c.owner_id,
            "owner_name": owner_name,
            "task": c.task,
            "raw_text": c.raw_text,
            "deadline": c.deadline,
            "deadline_inferred": c.deadline_inferred,
            "linked_ref": c.linked_ref,
            "status": c.status,
            "verification_events_count": len(c.verification_events),
            "created_at": c.created_at.strftime("%Y-%m-%d %H:%M:%S") if c.created_at else None
        })
    return output

@app.post("/commitments/save", tags=["Data Management"])
def save_extracted_commitments(commitments: List[Dict[str, Any]], db: Session = Depends(get_db)):
    saved_ids = []
    default_person = db.query(Person).first()
    
    for item in commitments:
        owner_name = item.get("owner", "Unassigned")
        person = db.query(Person).filter(Person.name.ilike(f"%{owner_name}%")).first()
        if not person:
            person = default_person
            
        c = Commitment(
            owner_id=person.id if person else None,
            task=item.get("task", "Unspecified task"),
            raw_text=item.get("raw_text", ""),
            deadline=item.get("deadline", "2026-08-07"),
            deadline_inferred=item.get("deadline_inferred", False),
            linked_ref=item.get("linked_ref"),
            status="open"
        )
        db.add(c)
        db.commit()
        db.refresh(c)
        saved_ids.append(c.id)
        
    return {"status": "success", "saved_commitments_count": len(saved_ids), "ids": saved_ids}
