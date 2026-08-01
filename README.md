# ⚖️ Ledger — Commitment Reality Verifier

**Tagline:** *The AI co-worker that checks whether commitments actually happened — not what an AI thinks about them.*

Ledger bridges the gap between conversational promises (standup notes, Slack updates, meeting transcripts) and ground truth software engineering reality (GitHub commits, PRs, issue transitions). It strictly demarcates **AI-driven language processing** (IBM Granite) from **non-AI deterministic verification & arithmetic scoring** to guarantee 100% auditable credibility.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Streamlit Dashboard)                     │
│  ┌───────────────────┐  ┌─────────────────────┐  ┌────────────────────┐ │
│  │ 📝 Standup Notes  │  │ 🔍 Verification     │  │ 📊 Health Score    │ │
│  │    Extractor      │  │    Review Table     │  │    Dashboard       │ │
│  └─────────┬─────────┘  └──────────┬──────────┘  └─────────┬──────────┘ │
└────────────┼───────────────────────┼───────────────────────┼────────────┘
             │                       │                       │
             ▼                       ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                           BACKEND (FastAPI)                             │
│                                                                         │
│  ┌──────────────────┐    ┌──────────────────┐    ┌───────────────────┐  │
│  │ /extract         │    │ /verify          │    │ /score            │  │
│  │ [AI - Granite]   │───▶│ [Non-AI Code]    │───▶│ [Non-AI Code]     │  │
│  │ Schema Extractor │    │ GitHub REST API  │    │ Deterministic     │  │
│  │ Pydantic Retry   │    │ Matcher Engine   │    │ Health Formula    │  │
│  └──────────────────┘    └─────────┬────────┘    └─────────┬─────────┘  │
│                                    │                       │            │
│                                    ▼                       ▼            │
│                          ┌──────────────────┐    ┌───────────────────┐  │
│                          │ /agenda          │    │ /nudge            │  │
│                          │ [AI - Granite]   │    │ [AI - Granite]    │  │
│                          │ Agenda Narrator  │    │ Slack Nudge Draft │  │
│                          └──────────────────┘    └───────────────────┘  │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │
                               ▼
                   ┌───────────────────────┐
                   │    DATABASE (SQLite)  │
                   │                       │
                   │  people               │
                   │  commitments          │
                   │  dependencies         │
                   │  verification_events  │
                   │  scores               │
                   └───────────────────────┘
```

---

## 💡 Clear AI vs. Non-AI Boundaries

| Component | Technology / Method | AI vs Non-AI | Purpose |
|---|---|---|---|
| Commitment Extraction (`/extract`) | IBM Granite 3-8B via watsonx.ai + Pydantic | **AI** | Extract structured JSON commitments from unorganized text |
| Ground Truth Verification (`/verify`) | GitHub REST API (`/commits`, `/pulls`) | **Non-AI** | Deterministic exact reference & keyword matching against real code activity |
| Commitment Health Score (`/score`) | Pure Mathematical Formula | **Non-AI** | 0–100 formula calculation (overdue ratio, days overdue, blocked dependencies) |
| Standup Agenda Generation (`/agenda`) | IBM Granite 3-8B | **AI** | Narrates talking points over pre-scored deterministic risk data |
| Slack Nudge Generation (`/nudge`) | IBM Granite 3-8B | **AI** | Drafts empathetic, non-accusatory Slack check-in messages |

---

## 🧮 Deterministic Health Score Formula

The Commitment Health Score (0–100 per person) is calculated using pure arithmetic:

$$\text{Score} = 100 - (25 \times \text{overdue\_ratio}) - \left(15 \times \frac{\text{avg\_days\_overdue}}{7}\right) - (20 \times \text{blocked\_dependency\_ratio}) + (10 \times \text{early\_completion\_ratio})$$

Every term is named, every weight is visible, and the formula is shown directly in the UI dashboard.

---

## ⚡ Quick Start & Execution

### 1. Requirements & Dependencies
Ensure Python 3.10+ is installed.
```bash
pip install -r requirements.txt
```

### 2. Launch FastAPI Backend and Streamlit Dashboard
```bash
python run.py
```
- **Backend API**: `http://localhost:8000` (Interactive Docs: `http://localhost:8000/docs`)
- **Streamlit Dashboard**: `http://localhost:8501`

---

## 🚀 Live Demo Walkthrough Script (5 Minutes)

1. **Framing (30s)**: "Every AI decision tool debates itself. Ledger checks itself against ground truth reality."
2. **Extract (60s)**: Load sample standup notes in Tab 1, hit Extract with IBM Granite, show structured commitments.
3. **Verify (90s)**: Open Tab 2, hit Ground Truth Verification against GitHub REST API, showing exact commit SHAs & merged PRs matching the commitments.
4. **Health Score (60s)**: View Tab 3, highlight the arithmetic formula tooltip proving the score is not an LLM hallucination.
5. **Actionable Output (60s)**: Open Tab 4 to showcase pre-scored AI standup agendas and single-click Slack nudge drafts.
