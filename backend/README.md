# Backend (FastAPI)

## Setup
`ash
python -m venv .venv
. .venv/Scripts/Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
cp .env.example .env
` 

## Run
`ash
uvicorn app.main:app --reload
` 

The app auto-creates tables in dev. For production use Postgres and Alembic migrations.

