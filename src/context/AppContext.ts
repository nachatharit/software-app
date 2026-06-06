import { createContext } from 'react'
import type { App, CreateAppPayload, UpdateAppPayload, FilterStatus, SortBy } from '../types/types'

export interface AppState {
  apps: App[]
  loading: boolean
  error: string | null
  filter: FilterStatus
  sortBy: SortBy
  searchQuery: string
}

export interface AppContextValue extends AppState {
  fetchApps: () => Promise<void>
  addApp: (payload: CreateAppPayload) => Promise<void>
  updateApp: (id: string, payload: UpdateAppPayload) => Promise<void>
  deleteApp: (id: string) => Promise<void>
  toggleApp: (id: string) => Promise<void>
  setFilter: (f: FilterStatus) => void
  setSortBy: (s: SortBy) => void
  setSearchQuery: (q: string) => void
  clearError: () => void
  filteredApps: App[]
  stats: { total: number; completed: number; active: number }
}

export const AppContext = createContext<AppContextValue | undefined>(undefined)
