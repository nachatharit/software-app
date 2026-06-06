
export type Priority = 'low' | 'medium' | 'high'

export interface App {
  id: string
  title: string
  description: string
  completed: boolean
  priority: Priority
  createdAt: string
  updatedAt: string
}

export interface CreateAppPayload {
  title: string
  description?: string
  priority?: Priority
}

export interface UpdateAppPayload {
  title?: string
  description?: string
  priority?: Priority
  completed?: boolean
}

export type FilterStatus = 'all' | 'active' | 'completed'
export type SortBy = 'createdAt' | 'priority' | 'title'
