import type { App } from '../types/types'
import { useApps } from '../context/useApps'
import { AppItem } from './ApppItem'

interface Props {
  onEdit: (app: App) => void
}

export function AppList({ onEdit }: Props) {
  const { filteredApps, loading, error, clearError, searchQuery, filter } = useApps()

  if (loading) {
    return (
      <div className="state-container">
        <div className="loading-grid">
          {[0, 1, 2, 3].map(i => (
            <div key={i} className="skeleton-item" style={{ animationDelay: `${i * 0.1}s` }} />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-container">
        <div className="error-card">
          <div className="error-icon">⚠</div>
          <p className="error-text">{error}</p>
          <button className="btn-primary" onClick={clearError}>Dismiss</button>
        </div>
      </div>
    )
  }

  if (filteredApps.length === 0) {
    const hasFilters = searchQuery || filter !== 'all'
    return (
      <div className="state-container">
        <div className="empty-state">
          <div className="empty-icon">{hasFilters ? '🔍' : '✦'}</div>
          <p className="empty-title">{hasFilters ? 'No tasks match your filters' : 'No tasks yet'}</p>
          <p className="empty-sub">{hasFilters ? 'Try adjusting your search or filter.' : 'Add your first task to get started.'}</p>
        </div>
      </div>
    )
  }

  return (
    <ul className="app-list" role="list">
      {filteredApps.map(app => (
        <AppItem key={app.id} app={app} onEdit={onEdit} />
      ))}
    </ul>
  )
}
