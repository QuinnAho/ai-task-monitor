import { usePromptEditor } from '../hooks/usePromptEditor'

function PromptEditor() {
  const { form, updateField, save, isSaving, error } = usePromptEditor()

  return (
    <div className="panel">
      <h3>Prompt Template</h3>
      <input
        placeholder="Prompt ID"
        value={form.id}
        onChange={(e) => updateField('id', e.target.value)}
      />
      <input
        placeholder="Description"
        value={form.description}
        onChange={(e) => updateField('description', e.target.value)}
      />
      <textarea
        className="json-editor"
        placeholder='Prompt body JSON (e.g., {"steps":[]})'
        value={form.body}
        onChange={(e) => updateField('body', e.target.value)}
        rows={6}
      />
      <input
        placeholder="Summary file"
        value={form.summaryFile}
        onChange={(e) => updateField('summaryFile', e.target.value)}
      />
      <input
        placeholder="Summary purpose"
        value={form.summaryPurpose}
        onChange={(e) => updateField('summaryPurpose', e.target.value)}
      />
      {error && <p>{error}</p>}
      <button className="primary" type="button" onClick={save} disabled={isSaving}>
        {isSaving ? 'Saving…' : 'Save Prompt'}
      </button>
    </div>
  )
}

export default PromptEditor
