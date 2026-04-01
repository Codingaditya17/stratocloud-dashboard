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
│       └── components/
│           ├── StatsBar.jsx
│           ├── FilterBar.jsx
│           └── UserTable.jsx
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
```bash
cd backend
go test ./... -v
```