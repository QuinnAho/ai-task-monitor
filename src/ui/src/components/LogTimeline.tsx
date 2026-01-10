interface LogTimelineProps {
  entries: Record<string, unknown>[]
}

function LogTimeline({ entries }: LogTimelineProps) {
  if (entries.length === 0) {
    return <p>No log entries yet.</p>
  }

  return (
    <ul className="log-list">
      {entries.map((entry, index) => {
        const timestamp = String(entry.ts ?? '')
        const event = String(entry.event ?? '')
        const details = String(entry.details ?? '')
        const status = String(entry.status ?? '')
        return (
          <li key={index} className="log-item">
            <time>{timestamp}</time>
            <div>
              <strong>{event}</strong> - {details}
            </div>
            <small>{status}</small>
          </li>
        )
      })}
    </ul>
  )
}

export default LogTimeline
