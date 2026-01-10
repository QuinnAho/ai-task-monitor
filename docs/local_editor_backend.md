<!-- Machine Summary Block -->
{"file":"docs/local_editor_backend.md","purpose":"Describes the Local Editor Backend REST API for the AI Task Monitor project."}

# Local Editor Backend

## 1. Overview
- **Purpose:** Provide a local REST interface for task CRUD operations, leveraging the FileAccess module for deterministic filesystem changes.
- **Stack:** Express 4 + TypeScript (`src/server/app.ts`) with routers under `src/server/routes/`.
- **Key features:** Task listing/detail, task creation from templates, checklist toggles, log append/fetch, template listing, contract/prompt regeneration.

## 2. Routes
| Method & Path | Description |
| --- | --- |
| `GET /health` | Simple readiness probe. |
| `GET /api/tasks` | Lists task metadata by reading `ai/tasks/*/task.json`. |
| `GET /api/tasks/:taskId` | Returns `task.json`, `checklist.md`, and `progress.ndjson` contents. |
| `POST /api/tasks` | Bodies validated with Zod; clones template files and updates fields. |
| `PATCH /api/tasks/:taskId/checklist` | Toggles a checklist line, ensuring `[x]/[ ]` substitution. |
| `POST /api/tasks/:taskId/logs` | Appends NDJSON entries validated against `schemas/progress_event.json`. |
| `GET /api/checklists/:taskId` | Fetches raw checklist text. |
| `GET /api/logs/:taskId` | Returns parsed NDJSON log entries. |
| `GET /api/templates` | Lists available task templates. |
| `POST /api/contracts/regenerate` | Writes new contract content to `ai/AI_TASK_MONITOR_CONTRACT.md`. |
| `GET /api/contracts/current` | Returns the current contract markdown text. |
| `POST /api/contracts/regenerate` | Writes new contract content to `ai/AI_TASK_MONITOR_CONTRACT.md`. |
| `GET /api/contracts/prompts` | Fetches the active prompt template JSON. |
| `POST /api/contracts/prompts` | Stores prompt template JSON validated via `schemas/prompt_template.json`. |

## 3. Architecture
- `createApp(config)` builds the Express app and injects a `FileAccess` instance.
- Routers encapsulate domain logic (`routes/tasks.ts`, `routes/checklists.ts`, `routes/logs.ts`, `routes/templates.ts`, `routes/contracts.ts`).
- Shared helpers live in `src/server/lib/taskStore.ts` (listing tasks, parsing NDJSON, copying templates, toggling checklist lines, etc.).
- Error handling converts `FileAccessError` and `ZodError` into structured JSON responses.

## 4. Validation & Logging
- Request payloads validated using Zod schemas per route; failures return HTTP 400 with error arrays.
- File operations rely on FileAccess, ensuring atomic writes, schema validation hooks, and JSON logging to `logs/file_access.log`.
- Integration tests (`src/server/server.test.ts`) run via `npm test` alongside filesystem tests.

## 5. Usage
```bash
npm install
START_SERVER=true PORT=3001 npm run dev
curl http://localhost:3001/api/tasks
```
- To scaffold tasks via API: `POST /api/tasks` with `{ "taskId": "TASK_010_example", "title": "...", "description": "..." }`.
- To toggle checklist line 5: `PATCH /api/tasks/TASK_010_example/checklist` body `{ "line": 5, "checked": true }`.
- To append log: `POST /api/tasks/TASK_010_example/logs` body contains `ts`, `event`, `status`, `agent`, `details`.
- To fetch the contract for the UI editor: `GET /api/contracts/current`.
- To fetch the active prompt template before editing: `GET /api/contracts/prompts`.

## 6. Testing
- Run `npm test` to execute both filesystem and server integration tests.
- Tests spin up the Express app against a temporary FileAccess root to avoid mutating the real repo.
- Schema validation remains available via `npm run schema:lint`.

## 7. Future Enhancements
1. Add authentication for API access (e.g., tokens or local auth).
2. Support pagination/filtering on task list endpoint.
3. Stream log updates via SSE/WebSocket for live UI updates.
