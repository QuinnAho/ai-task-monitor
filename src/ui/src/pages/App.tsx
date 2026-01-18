import { useCallback, useState } from 'react'
import TaskBoard from '../components/TaskBoard'
import TaskDetail from '../components/TaskDetail'
import ContractEditor from '../components/ContractEditor'
import PromptEditor from '../components/PromptEditor'
import FeaturePlanner from '../components/FeaturePlanner'
import '../styles/layout.css'

const MIN_PANEL_WIDTH = 220
const MAX_PANEL_WIDTH = 800
const HANDLE_WIDTH = 8

function App() {
  const [sidebarWidth, setSidebarWidth] = useState((window.innerWidth - 16) / 3)
  const [secondaryWidth, setSecondaryWidth] = useState((window.innerWidth - 16) / 3)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [secondaryCollapsed, setSecondaryCollapsed] = useState(false)

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

  const toggleSidebar = () => setSidebarCollapsed((prev) => !prev)
  const toggleSecondary = () => setSecondaryCollapsed((prev) => !prev)

  const layoutColumns = [
    sidebarCollapsed ? '0px' : `${sidebarWidth}px`,
    `${HANDLE_WIDTH}px`,
    '1fr',
    `${HANDLE_WIDTH}px`,
    secondaryCollapsed ? '0px' : `${secondaryWidth}px`
  ].join(' ')

  return (
    <div
      className="app-layout"
      style={{
        gridTemplateColumns: layoutColumns
      }}
    >
      <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
        {!sidebarCollapsed && (
          <div className="sidebar-section">
            <div className="panel-header">
              <h2>Tasks</h2>
            </div>
            <TaskBoard />
          </div>
        )}
      </aside>
      <div
        className={`resize-handle left-handle ${sidebarCollapsed ? 'is-collapsed' : ''}`}
        role="separator"
        aria-orientation="vertical"
        onMouseDown={!sidebarCollapsed ? beginResize('sidebar') : undefined}
      >
      </div>
      <main className="main-section">
        <TaskDetail />
      </main>
      <div
        className={`resize-handle right-handle ${secondaryCollapsed ? 'is-collapsed' : ''}`}
        role="separator"
        aria-orientation="vertical"
        onMouseDown={!secondaryCollapsed ? beginResize('secondary') : undefined}
      >
      </div>
      <aside className={`secondary-panel ${secondaryCollapsed ? 'collapsed' : ''}`}>
        {!secondaryCollapsed && (
          <>
            <FeaturePlanner />
            <ContractEditor />
            <PromptEditor />
          </>
        )}
      </aside>
    </div>
  )
}

export default App
