<!-- Machine Summary Block -->
{"file":"docs/local_editor_ui.md","purpose":"Documents the Local Editor UI architecture, components, and manual test plan."}

# Local Editor UI

## 1. Overview
- **Goal:** Provide a React/Vite UI that consumes the local backend to manage tasks, checklists, logs, contracts, and prompts.
- **Tech stack:** Vite + React 19 + TypeScript, TanStack Query for data fetching, Jotai for shared task selection, Axios for HTTP.
- **Location:** src/ui/ (Vite project) with components in src/ui/src/components/ and hooks in src/ui/src/hooks/.

## 2. Architecture
- TaskBoard displays tasks, search/filter, and an inline creation form that POSTs to /api/tasks.
- TaskDetail renders metadata, checklist (with toggle buttons calling /api/tasks/:id/checklist), log timeline, and JSON summary.
- ContractEditor + PromptEditor fetch/save via /api/contracts/* endpoints with client-side JSON validation.
- useTasks, useTaskDetail, useChecklistMutations, useContractEditor, usePromptEditor hooks encapsulate TanStack Query logic.
- Layout defined in src/ui/src/pages/App.tsx with CSS under src/ui/src/styles/.
- Vite dev server proxies /api calls to the Express backend.

## 3. Development Scripts
```
npm run dev        # Starts the Express backend on http://localhost:3000
npm run ui:dev     # Runs the Vite dev server (proxies /api to :3000)
npm run ui:build   # Builds the UI for production
```
(Proxy config lives in src/ui/vite.config.ts.)

## 4. Manual Test Script
1. **Start services:** In one terminal run `npm run dev` (backend). In another run `npm run ui:dev` (UI).
2. **Task list:** Verify existing tasks appear; use search box to filter.
3. **Create task:** Use the creation form to add TASK_500_ui_demo. Confirm board refreshes and new task is selected.
4. **Checklist toggle:** In Task Detail, toggle a checklist item; ensure UI updates and progress log shows new entry (view via backend log).
5. **Log timeline:** Confirm timeline updates after toggles or log API calls (visible once backend returns data).
6. **Contract editor:** Modify contract text (ensuring Machine Summary JSON stays valid) and click Save. Inspect ai/AI_TASK_MONITOR_CONTRACT.md to confirm changes.
7. **Prompt editor:** Update prompt ID/body/purpose with valid JSON body, save, and verify ai/templates/prompt_template.json updated.
8. **Refresh state:** Reload the UI and confirm selections persist (tasks reload, contract/prompt editors show latest content).

Document any discrepancies in ai/tasks/TASK_005_local_editor_ui/progress.ndjson before marking the task complete.
