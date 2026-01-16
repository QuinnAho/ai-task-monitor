import { useEffect, useState } from 'react'
import axios from 'axios'

interface PlannerForm {
  title: string
  summary: string
  inputs: string
  expectedFiles: string
  acceptanceCriteria: string
  references: string
}

const EMPTY_FORM: PlannerForm = {
  title: '',
  summary: '',
  inputs: '',
  expectedFiles: '',
  acceptanceCriteria: '',
  references: 'ai/AI_TASK_MONITOR_CONTRACT.md'
}

function FeaturePlanner() {
  const [form, setForm] = useState<PlannerForm>(EMPTY_FORM)
  const [masterPrompt, setMasterPrompt] = useState('')
  const [planBody, setPlanBody] = useState('')
  const [planSummary, setPlanSummary] = useState('')
  const [proposedTaskId, setProposedTaskId] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    axios
      .get('/api/contracts/prompts')
      .then((response) => {
        setMasterPrompt(response.data?.body ?? '')
      })
      .catch(() => {
        setMasterPrompt('')
      })
  }, [])

  const updateField = (field: keyof PlannerForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleGenerate = async () => {
    if (!form.title || !form.summary || !form.inputs || !form.expectedFiles || !form.acceptanceCriteria) {
      setError('Fill out title, summary, inputs, files, and acceptance criteria before generating.')
      return
    }
    setIsGenerating(true)
    setError(null)
    try {
      const response = await axios.post('/api/features/plan', {
        title: form.title,
        summary: form.summary,
        inputs: form.inputs,
        expectedFiles: form.expectedFiles,
        acceptanceCriteria: form.acceptanceCriteria,
        references: form.references || 'ai/AI_TASK_MONITOR_CONTRACT.md'
      })
      setPlanBody(response.data.plan?.body ?? '')
      setPlanSummary(response.data.plan?.description ?? '')
      setProposedTaskId(response.data.taskId ?? null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate plan')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="panel">
      <div className="panel-header">
        <h3>Feature Planner</h3>
        <span>Feasibility first</span>
      </div>
      <details className="master-prompt-details" open>
        <summary>Master Prompt Workflow</summary>
        <pre className="master-prompt">{masterPrompt || 'Master prompt not available.'}</pre>
      </details>
      <div className="field-grid">
        <input placeholder="Title" value={form.title} onChange={(e) => updateField('title', e.target.value)} />
        <textarea
          className="json-editor"
          rows={3}
          placeholder="Summary"
          value={form.summary}
          onChange={(e) => updateField('summary', e.target.value)}
        />
        <textarea
          className="json-editor"
          rows={3}
          placeholder="Inputs/context (files, docs, constraints)"
          value={form.inputs}
          onChange={(e) => updateField('inputs', e.target.value)}
        />
        <textarea
          className="json-editor"
          rows={3}
          placeholder="Expected files/artifacts (semicolon separated)"
          value={form.expectedFiles}
          onChange={(e) => updateField('expectedFiles', e.target.value)}
        />
        <textarea
          className="json-editor"
          rows={3}
          placeholder="Acceptance criteria"
          value={form.acceptanceCriteria}
          onChange={(e) => updateField('acceptanceCriteria', e.target.value)}
        />
        <input
          placeholder="References (defaults to ai/AI_TASK_MONITOR_CONTRACT.md)"
          value={form.references}
          onChange={(e) => updateField('references', e.target.value)}
        />
      </div>
      {error && <p>{error}</p>}
      <button className="primary" type="button" onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? 'Generating plan...' : 'Generate Feature Plan'}
      </button>
      {planBody && (
        <div className="plan-preview">
          <h4>{planSummary || 'Plan Output'}</h4>
          {proposedTaskId && <p><strong>Proposed Task ID:</strong> {proposedTaskId} (auto-assigned)</p>}
          <textarea className="json-editor" value={planBody} readOnly rows={12} />
        </div>
      )}
    </div>
  )
}

export default FeaturePlanner
