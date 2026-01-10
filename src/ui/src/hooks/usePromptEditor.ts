import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

interface PromptForm {
  id: string
  description: string
  body: string
  summaryFile: string
  summaryPurpose: string
}

const EMPTY_FORM: PromptForm = {
  id: '',
  description: '',
  body: '',
  summaryFile: 'ai/templates/prompt_template.json',
  summaryPurpose: ''
}

export function usePromptEditor() {
  const [form, setForm] = useState<PromptForm>(EMPTY_FORM)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get('/api/contracts/prompts')
      .then((response) => {
        const data = response.data
        setForm({
          id: data.id ?? '',
          description: data.description ?? '',
          body: data.body ?? '',
          summaryFile: data.summary?.file ?? 'ai/templates/prompt_template.json',
          summaryPurpose: data.summary?.purpose ?? ''
        })
      })
      .catch(() => {
        // Allow empty defaults
      })
  }, [])

  const mutation = useMutation({
    mutationFn: async () => {
      if (!form.id || !form.description || !form.body) {
        throw new Error('Prompt ID, description, and body are required.')
      }
      try {
        JSON.parse(form.body)
      } catch {
        throw new Error('Prompt body must be valid JSON.')
      }
      await axios.post('/api/contracts/prompts', {
        id: form.id,
        description: form.description,
        body: form.body,
        summary: {
          file: form.summaryFile,
          purpose: form.summaryPurpose || 'Prompt template for local editor.'
        }
      })
    },
    onSuccess: () => setError(null),
    onError: (err: unknown) => setError(err instanceof Error ? err.message : 'Failed to save prompt')
  })

  const updateField = (field: keyof PromptForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  return {
    form,
    updateField,
    save: () => mutation.mutate(),
    isSaving: mutation.isPending,
    error
  }
}
