# SmartSeason Field Monitoring System

## Overview
Full-stack app for tracking crop progress across fields. Supports Admin (coordinator) and Field Agent roles.

## Tech Stack
- Backend: Node.js/Express/Prisma/SQLite/JWT
- Frontend: React/Tailwind/Axios
- Monorepo structure

## Setup &amp; Run
```bash
cd shamba_intern
npm install  # root deps
npm run setup  # backend/frontend deps
npm run db-setup  # Prisma migrate + seed DB
npm run dev  # Backend:5000 + Frontend:3000
```
Open http://localhost:3000

## Demo Credentials
- **Admin**: admin@example.com / admin123 (view all fields)
- **Agent**: agent@example.com / agent123 (assigned fields only)

## API Endpoints
| Method | Endpoint | Role | Desc |
|--------|----------|------|------|
| POST | /api/auth/login | public | JWT token |
| GET | /api/fields | admin/agent | List fields (agent filtered) |
| POST | /api/fields | admin | Create field |
| PUT | /api/fields/:id | owner/admin | Update field |
| DELETE | /api/fields/:id | owner/admin | Delete |

## Design Decisions &amp; Assumptions
- **Roles**: JWT payload has `role`, middleware enforces.
- **Field Status Logic**:
  - **Completed**: `stage === 'Harvested'`
  - **At Risk**: Not completed &amp;&amp; (daysSincePlanting > expectedForStage OR notes contains 'pest\|disease\|drought\|risk')
  - **Active**: Else
  - Expected days from planting: Growing(~14), Ready(~60), Harvested(~14). Computed in backend.
- **Data**: SQLite for dev/demo (portable).
- **UI**: Simple responsive table/forms, status badges (green/yellow/red).
- **Security**: bcrypt passwords, JWT (24h expiry), CORS.
- **No over-engineering**: No advanced state mgmt, no tests (focus on core).

## Assumptions
- Single-agent assignment per field.
- Basic validation (e.g., valid dates, enum stages).
- Local dev only (no prod deploy).

Built by BLACKBOXAI.

