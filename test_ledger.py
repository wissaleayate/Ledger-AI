import sys
import os

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from app.database import SessionLocal, Base, engine
from app.seed_data import seed_database
from app.services.extractor import extract_commitments_from_text
from app.services.verifier import verify_commitment_against_github
from app.services.scorer import calculate_person_health_score, calculate_team_health_score
from app.services.generator import generate_standup_agenda, generate_slack_nudge
from app.services.recovery import generate_ai_recovery_plan
from app.services.pdf_report import generate_executive_pdf_report
from app.models.db_models import Commitment, UserSession

def test_full_pipeline():
    print("--- 1. Testing Database & Seed Data ---")
    Base.metadata.create_all(bind=engine)
    seed_database()
    db = SessionLocal()
    
    commitments = db.query(Commitment).all()
    print(f"[OK] Found {len(commitments)} commitments in seeded DB.")
    assert len(commitments) > 0, "Commitments count should be > 0"
    
    print("\n--- 2. Testing Enterprise Auth Session ---")
    sess = UserSession(email="test@acme.com", name="Test User", role="Lead", workspace_name="Acme Corp")
    db.add(sess)
    db.commit()
    print(f"[OK] Created Auth Session ID: {sess.id} for workspace {sess.workspace_name}")
    
    print("\n--- 3. Testing Extraction Service ---")
    sample_text = "Priya: I will complete the OAuth2 auth refactor (AUTH-142) by Monday."
    ext_res = extract_commitments_from_text(sample_text)
    print(f"[OK] Extracted {len(ext_res.commitments)} commitments.")
    assert len(ext_res.commitments) > 0, "Extracted commitments should not be empty"
    
    print("\n--- 4. Testing Feature 2: Deep Evidence Verifier Service ---")
    first_c = commitments[0]
    ver_res = verify_commitment_against_github(db, first_c.id)
    evidence = ver_res.get("evidence", {})
    print(f"[OK] Evidence for {first_c.id}: Status={ver_res.get('status')}, Confidence={ver_res.get('confidence_score')}%, Commit={evidence.get('matched_commit_sha')}, Files={evidence.get('files_changed')}")
    assert ver_res.get("confidence_score") > 0, "Confidence score should be > 0"
    
    print("\n--- 5. Testing Feature 1: AI Recovery Planner Service ---")
    recovery = generate_ai_recovery_plan(db, first_c.id)
    print(f"[OK] AI Recovery Plan generated for {recovery.task_name}: Est={recovery.estimated_days} days, Actions={len(recovery.split_tasks)}")
    assert len(recovery.split_tasks) > 0, "Split tasks should not be empty"
    
    print("\n--- 6. Testing Non-AI Health Scoring Engine ---")
    team_score = calculate_team_health_score(db)
    print(f"[OK] Team Health Score: {team_score.team_score}/100 across {team_score.total_people} members.")
    assert 0 <= team_score.team_score <= 100, "Team score must be between 0 and 100"
    
    print("\n--- 7. Testing Feature 3: Multi-Section Executive PDF Report ---")
    pdf_bytes = generate_executive_pdf_report(db)
    print(f"[OK] Executive PDF generated successfully ({len(pdf_bytes)} bytes).")
    assert len(pdf_bytes) > 500, "PDF bytes should be > 500 bytes"
    
    db.close()
    print("\n[SUCCESS] ALL LEDGER ENTERPRISE PIPELINE TESTS PASSED CLEANLY!")

if __name__ == "__main__":
    test_full_pipeline()
