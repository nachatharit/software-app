import { useState } from 'react'
import type { App } from '../types/types'
import { useApps } from '../context/useApps'
import { formatRelativeTime } from '../utils/helpers'

interface Props {
  app: App
  onEdit: (app: App) => void
}

export function AppItem({ app, onEdit }: Props) {
  const { toggleApp, deleteApp } = useApps()
  const [toggling, setToggling] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleToggle = async () => {
    setToggling(true)
    await toggleApp(app.id)
    setToggling(false)
  }

  const handleDelete = async () => {
    setDeleting(true)
    await deleteApp(app.id)
  }

  return (
    <li className={`app-item ${app.completed ? 'app-item--done' : ''} ${deleting ? 'app-item--deleting' : ''}`}>
      <button
        className={`app-checkbox ${toggling ? 'app-checkbox--loading' : ''}`}
        onClick={handleToggle}
        disabled={toggling}
        aria-label={app.completed ? 'Mark as active' : 'Mark as done'}
      >
        {toggling ? (
          <span className="spinner-xs" />
        ) : app.completed ? (
          <svg viewBox="0 0 16 16" fill="none" className="check-icon">
            <path d="M3 8l3.5 3.5L13 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </button>

      <div className="app-body">
        <div className="app-top">
          <span className="app-title">{app.title}</span>
          <span className={`priority-badge priority-badge--${app.priority}`}>
            {app.priority}
          </span>
        </div>
        {app.description && (
          <p className="app-desc">{app.description}</p>
        )}
        <span className="app-meta">{formatRelativeTime(app.createdAt)}</span>
      </div>

      <div className="app-actions">
        <button className="action-btn action-btn--edit" onClick={() => onEdit(app)} aria-label="Edit">
          <svg viewBox="0 0 16 16" fill="none">
            <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="action-btn action-btn--delete" onClick={handleDelete} disabled={deleting} aria-label="Delete">
          {deleting ? (
            <span className="spinner-xs" />
          ) : (
            <svg viewBox="0 0 16 16" fill="none">
              <path d="M3 4h10M6 4V2h4v2M5 4v9h6V4H5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>
    </li>
  )
}
