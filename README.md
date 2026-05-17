# 🚀 Smart Leads Dashboard

A full-stack Lead Management System built with MERN + TypeScript. Manage, track, and convert leads with a clean, responsive UI.

## ✨ Features

- **JWT Authentication** — Register, Login, Protected Routes, bcrypt password hashing
- **Leads CRUD** — Create, Read, Update, Delete leads
- **Advanced Filtering** — Filter by Status, Source, Search by Name/Email, Sort (Latest/Oldest)
- **Backend Pagination** — 10 records per page with full metadata
- **Debounced Search** — 400ms debounce, no unnecessary API calls
- **CSV Export** — Download all leads as CSV
- **Role-Based Access Control** — Admin (full access) vs Sales (own leads only, no delete)
- **Dark Mode** — Full dark mode support with persistent preference
- **Docker Setup** — One command to run everything

## 🛠️ Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18 + Vite + TypeScript + TailwindCSS |
| State | Zustand + TanStack Query |
| Backend | Node.js + Express + TypeScript |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| DevOps | Docker + Docker Compose |

## 🚀 Quick Start

### Option 1: Docker (Recommended)

```bash
# Clone and run
git clone <repo-url>
cd smart-leads-dashboard
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- MongoDB: localhost:27017

### Option 2: Local Development

**Prerequisites:** Node.js 18+, MongoDB running locally

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env — set MONGODB_URI=mongodb://localhost:27017/smart-leads
npm run dev
```

**Seed demo data (optional):**
```bash
npm run seed
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Edit .env — set VITE_API_URL=http://localhost:5000/api
npm run dev
```

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@demo.com | Admin123 |
| Sales | sales@demo.com | Sales123 |

## 📁 Project Structure

```
smart-leads-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/       # DB connection
│   │   ├── controllers/  # auth + leads logic
│   │   ├── middleware/   # JWT auth, RBAC, error handler
│   │   ├── models/       # User, Lead mongoose schemas
│   │   ├── routes/       # /auth, /leads
│   │   ├── types/        # TypeScript interfaces
│   │   └── utils/        # apiResponse, seed, csvExport
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── api/          # axios instance + API calls
│   │   ├── components/   # UI, leads, auth, layout
│   │   ├── hooks/        # useDebounce, useLeads, useDarkMode
│   │   ├── pages/        # Login, Register, Dashboard
│   │   ├── store/        # Zustand auth store
│   │   └── types/        # Shared TS types
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

## 📡 API Documentation

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login |
| GET | /api/auth/me | Protected | Get current user |

### Leads
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | /api/leads | Protected | Get leads (with filters + pagination) |
| GET | /api/leads/:id | Protected | Get single lead |
| POST | /api/leads | Protected | Create lead |
| PUT | /api/leads/:id | Protected | Update lead |
| DELETE | /api/leads/:id | Admin only | Delete lead |
| GET | /api/leads/stats | Protected | Get lead statistics |
| GET | /api/leads/export | Protected | Export leads as CSV |

### Query Parameters (GET /api/leads)
| Param | Values | Description |
|-------|--------|-------------|
| status | New, Contacted, Qualified, Lost | Filter by status |
| source | Website, Instagram, Referral | Filter by source |
| search | string | Search name or email |
| sort | latest, oldest | Sort order |
| page | number | Page number (default: 1) |
| limit | number | Records per page (default: 10) |

### Response Format
```json
{
  "success": true,
  "message": "Leads fetched",
  "data": [...],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 10,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🔐 RBAC

| Action | Admin | Sales |
|--------|-------|-------|
| View all leads | ✅ | ❌ (own only) |
| Create lead | ✅ | ✅ |
| Update lead | ✅ | ✅ (own only) |
| Delete lead | ✅ | ❌ |
| Export CSV | ✅ | ✅ (own only) |

## 🏗️ Environment Variables

**Backend (.env)**
```
PORT=5000
MONGODB_URI=mongodb://mongo:27017/smart-leads
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

**Frontend (.env)**
```
VITE_API_URL=http://localhost:5000/api
```
