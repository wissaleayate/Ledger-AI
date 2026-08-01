import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Ledger — AI Commitment & Reality Verifier"
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./ledger.db")
    
    # IBM watsonx / Granite configuration (Primary IBM Hackathon Model)
    WATSONX_APIKEY: str = os.getenv("WATSONX_APIKEY", "")
    WATSONX_PROJECT_ID: str = os.getenv("WATSONX_PROJECT_ID", "")
    WATSONX_URL: str = os.getenv("WATSONX_URL", "https://us-south.ml.cloud.ibm.com")
    GRANITE_MODEL_ID: str = os.getenv("GRANITE_MODEL_ID", "ibm/granite-3-8b-instruct")
    
    # Alternative Live LLM API Providers (First Priority Live AI Calls)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
    
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OLLAMA_URL: str = os.getenv("OLLAMA_URL", "http://localhost:11434")  # Local live LLM if running
    
    # GitHub Integration
    GITHUB_PAT: str = os.getenv("GITHUB_PAT", "")
    DEFAULT_GITHUB_REPO: str = os.getenv("DEFAULT_GITHUB_REPO", "owner/repo")
    
    # AI Fallback configuration
    ENABLE_LLM_FALLBACK: bool = True

settings = Settings()
