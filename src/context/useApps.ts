import { useContext } from 'react'
import { AppContext } from './AppContext'

export function useApps() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApps must be inside AppProvider')
  return ctx
}
