import React, { useReducer, useCallback, useEffect } from 'react'
import type { App, CreateAppPayload, UpdateAppPayload, FilterStatus, SortBy } from '../types/types'
import { AppContext } from './AppContext'
import type { AppState } from './AppContext'

const initialState: AppState = {
  apps: [],
  loading: false,
  error: null,
  filter: 'all',
  sortBy: 'createdAt',
  searchQuery: '',
}

type Action =
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: App[] }
  | { type: 'FETCH_ERROR'; payload: string }
  | { type: 'ADD_APP'; payload: App }
  | { type: 'UPDATE_APP'; payload: App }
  | { type: 'DELETE_APP'; payload: string }
  | { type: 'SET_FILTER'; payload: FilterStatus }
  | { type: 'SET_SORT'; payload: SortBy }
  | { type: 'SET_SEARCH'; payload: string }
  | { type: 'CLEAR_ERROR' }

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'FETCH_START':
      return { ...state, loading: true, error: null }
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, apps: action.payload }
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload }
    case 'ADD_APP':
      return { ...state, apps: [action.payload, ...state.apps] }
    case 'UPDATE_APP':
      return {
        ...state,
        apps: state.apps.map(t => t.id === action.payload.id ? action.payload : t),
      }
    case 'DELETE_APP':
      return { ...state, apps: state.apps.filter(t => t.id !== action.payload) }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload }
    case 'SET_SEARCH':
      return { ...state, searchQuery: action.payload }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

const priorityWeight = { high: 0, medium: 1, low: 2 }

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const fetchApps = useCallback(async () => {
    dispatch({ type: 'FETCH_START' })
    try {
      const res = await fetch('/api/apps')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      dispatch({ type: 'FETCH_SUCCESS', payload: data })
    } catch (err) {
      dispatch({ type: 'FETCH_ERROR', payload: err instanceof Error ? err.message : 'Something went wrong' })
    }
  }, [])

  const addApp = useCallback(async (payload: CreateAppPayload) => {
    try {
      const res = await fetch('/api/apps', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const app = await res.json()
      dispatch({ type: 'ADD_APP', payload: app })
    } catch {
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to add app' })
    }
  }, [])

  const updateApp = useCallback(async (id: string, payload: UpdateAppPayload) => {
    try {
      const res = await fetch(`/api/apps/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const app = await res.json()
      dispatch({ type: 'UPDATE_APP', payload: app })
    } catch {
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to update app' })
    }
  }, [])

  const deleteApp = useCallback(async (id: string) => {
    try {
      await fetch(`/api/apps/${id}`, { method: 'DELETE' })
      dispatch({ type: 'DELETE_APP', payload: id })
    } catch {
      dispatch({ type: 'FETCH_ERROR', payload: 'Failed to delete app' })
    }
  }, [])

  const toggleApp = useCallback(async (id: string) => {
    const app = state.apps.find(t => t.id === id)
    if (!app) return
    await updateApp(id, { completed: !app.completed })
  }, [state.apps, updateApp])

  const setFilter = useCallback((f: FilterStatus) => dispatch({ type: 'SET_FILTER', payload: f }), [])
  const setSortBy = useCallback((s: SortBy) => dispatch({ type: 'SET_SORT', payload: s }), [])
  const setSearchQuery = useCallback((q: string) => dispatch({ type: 'SET_SEARCH', payload: q }), [])
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), [])

  const filteredApps = React.useMemo(() => {
    let result = [...state.apps]

    if (state.filter === 'active') result = result.filter(t => !t.completed)
    if (state.filter === 'completed') result = result.filter(t => t.completed)

    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase()
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q)
      )
    }

    result.sort((a, b) => {
      if (state.sortBy === 'priority') return priorityWeight[a.priority] - priorityWeight[b.priority]
      if (state.sortBy === 'title') return a.title.localeCompare(b.title)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })

    return result
  }, [state.apps, state.filter, state.searchQuery, state.sortBy])

  const stats = React.useMemo(() => {
    const total = state.apps.length
    const completed = state.apps.filter(t => t.completed).length
    return { total, completed, active: total - completed }
  }, [state.apps])

  useEffect(() => {
    fetchApps()
  }, [fetchApps])

  return (
    <AppContext.Provider value={{
      ...state,
      fetchApps,
      addApp,
      updateApp,
      deleteApp,
      toggleApp,
      setFilter,
      setSortBy,
      setSearchQuery,
      clearError,
      filteredApps,
      stats,
    }}>
      {children}
    </AppContext.Provider>
  )
}
