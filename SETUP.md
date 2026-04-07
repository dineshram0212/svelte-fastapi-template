# Project Architecture: The Triple Setup

This project is organized into three distinct components to separate core business logic, administrative management, and customer-facing experiences.

## 🚀 The Three Components

| Component | Technology | Purpose | Local Port | Subdomain (Traefik) |
| :--- | :--- | :--- | :--- | :--- |
| **Backend** | FastAPI | Core API, Database, Auth | `8000` | `api.localhost` |
| **Admin** | React / TanStack | Internal Dashboard for managing users & data | `5174` | `dashboard.localhost` |
| **Frontend** | SvelteKit | Customer-facing application | `5173` | `localhost` |

---

## 📁 Directory Overview

```text
/backend-admin/
├── backend/    # FastAPI Python application
├── admin/      # React-based Admin Dashboard (formerly 'frontend')
├── frontend/   # SvelteKit Main Application (moved from outside)
├── scripts/    # Utility scripts for setup and deployment
├── compose.yml # Production Docker configuration
└── .env        # Shared environment variables
```

---

## 🛠️ Local Development

You can manage the entire project from the root folder of the template:

### 1. Unified Startup (via Workspaces)
To start both frontends and the backend (if configured) at once:
```bash
npm run dev
```

### 2. Individual Component Startup
- **Run SvelteKit App Only:** `npm run dev:app`
- **Run React Admin Only:** `npm run dev:admin`
- **Run FastAPI Backend:**
  ```bash
  cd backend
  fastapi run --reload app/main.py
  ```

---

## 🔒 Important: CORS & Domains

The backend is configured to trust both frontends. If you change deployment domains, you **must** update the `BACKEND_CORS_ORIGINS` in your `.env` file:

```env
# Example production CORS setup
BACKEND_CORS_ORIGINS=["https://example.com", "https://dashboard.example.com", "http://localhost:5173", "http://localhost:5174"]
```

## 🐳 Docker Deployment

To build and run all three components in production mode using Traefik:
```bash
docker compose up -d --build
```
Traefik will automatically route traffic based on the hostname:
- `localhost` -> SvelteKit Frontend
- `dashboard.localhost` -> React Admin
- `api.localhost` -> FastAPI Backend
