<!-- Machine Summary Block -->
{"file":"ai/tasks/TASK_008_milestone_container/checklist.md","purpose":"Checklist for implementing milestone containers and QA gating."}

# Task Checklist: TASK_008_milestone_container

## Pre-execution
- [x] Review ai/AI_TASK_MONITOR_CONTRACT.md to align milestone QA requirements with existing completion rules
- [ ] Inventory current task list flows (server + UI) to understand where milestones integrate
- [ ] Define milestone data model (fields, storage path, schema dependencies)

## Execution
- [ ] Draft docs/milestone_workflow.md describing milestone lifecycle, QA gate, and user expectations
- [ ] Create schemas/milestone.json (plus any index schema) and seed sample milestone files under ai/milestones/
- [ ] Implement backend storage/helpers (milestoneStore) and routes for listing/creating/updating milestones + QA status
- [ ] Wire task completion events to milestone progress (auto-check status when tasks finish)
- [ ] Extend UI (TaskBoard sidebar + new Milestone component) to render milestones, allow expansion, show QA pending/completed states, and surface a collapsible “Completed” section where finished tasks drop automatically (with drag-to-reorder support that lets users pull items back into scope if needed)
- [ ] Update contract/docs/templates to mention milestone QA requirements
- [ ] Add integration/unit tests for milestone APIs, schema validation, and UI data hooks

## Validation
- [ ] `npm run test` passes with new milestone coverage
- [ ] `npm run schema:lint` validates milestone JSON files
- [ ] Manual UI sanity: milestone list expands, tasks show correct states, QA gate triggered
- [ ] Documentation reviewed for accuracy

## Completion
- [ ] All checklist boxes checked
- [ ] progress.ndjson appended with `task_completed` referencing milestone QA
- [ ] Active milestone sample demonstrates QA workflow end-to-end

