import React, { useState } from 'react'
import type { App, Priority } from '../types/types'
import { useApps } from '../context/useApps'

interface Props {
  mode: 'create' | 'edit'
  app?: App | null
  onClose: () => void
}

const priorities: Priority[] = ['high', 'medium', 'low']

export function AppForm({ mode, app, onClose }: Props) {
  const { addApp, updateApp } = useApps()

  const [title, setTitle] = useState(app?.title ?? '')
  const [description, setDescription] = useState(app?.description ?? '')
  const [priority, setPriority] = useState<Priority>(app?.priority ?? 'medium')
  const [submitting, setSubmitting] = useState(false)
  const [titleError, setTitleError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) {
      setTitleError('Title is required')
      return
    }
    setTitleError('')
    setSubmitting(true)
    try {
      if (mode === 'create') {
        await addApp({ title: title.trim(), description: description.trim(), priority })
      } else if (app) {
        await updateApp(app.id, { title: title.trim(), description: description.trim(), priority })
      }
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card" role="dialog" aria-modal="true">
        <div className="modal-header">
          <h2 className="modal-title">{mode === 'create' ? 'New Task' : 'Edit Task'}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form" noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="app-title">
              Title <span className="required">*</span>
            </label>
            <input
              id="app-title"
              className={`form-input ${titleError ? 'input-error' : ''}`}
              type="text"
              value={title}
              onChange={e => {
                setTitle(e.target.value)
                if (e.target.value.trim()) setTitleError('')
              }}
              placeholder="What needs to be done?"
              autoFocus
              maxLength={120}
            />
            {titleError && <span className="error-msg">{titleError}</span>}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="app-desc">Description</label>
            <textarea
              id="app-desc"
              className="form-input form-textarea"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={3}
              maxLength={400}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Priority</label>
            <div className="priority-picker">
              {priorities.map(p => (
                <button
                  key={p}
                  type="button"
                  className={`priority-btn priority-btn--${p} ${priority === p ? 'active' : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>
              {submitting
                ? <span className="spinner-sm" />
                : mode === 'create' ? 'Add Task' : 'Save Changes'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
