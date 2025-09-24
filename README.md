# FAA MTR Tracker (SaaS)

Aplicación web para seguimiento de mantenimientos e inspecciones de aeronaves (MTRs) con monorepo:

- backend/: API en FastAPI + SQLModel + JWT + Alembic
- frontend/: SPA en React + Vite + Tailwind + React Router

Basado en prompt_react_vite.txt.

## Requisitos
- Python 3.11+ (3.12 ok)
- Node.js 18+

## Backend

### Configuración
```bash
cd backend
python -m venv .venv
. .venv/Scripts/Activate.ps1  # Windows PowerShell
pip install -r requirements.txt
cp .env.example .env
```
Variables .env relevantes:
- `DATABASE_URL` (dev por defecto sqlite:///./app.db)
- `SECRET_KEY`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `CORS_ORIGINS` (por defecto http://localhost:5173)
- `INITIAL_ADMIN_EMAIL` y `INITIAL_ADMIN_PASSWORD` (para crear admin al iniciar)

### Ejecutar
```bash
uvicorn app.main:app --reload
```
La API crea tablas automáticamente en dev. Para prod usa Postgres y Alembic.

### Endpoints clave
- Auth: `POST /auth/login`, `POST /auth/register` (Admin), `GET /auth/me`
- Aircraft: CRUD `/aircraft`, `POST /aircraft/{id}/archive`, `POST /aircraft/{id}/unarchive`, `GET/PUT /aircraft/{id}/times-cycles`, `POST /aircraft/import`
- MTRs: `GET /mtrs`, `GET /mtrs/{id}`, `POST /mtrs`, `POST /mtrs/{id}/items`, `DELETE /mtrs/{id}/items/{item_id}`, `POST /mtrs/{id}/repair-facility`, `POST /mtrs/{id}/inspection`
- Reports: `GET /reports`

RBAC: Roles `Admin`, `Mechanic`, `Auditor`.

### Pruebas
```bash
cd backend
pytest -q
```

## Frontend

### Configuración
```bash
cd frontend
npm install
cp .env.example .env
```

Variables:
- `VITE_API_BASE_URL` (por defecto http://localhost:8000)

### Ejecutar
```bash
npm run dev
```

### Estructura
- Router con vistas: Dashboard, Aircraft, MTRs, Reports
- Wizard de MTR de 6 pasos con estado preservado
- Navbar con secciones y acciones por rol

## Notas
- CORS habilitado para `http://localhost:5173` por defecto.
- Alembic configurado; genera migraciones con `alembic revision --autogenerate -m "init"` y `alembic upgrade head`.
- CSV import en `/aircraft/import` es placeholder para duplicados por `item_code`.
