import type { App, CreateAppPayload, UpdateAppPayload } from '../types/types';

const BASE = '/api/apps';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(error?.error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

export const AppApi = {
  getAll: (): Promise<App[]> =>
    fetch(BASE).then((r) => handleResponse<App[]>(r)),

  create: (payload: CreateAppPayload): Promise<App> =>
    fetch(BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((r) => handleResponse<App>(r)),

  update: (id: string, payload: UpdateAppPayload): Promise<App> =>
    fetch(`${BASE}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then((r) => handleResponse<App>(r)),

  delete: (id: string): Promise<void> =>
    fetch(`${BASE}/${id}`, { method: 'DELETE' }).then((r) =>
      handleResponse<void>(r)
    ),
};
