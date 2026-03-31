# 66010449 Secure Note App

A simple secure note application with:
- Backend: Node.js HTTP API
- Frontend: static HTML/CSS/JavaScript app
- Auth: Bearer token checked by the backend

## Requirements

- Node.js 18+ (recommended: Node.js 20 LTS)
- npm 9+
- Internet access to your PocketHost endpoint

## Project Structure

- `backend/` - API server and PocketHost integration
- `frontend/` - static client UI
- `REPORT.md` - project report

## 1) Backend Setup

Open a terminal:

```powershell
cd backend
npm install
```

Create environment file from template:

```powershell
copy .env.example .env
```

Update values in `.env`:

- `PORT` (default example: `7070`)
- `SECRET_TOKEN` (strong random secret)
- `FRONTEND_ORIGIN` (for local run: `http://127.0.0.1:8080`)
- `POCKET_HOST_URL` (your PocketHost notes endpoint)
- `POCKET_HOST_TOKEN` (your PocketHost API token)
- `USER_ID` (numeric user id)

Start backend server:

```powershell
npm run dev
```

Expected output includes:
- `Server running at http://0.0.0.0:<PORT>/`
- `Authorization secret configured`

## 2) Frontend Setup (npm-based static server)

Open a second terminal:

```powershell
cd frontend
npx http-server -a 127.0.0.1 -p 8080 -c-1
```

Open in browser:

- `http://127.0.0.1:8080`

## 3) How to Use

1. Click **Add New Note**.
2. Fill in **Title**, **Content**, and **Secret**.
3. Use the same value as `SECRET_TOKEN` for the **Secret** field.
4. Submit to create note.

## Run Summary

You should have two running processes:

- Backend: `npm run dev` in `backend/`
- Frontend: `npx http-server -a 127.0.0.1 -p 8080 -c-1` in `frontend/`

## Troubleshooting

- `401 Unauthorized`:
  - Secret entered in UI does not match backend `SECRET_TOKEN`.
- CORS error in browser:
  - Ensure backend `.env` has `FRONTEND_ORIGIN=http://127.0.0.1:8080`.
  - Ensure frontend is served from `127.0.0.1:8080`.
- `PORT ... missing or empty` or env validation fails:
  - Verify all required keys in `backend/.env` are set.
- Frontend cannot fetch notes:
  - Confirm backend is running and API URL in `frontend/scripts/app.js` points to your backend (`http://localhost:7070/api` by default).

## Scripts

Backend (`backend/package.json`):

- `npm run dev` - start server (`node server.js`)

## Deployment

### Live Instance

This project is deployed on **Vercel** (frontend) and **Render** (backend):

- **Frontend URL**: https://66010449-secure-note-app.vercel.app/
- **Backend API**: https://secure-note-app-x7us.onrender.com/api
- API URL is automatically detected via `config.js` based on hostname

### Authentication

The deployed app requires authentication with the following secret token:

```
SUPER_SECRET_TOKEN
```

When using the deployed app:

1. Navigate to https://66010449-secure-note-app.vercel.app/
2. Click **Add New Note**
3. Enter **Title** and **Content**
4. In the **Secret** field, enter: `SUPER_SECRET_TOKEN`
5. Submit to create a note

### Backend Configuration

The backend is deployed on Render with:
- Endpoint: https://secure-note-app-x7us.onrender.com/api
- Environment variables configured for production HTTPS and PocketHost integration
- The frontend automatically routes API requests to the production backend
