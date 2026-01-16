import ChecklistPanel from './ChecklistPanel'
import LogTimeline from './LogTimeline'
import { useTaskDetail } from '../hooks/useTaskDetail'

function TaskDetail() {
  const { task, checklistLines, progress, isLoading } = useTaskDetail()

  if (isLoading) {
    return <div className="panel">Loading task detail…</div>
  }

  if (!task) {
    return <div className="panel">Select a task to view details</div>
  }

  return (
    <div className="panel">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <div className="task-meta">
        <span>Status: {task.status}</span>
        <span>Priority: {task.priority}</span>
        <span>Created: {task.created}</span>
      </div>
      <section className="task-section task-section-progress">
        <h3>Progress Log</h3>
        <LogTimeline entries={progress} />
      </section>
      <section className="task-section task-section-checklist">
        <h3>Checklist</h3>
        <ChecklistPanel lines={checklistLines} taskId={task.task_id as string} />
      </section>
    </div>
  )
}

export default TaskDetail
