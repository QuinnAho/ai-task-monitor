<!-- Machine Summary Block -->
{"file":"ai/tasks/TASK_007_ndjson_diff_logging/checklist.md","purpose":"Checklist for adding diff previews to progress log entries."}

# Task Checklist: TASK_007_ndjson_diff_logging

## Pre-execution
- [ ] Review ai/AI_TASK_MONITOR_CONTRACT.md §§5-7 to understand logging + validation rules
- [ ] Audit current /api/logs route, CLI flows, and UI timeline rendering to map data flow
- [ ] Capture baseline behavior (no diff) for comparison

## Execution
- [ ] Draft docs/log_diff_strategy.md outlining options (commit-per-step vs inline diff) and recommend approach
- [ ] Update backend schemas + taskStore append helpers to accept/store `diff` payloads
- [ ] Add automation (CLI/server route) that captures a deterministic diff before each log append, including failure handling when no diff is available
- [ ] Update UI (LogTimeline) to render expandable diff previews with fallback messaging
- [ ] Extend AI_TASK_MONITOR_CONTRACT.md and templates to mention the diff requirement
- [ ] Add tests (unit + integration) covering diff capture and rendering paths

## Validation
- [ ] `npm run test` and any new diff-specific scripts succeed
- [ ] Sample progress entry shows diff snippet when logging via API/CLI
- [ ] UI displays diff preview without enabling edits
- [ ] Schema validation (`npm run schema:lint`) passes with new fields

## Completion
- [ ] All checklist items marked `[x]`
- [ ] progress.ndjson includes `task_completed` with diff context
- [ ] docs/log_diff_strategy.md + contract updates reviewed
- [ ] Feature Planner / documentation references updated workflow
