import { AppProvider } from './context/Context'
import { AppList } from './components/AppList'
import { AppForm } from './components/AppForm'
import { Toolbar } from './components/Toolbar'
import { StatsBar } from './components/StatsBar'
import { useModal } from './hooks/useModal'

function AppShell() {
  const { modal, openCreate, openEdit, close } = useModal()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="logo">

            <span className="logo-text">App</span>
          </div>
          <button className="btn-add" onClick={openCreate} aria-label="Add new task">
            <svg viewBox="0 0 16 16" fill="none" className="icon-plus">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            New Task
          </button>
        </div>
      </header>

      <main className="app-main">
        <div className="content-card">
          <StatsBar />
          <Toolbar />
          <AppList onEdit={openEdit} />
        </div>
      </main>

      {modal.isOpen && (
        <AppForm
          key={modal.app?.id ?? 'new'}
          mode={modal.mode}
          app={modal.app}
          onClose={close}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppShell />
    </AppProvider>
  )
}
