import { http, HttpResponse, delay } from 'msw'
import type { App } from '../types/types'

const generateId = () => Math.random().toString(36).substring(2, 10)
const now = () => new Date().toISOString()

let apps: App[] = [
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
    description: 'Add, edit, delete, and toggle items via the context + API layer.',
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
  http.get('/api/apps', async () => {
    await delay(400)
    return HttpResponse.json(apps)
  }),

  http.post('/api/apps', async ({ request }) => {
    await delay(300)
    const body = await request.json() as { title: string; description?: string; priority?: string }
    const newApp: App = {
      id: generateId(),
      title: body.title,
      description: body.description ?? '',
      completed: false,
      priority: (body.priority as App['priority']) ?? 'medium',
      createdAt: now(),
      updatedAt: now(),
    }
    apps = [newApp, ...apps]
    return HttpResponse.json(newApp, { status: 201 })
  }),

  http.patch('/api/apps/:id', async ({ params, request }) => {
    await delay(250)
    const updates = await request.json() as Partial<App>
    const idx = apps.findIndex(t => t.id === params.id)
    if (idx === -1) return HttpResponse.json({ error: 'not found' }, { status: 404 })
    apps[idx] = { ...apps[idx], ...updates, updatedAt: now() }
    return HttpResponse.json(apps[idx])
  }),

  http.delete('/api/apps/:id', async ({ params }) => {
    await delay(250)
    apps = apps.filter(t => t.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
