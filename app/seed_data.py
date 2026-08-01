import os
import datetime
from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models.db_models import Person, Commitment, VerificationEvent, ScoreRecord

def seed_database():
    """Pre-populates the database with realistic demo team data and commitments."""
    # Ensure fresh schema
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if people already exist
    try:
        if db.query(Person).first():
            db.close()
            return
    except Exception:
        # Schema changed, recreate tables
        db.close()
        Base.metadata.drop_all(bind=engine)
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()

    print("[Seed Data] Populating realistic hackathon demo database...")
    
    # 1. Create People
    priya = Person(id="p_priya", name="Priya Sharma", email="priya.sharma@acme.com", role="Engineering Lead", github_username="priya-dev", jira_username="priya.s", workspace_id="Acme Corp")
    alex = Person(id="p_alex", name="Alex Chen", email="alex.chen@acme.com", role="Developer", github_username="alex-chen", jira_username="alex.c", workspace_id="Acme Corp")
    devon = Person(id="p_devon", name="Devon Vance", email="devon.vance@acme.com", role="Developer", github_username="devon-v", jira_username="devon.v", workspace_id="Acme Corp")
    marcus = Person(id="p_marcus", name="Marcus Brody", email="marcus.brody@acme.com", role="Developer", github_username="marcus-b", jira_username="marcus.b", workspace_id="Acme Corp")
    
    db.add_all([priya, alex, devon, marcus])
    db.commit()

    # 2. Create Commitments
    c1 = Commitment(
        id="c_001",
        owner_id=priya.id,
        task="OAuth2 Authentication Refactor",
        raw_text="I'll get the auth refactor done by Monday",
        deadline="2026-07-28",
        deadline_inferred=False,
        linked_ref="AUTH-142",
        status="overdue"
    )
    
    c2 = Commitment(
        id="c_002",
        owner_id=alex.id,
        task="Streamlit Commitment Health Dashboard UI",
        raw_text="Working on the dashboard visual layout components",
        deadline="2026-08-03",
        deadline_inferred=True,
        linked_ref="DASH-88",
        status="verified_complete"
    )

    c3 = Commitment(
        id="c_003",
        owner_id=devon.id,
        task="FastAPI Verification Service REST Endpoints",
        raw_text="I will complete the API endpoints for verifier and scoring",
        deadline="2026-08-01",
        deadline_inferred=False,
        linked_ref="API-204",
        status="at_risk"
    )
    
    c4 = Commitment(
        id="c_004",
        owner_id=marcus.id,
        task="Integration Testing for GitHub Webhook Verifier",
        raw_text="Waiting on auth refactor to complete end-to-end testing",
        deadline="2026-08-05",
        deadline_inferred=True,
        linked_ref="TEST-99",
        status="open"
    )
    
    db.add_all([c1, c2, c3, c4])
    db.commit()

    c4.dependencies.append(c1)
    db.commit()

    # 3. Add initial ground truth Verification Event for c2 (verified complete)
    ve_c2 = VerificationEvent(
        id="ve_001",
        commitment_id=c2.id,
        source="github",
        match_type="exact_ref",
        external_ref="PR #88: [DASH-88] Build Streamlit Health Dashboard UI",
        event_timestamp=datetime.datetime.utcnow() - datetime.timedelta(days=1),
        files_changed=["streamlit_app.py", "components.py"],
        raw_payload={"pr_number": 88, "state": "closed", "merged": True}
    )
    db.add(ve_c2)
    db.commit()
    db.close()
    print("[Seed Data] Database pre-population complete!")

if __name__ == "__main__":
    seed_database()
