import { http, HttpResponse, delay } from 'msw'
import type { App } from '../types/types'

const generateId = () => Math.random().toString(36).substring(2, 10)
const now = () => new Date().toISOString()

let todos: App[] = [
  {
    id: generateId(),
    title: 'Set up project architecture',
    description: 'Configure Vite, TypeScript, Context API, and MSW mock layer.',
    completed: true,
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: generateId(),
    title: 'Design the UI',
    description: 'Dark theme with a clean, distinctive look. No purple gradients.',
    completed: true,
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: generateId(),
    title: 'Implement CRUD operations',
    description: 'Add, edit, delete, and toggle todos via the context + API layer.',
    completed: false,
    priority: 'high',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: generateId(),
    title: 'Write README',
    description: 'Explain setup steps and decisions made.',
    completed: false,
    priority: 'medium',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: generateId(),
    title: 'Record walkthrough video',
    description: '', 
    completed: false,
    priority: 'low',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
  },
]

export const handlers = [
  http.get('/api/todos', async () => {
    await delay(400)
    return HttpResponse.json(todos)
  }),

  http.post('/api/todos', async ({ request }) => {
    await delay(300)
    const body = await request.json() as { title: string; description?: string; priority?: string }
    const newTodo: App = {
      id: generateId(),
      title: body.title,
      description: body.description ?? '',
      completed: false,
      priority: (body.priority as App['priority']) ?? 'medium',
      createdAt: now(),
      updatedAt: now(),
    }
    todos = [newTodo, ...todos]
    return HttpResponse.json(newTodo, { status: 201 })
  }),

  http.patch('/api/todos/:id', async ({ params, request }) => {
    await delay(250)
    const updates = await request.json() as Partial<App>
    const idx = todos.findIndex(t => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'not found' }, { status: 404 })
    todos[idx] = { ...todos[idx], ...updates, updatedAt: now() }
    return HttpResponse.json(todos[idx])
  }),

  http.delete('/api/todos/:id', async ({ params }) => {
    await delay(250)
    todos = todos.filter(t => t.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
