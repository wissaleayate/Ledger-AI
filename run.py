import subprocess
import sys
import time
import os

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

def run_ledger():
    print("=" * 65)
    print("Ledger Enterprise -- Commitment Reality Verifier")
    print("=" * 65)
    print("AI Engine: IBM Granite 3-8B (watsonx.ai) + Groq Fallback")
    print("Verifier Engine: Deterministic GitHub REST API Matcher")
    print("Scoring Engine: Pure Arithmetic Health Score Engine")
    print("=" * 65)

    cwd = os.path.dirname(os.path.abspath(__file__))

    # Use 'python' directly so it targets the PATH python environment with installed packages
    py_bin = "python"

    # 1. Start FastAPI Backend (Port 8000)
    print("\nLaunching FastAPI Backend Server at http://127.0.0.1:8000 ...")
    backend_cmd = [py_bin, "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=cwd)

    time.sleep(2)

    # 2. Start Streamlit Frontend (Port 8501)
    print("\nLaunching Streamlit UI Dashboard at http://127.0.0.1:8501 ...")
    frontend_cmd = [
        py_bin, "-m", "streamlit", "run", "streamlit_app.py",
        "--server.port", "8501",
        "--server.address", "0.0.0.0",
        "--server.headless", "true",
        "--browser.gatherUsageStats", "false"
    ]
    frontend_proc = subprocess.Popen(frontend_cmd, cwd=cwd)

    try:
        backend_proc.wait()
        frontend_proc.wait()
    except KeyboardInterrupt:
        print("\nStopping Ledger processes...")
        backend_proc.terminate()
        frontend_proc.terminate()

if __name__ == "__main__":
    run_ledger()
