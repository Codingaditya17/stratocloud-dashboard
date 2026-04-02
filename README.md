# StratoCloud User Security Dashboard

Full-stack security dashboard — Go REST API + React frontend.

## Folder Structure
```
Strato-cloud/
├── backend/
│   ├── main.go
│   ├── main_test.go
│   └── go.mod
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── index.css
│       ├── App.jsx
│       ├── components/
│       │   ├── StatsBar.jsx
│       │   ├── FilterBar.jsx
│       │   └── UserTable.jsx
│       └── test/
│           ├── setup.js
│           ├── StatsBar.test.jsx
│           ├── FilterBar.test.jsx
│           └── UserTable.test.jsx
├── .gitignore
└── README.md
```

## How to Run

### Backend
```bash
cd backend
go run main.go
```
API runs on http://localhost:8080

### Frontend
Open a second terminal:
```bash
cd frontend
npm install
npm run dev
```
App runs on http://localhost:5173

### Run Tests

**Go (9 tests):**
```bash
cd backend
go test ./... -v
```

**React (21 tests):**
```bash
cd frontend
npm test
```

## API

`GET /api/users` — returns all users with live-computed fields

Optional query params:
- `?mfa=true` or `?mfa=false` — filter by MFA status
- `?stale=password` — users with password older than 365 days
- `?stale=access` — users inactive for 90 +  days