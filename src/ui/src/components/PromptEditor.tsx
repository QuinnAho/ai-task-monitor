import { useMemo, useState } from 'react'
import { usePromptEditor } from '../hooks/usePromptEditor'

function PromptEditor() {
  const {
    form,
    updateField,
    save,
    isSaving,
    blueprints,
    isLoadingBlueprints,
    generateFromBlueprint,
    isGenerating,
    error
  } = usePromptEditor()
  const [selectedBlueprint, setSelectedBlueprint] = useState('')
  const [variablesText, setVariablesText] = useState('{}')
  const [blueprintMessage, setBlueprintMessage] = useState<string | null>(null)

  const selectedMetadata = useMemo(
    () => blueprints.find((item) => item.blueprint_id === selectedBlueprint),
    [blueprints, selectedBlueprint]
  )

  const handleBlueprintChange = (value: string) => {
    setSelectedBlueprint(value)
    const blueprint = blueprints.find((item) => item.blueprint_id === value)
    if (blueprint) {
      const defaults = blueprint.placeholders.reduce<Record<string, string>>((acc, placeholder) => {
        acc[placeholder.name] = placeholder.default ?? ''
        return acc
      }, {})
      setVariablesText(JSON.stringify(defaults, null, 2))
    } else {
      setVariablesText('{}')
    }
    setBlueprintMessage(null)
  }

  const handleGenerate = () => {
    if (!selectedBlueprint) {
      setBlueprintMessage('Select a blueprint before generating.')
      return
    }
    try {
      const parsed = variablesText.trim() ? JSON.parse(variablesText) : {}
      generateFromBlueprint(selectedBlueprint, parsed)
      setBlueprintMessage(null)
    } catch {
      setBlueprintMessage('Variables JSON is invalid.')
    }
  }

  return (
    <div className="panel">
      <h3>Prompt Template</h3>
      <div className="blueprint-panel">
        <div className="panel-header tight">
          <h4>Generate from Blueprint</h4>
          {isLoadingBlueprints && <span>Loading...</span>}
        </div>
        <select value={selectedBlueprint} onChange={(event) => handleBlueprintChange(event.target.value)}>
          <option value="">Select blueprint</option>
          {blueprints.map((blueprint) => (
            <option key={blueprint.blueprint_id} value={blueprint.blueprint_id}>
              {blueprint.blueprint_id}
            </option>
          ))}
        </select>
        {selectedMetadata && (
          <ul className="blueprint-placeholders">
            {selectedMetadata.placeholders.map((placeholder) => (
              <li key={placeholder.name}>
                <strong>{placeholder.name}</strong> - {placeholder.description}{' '}
                {placeholder.required === false ? '(optional)' : ''}
                {placeholder.example && <em> e.g. {placeholder.example}</em>}
              </li>
            ))}
          </ul>
        )}
        <textarea
          className="json-editor"
          rows={6}
          placeholder='Variables JSON (e.g., {"task_id":"TASK_010"})'
          value={variablesText}
          onChange={(event) => setVariablesText(event.target.value)}
        />
        {blueprintMessage && <p>{blueprintMessage}</p>}
        <button
          className="secondary"
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating || (!selectedBlueprint && !variablesText)}
        >
          {isGenerating ? 'Generating.' : 'Generate from Blueprint'}
        </button>
      </div>
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
        {isSaving ? 'Saving.' : 'Save Prompt'}
      </button>
    </div>
  )
}

export default PromptEditor
