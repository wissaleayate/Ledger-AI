import datetime
import uuid
from sqlalchemy import Column, String, Boolean, Float, DateTime, ForeignKey, Text, Table, JSON
from sqlalchemy.orm import relationship
from app.database import Base

commitment_dependencies = Table(
    'commitment_dependencies',
    Base.metadata,
    Column('commitment_id', String, ForeignKey('commitments.id'), primary_key=True),
    Column('depends_on_id', String, ForeignKey('commitments.id'), primary_key=True)
)

class Person(Base):
    __tablename__ = 'people'
    
    id = Column(String, primary_key=True, default=lambda: f"p_{uuid.uuid4().hex[:6]}")
    name = Column(String, nullable=False)
    email = Column(String, nullable=True)
    role = Column(String, default="Developer")  # Engineering Lead | Product Manager | Developer
    github_username = Column(String, nullable=True)
    jira_username = Column(String, nullable=True)
    workspace_id = Column(String, default="ws_acme")
    
    commitments = relationship("Commitment", back_populates="owner")
    scores = relationship("ScoreRecord", back_populates="person")

class UserSession(Base):
    __tablename__ = 'user_sessions'
    
    id = Column(String, primary_key=True, default=lambda: f"sess_{uuid.uuid4().hex[:8]}")
    email = Column(String, nullable=False)
    name = Column(String, nullable=False)
    role = Column(String, default="Engineering Lead")
    workspace_name = Column(String, default="Acme Corp")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Commitment(Base):
    __tablename__ = 'commitments'
    
    id = Column(String, primary_key=True, default=lambda: f"c_{uuid.uuid4().hex[:6]}")
    owner_id = Column(String, ForeignKey('people.id'), nullable=True)
    task = Column(Text, nullable=False)
    raw_text = Column(Text, nullable=True)
    deadline = Column(String, nullable=True)
    deadline_inferred = Column(Boolean, default=False)
    linked_ref = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="open")  # open | verified_complete | overdue | at_risk
    
    owner = relationship("Person", back_populates="commitments")
    verification_events = relationship("VerificationEvent", back_populates="commitment", cascade="all, delete-orphan")
    
    dependencies = relationship(
        "Commitment",
        secondary=commitment_dependencies,
        primaryjoin=id == commitment_dependencies.c.commitment_id,
        secondaryjoin=id == commitment_dependencies.c.depends_on_id,
        backref="blocking"
    )

class VerificationEvent(Base):
    __tablename__ = 'verification_events'
    
    id = Column(String, primary_key=True, default=lambda: f"ve_{uuid.uuid4().hex[:6]}")
    commitment_id = Column(String, ForeignKey('commitments.id'), nullable=False)
    source = Column(String, default="github")
    match_type = Column(String, nullable=False)  # exact_ref | keyword_overlap | manual
    external_ref = Column(String, nullable=True)
    event_timestamp = Column(DateTime, nullable=True)
    files_changed = Column(JSON, nullable=True)
    raw_payload = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    commitment = relationship("Commitment", back_populates="verification_events")

class ScoreRecord(Base):
    __tablename__ = 'scores'
    
    id = Column(String, primary_key=True, default=lambda: f"s_{uuid.uuid4().hex[:6]}")
    person_id = Column(String, ForeignKey('people.id'), nullable=False)
    computed_at = Column(DateTime, default=datetime.datetime.utcnow)
    score = Column(Float, nullable=False)
    overdue_ratio = Column(Float, default=0.0)
    avg_days_overdue = Column(Float, default=0.0)
    blocked_dependency_ratio = Column(Float, default=0.0)
    early_completion_ratio = Column(Float, default=0.0)
    
    person = relationship("Person", back_populates="scores")
