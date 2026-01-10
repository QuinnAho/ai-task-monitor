import { useCallback, useState } from 'react'
import TaskBoard from '../components/TaskBoard'
import TaskDetail from '../components/TaskDetail'
import ContractEditor from '../components/ContractEditor'
import PromptEditor from '../components/PromptEditor'
import '../styles/layout.css'

const MIN_PANEL_WIDTH = 220
const MAX_PANEL_WIDTH = 520

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [secondaryWidth, setSecondaryWidth] = useState(320)

  const clamp = (value: number) => Math.min(Math.max(value, MIN_PANEL_WIDTH), MAX_PANEL_WIDTH)

  const beginResize = useCallback(
    (target: 'sidebar' | 'secondary') => (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      const startX = event.clientX
      const startSidebar = sidebarWidth
      const startSecondary = secondaryWidth

      function onMouseMove(moveEvent: MouseEvent) {
        const delta = moveEvent.clientX - startX
        if (target === 'sidebar') {
          setSidebarWidth(clamp(startSidebar + delta))
        } else {
          setSecondaryWidth(clamp(startSecondary - delta))
        }
      }

      function stopDrag() {
        window.removeEventListener('mousemove', onMouseMove)
        window.removeEventListener('mouseup', stopDrag)
        window.removeEventListener('mouseleave', stopDrag)
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('mouseup', stopDrag)
      window.addEventListener('mouseleave', stopDrag)
    },
    [sidebarWidth, secondaryWidth]
  )

  return (
    <div
      className="app-layout"
      style={{
        gridTemplateColumns: `${sidebarWidth}px 6px 1fr 6px ${secondaryWidth}px`
      }}
    >
      <aside className="sidebar">
        <div className="sidebar-section">
          <h2>Tasks</h2>
          <TaskBoard />
        </div>
      </aside>
      <div
        className="resize-handle"
        role="separator"
        aria-orientation="vertical"
        onMouseDown={beginResize('sidebar')}
      />
      <main className="main-section">
        <TaskDetail />
      </main>
      <div
        className="resize-handle"
        role="separator"
        aria-orientation="vertical"
        onMouseDown={beginResize('secondary')}
      />
      <aside className="secondary-panel">
        <ContractEditor />
        <PromptEditor />
      </aside>
    </div>
  )
}

export default App
