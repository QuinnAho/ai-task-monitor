import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { atom, useAtom } from 'jotai'

export interface TaskSummary extends Record<string, unknown> {
  task_id?: string
  title?: string
  priority?: string
  checklist_complete?: boolean
}

interface TasksResponse {
  tasks: TaskSummary[]
}

export const activeTaskAtom = atom<string | null>(null)

export function useTasks() {
  const queryClient = useQueryClient()
  const [activeTaskId, setActiveTaskId] = useAtom(activeTaskAtom)
  const tasksQuery = useQuery<TaskSummary[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await axios.get<TasksResponse>('/api/tasks')
      return response.data.tasks
    }
  })

  const selectTask = (taskId: string) => {
    setActiveTaskId(taskId)
    queryClient.invalidateQueries({ queryKey: ['task-detail', taskId] })
  }

  return {
    tasks: tasksQuery.data ?? [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    selectTask,
    activeTaskId
  }
}

interface CreateTaskPayload {
  taskId: string
  title: string
  description: string
}

export function useCreateTask(onCreated?: (taskId: string) => void) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateTaskPayload) => {
      await axios.post('/api/tasks', payload)
      return payload
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] })
      if (data?.taskId) {
        onCreated?.(data.taskId)
      }
    }
  })
}
