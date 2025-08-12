# Wundrsight Appointment Booking Application

## Overview
Wundrsight is a full-stack appointment booking application featuring a React frontend and an Express + Prisma backend. It supports user authentication (patient and admin roles), slot booking, and booking management.

---

## Tech Stack
- **Frontend:** React, Vite (or React Scripts), hosted on Vercel  
- **Backend:** Node.js, Express, Prisma ORM with PostgreSQL, hosted on Railway (free tier)  
- **Database:** PostgreSQL (Neon or Railway Postgres free tier)  
- **Authentication:** JWT-based auth with role-based access control  
- **Security:** Helmet, CORS configured for frontend origin  

---


- **frontend** contains all UI code, built and deployed independently.
- **backend** contains API server and database logic.
- Backend seed script runs on startup to initialize default data.

---

## Deployment URLs

| Service         | URL                                                  |
|-----------------|------------------------------------------------------|
| Frontend (Vercel) | https://wundrsight-nine.vercel.app/                   |
| Backend (Railway) | https://your-backend-name.up.railway.app             |

---

## Test Credentials

| Role    | Email                  | Password   |
|---------|------------------------|------------|
| Patient | patient@example.com    | Passw0rd!  |
| Admin   | admin@example.com      | Passw0rd!  |

---

## Running Locally

### Prerequisites
- Node.js and npm installed
- PostgreSQL database (or configured remote DB)
- Git

---

### Frontend

```bash
cd frontend
npm install
npm run dev       # or npm start|


cd backend
npm install

# Set environment variables (.env file)
# Example:
# DATABASE_URL="your_postgres_connection_string"
# JWT_SECRET="your_jwt_secret"
# FRONTEND_ORIGIN="http://localhost:5173"

npm run seed      # Optional: Seed the database with default data
npm start         # Start Express server

