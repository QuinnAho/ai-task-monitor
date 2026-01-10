import type { FormEvent } from 'react'
import { useMemo, useState } from 'react'
import type { TaskSummary } from '../hooks/useTasks'
import { useTasks, useCreateTask } from '../hooks/useTasks'

function TaskBoard() {
  const { tasks, selectTask, activeTaskId, isLoading } = useTasks()
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState({ taskId: '', title: '', description: '' })
  const createTask = useCreateTask((taskId) => {
    setForm({ taskId: '', title: '', description: '' })
    selectTask(taskId)
  })

  const filteredTasks = useMemo(() => {
    if (!filter) return tasks
    return tasks.filter((task) => {
      const title = String(task.title ?? '')
      const id = String(task.task_id ?? '')
      return (
        title.toLowerCase().includes(filter.toLowerCase()) ||
        id.toLowerCase().includes(filter.toLowerCase())
      )
    })
  }, [tasks, filter])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.taskId || !form.title) return
    createTask.mutate({ ...form })
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <input
          placeholder="Search tasks"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>
      {isLoading ? (
        <div>Loading tasks...</div>
      ) : (
        <ul className="task-list">
          {filteredTasks.map((task) => {
            const summary = task as TaskSummary
            const taskId = summary.task_id as string
            const priority = String(summary.priority ?? '').toUpperCase()
            const isComplete = Boolean(summary.checklist_complete)
            const cardClass = [
              'task-card',
              taskId === activeTaskId ? 'active' : '',
              isComplete ? 'completed' : ''
            ]
              .filter(Boolean)
              .join(' ')
            const badgeClass = ['badge', `badge-${priority.toLowerCase()}`]
              .filter(Boolean)
              .join(' ')

            return (
              <li
                key={taskId}
                className={cardClass}
                onClick={() => selectTask(taskId)}
              >
                <div>
                  <strong>{summary.title}</strong>
                  <div className="task-meta-line">{taskId}</div>
                </div>
                <span className={badgeClass}>{priority || 'N/A'}</span>
                {isComplete && (
                  <div className="completion-overlay" aria-hidden="true">
                    <span>Finished</span>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <form className="creation-form" onSubmit={handleSubmit}>
        <h3>Create Task</h3>
        <input
          placeholder="Task ID (e.g., TASK_010_ui)"
          value={form.taskId}
          onChange={(e) => setForm((prev) => ({ ...prev, taskId: e.target.value }))}
        />
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
        />
        <textarea
          placeholder="Description"
          rows={3}
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
        />
        <button className="primary" type="submit" disabled={createTask.isPending}>
          {createTask.isPending ? 'Creating.' : 'Create Task'}
        </button>
      </form>
    </div>
  )
}

export default TaskBoard
