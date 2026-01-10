# AI Task Monitor

Local tooling that helps you create AI tasks, keep context organized, and show clients (or yourself) steady progress using AI-assisted coding. A simple React/Vite UI talks to an Express backend so you can maintain the ai/ folder without touching files manually. A lightweight “website viewer” mode is planned so clients can monitor progress remotely without write access.

![alt text](docs/img/dashboard-mvp.png)

## Setup
- `npm install` at repo root (installs backend + script deps).  
- `npm run dev` starts the backend on http://localhost:3000.  
- `npm run ui:dev` (in another terminal) launches the Vite client on http://localhost:5173 with `/api` proxied to the backend.

## Useful Scripts
- `npm run schema:lint` – validate JSON/Markdown/NDJSON artifacts.  
- `npm run generate:task` – scaffold a task module from templates.  
- `npm --prefix src/ui run build` or `npm run ui:build` – production UI bundle.  
- `npm test` – run backend + FileAccess tests.

Keep Machine Summary Blocks on new Markdown/JSON artifacts and log progress updates per `ai/AI_TASK_MONITOR_CONTRACT.md`.
