<!-- Machine Summary Block -->
{"file":"ai/tasks/TASK_005_local_editor_ui/checklist.md","purpose":"Guides implementation of the Local Editor UI task board and detail experience."}

# Task Checklist: TASK_005_local_editor_ui

## Pre-execution
- [ ] Read task.json, acceptance criteria, docs/requirements_architecture.md, docs/local_editor_backend.md, docs/file_access_layer.md
- [ ] Inventory backend endpoints (/api/tasks, /api/checklists, /api/logs, /api/contracts, /api/templates) and note required UI states
- [ ] Decide on UI stack (Vite + React + TypeScript) and directory layout under `src/ui/`

## Execution
- [ ] Scaffold Vite/React client (package scripts, dev server, build config) in `src/ui/`
- [ ] Implement shared hooks (`useTasks`, `useTaskDetail`, etc.) that call backend endpoints with error handling
- [ ] Build task board component showing status/priority counts, search/filter
- [ ] Build task detail view with tabs/panels for JSON summary, checklist with toggle buttons, log timeline, and metadata
- [ ] Integrate checklist toggle UI with backend patch endpoint and reflect updates in UI state/log timeline
- [ ] Implement log timeline component (append-only) and auto-refresh after toggles or log writes
- [ ] Build contract/prompt editors with JSON linting; block save on invalid JSON; wire to backend contract/prompt routes
- [ ] Implement task creation wizard (modal or page) that hits POST /api/tasks and refreshes task board
- [ ] Add manual test script in docs/local_editor_ui.md verifying flows: create task, toggle checklist, append log, update contract/prompt
- [ ] Log progress updates in progress.ndjson for major UI milestones

## Validation
- [ ] Run UI build/test commands (e.g., `npm run ui:test` or `npm run build`) and ensure pass
- [ ] Execute manual script verifying backend state updates (document results)
- [ ] Execute `node scripts/validate_schemas.mjs` if new Markdown/JSON files added or modified

## Completion
- [ ] Mark checklist items `[x]` when validated
- [ ] Append `task_completed` entry to progress.ndjson
- [ ] Update ai/tasks/current_index.json to reflect task status and capture remaining follow-ups
