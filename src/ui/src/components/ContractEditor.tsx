import { useContractEditor } from '../hooks/useContractEditor'

function ContractEditor() {
  const { content, setContent, save, isSaving, error } = useContractEditor()

  return (
    <div className="panel">
      <h3>Contract Editor</h3>
      <textarea
        className="json-editor"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={10}
      />
      {error && <p>{error}</p>}
      <button className="primary" type="button" onClick={save} disabled={isSaving}>
        {isSaving ? 'Saving…' : 'Save Contract'}
      </button>
    </div>
  )
}

export default ContractEditor
