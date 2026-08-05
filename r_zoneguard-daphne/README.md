# ZoneGuard

A Homeowners' Association Management System for Complaint Tracking, Financial Monitoring, and Geographic Visualization.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (React), Tailwind CSS, TypeScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Auth | JWT + bcrypt.js |
| Mapping | Leaflet.js (data prepared in QGIS) |
| Analytics | R, RStudio, Random Forest ML, CSV-based offline analysis |
| Email | Nodemailer |
| Design | Figma, Canva |
| Version Control | Git & GitHub |

## Repository Structure

```
zoneguard/
├── frontend/          # Next.js + React + Tailwind CSS client
├── backend/           # Node.js + Express REST API
├── analytics/         # Offline R scripts, reports, and exported CSV data
├── docs/              # ERD, data dictionary, diagrams, meeting notes
└── README.md
```

Frontend and backend are kept as separate Node projects (each with its own
`package.json`) inside one repo, rather than a single combined app. This
matches the stack in the proposal — Next.js talking to a separate Express +
PostgreSQL API over REST — and lets each side be started, tested, and
deployed independently.

## Prerequisites

- Node.js 20 LTS or later
- npm 10+
- PostgreSQL 15+ running locally (or a connection string to a hosted instance)
- Git
- R 4.x
- RStudio

## Getting Started

### 1. Clone and install

```bash
git clone <your-repo-url> zoneguard
cd zoneguard

cd backend && npm install
cd ../frontend && npm install
```

### 2. Configure environment variables

Copy the example env files and fill in real values (never commit the real `.env` files — they're already git-ignored):

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env.local
```

### 3. Set up the database

```bash
# create the database
createdb zoneguard_dev

# run the schema + seed scripts
cd backend
npm run db:migrate
npm run db:seed
```

### 4. Run both apps in development

In two terminals:

```bash
# terminal 1 — API on http://localhost:5000
cd backend
npm run dev

# terminal 2 — web app on http://localhost:3000
cd frontend
npm run dev
```

## Offline Data Analytics Strategy (R Integration)

To handle heavy statistical processing and predictive modeling without bogging down the live web server, ZoneGuard utilizes an offline analytics architecture.

## Branching Convention

- `main` — always deployable
- `develop` — integration branch for the current sprint
- `feature/<short-description>` — one branch per feature/task, branched from `develop`

Example: `feature/complaint-tracking-form`, `feature/leaflet-property-map`.

## Documentation

Put the ERD, Data Dictionary, and any diagrams/screenshots used in the manuscript
under `docs/`.
