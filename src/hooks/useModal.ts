import { useState, useCallback } from 'react'
import type { App } from '../types/types'

type ModalMode = 'create' | 'edit'

interface ModalState {
  isOpen: boolean
  mode: ModalMode
  app: App | null
}

export function useModal() {
  const [modal, setModal] = useState<ModalState>({ isOpen: false, mode: 'create', app: null })

  const openCreate = useCallback(() => {
    setModal({ isOpen: true, mode: 'create', app: null })
  }, [])

  const openEdit = useCallback((app: App) => {
    setModal({ isOpen: true, mode: 'edit', app })
  }, [])

  const close = useCallback(() => {
    setModal(prev => ({ ...prev, isOpen: false, app: null }))
  }, [])

  return { modal, openCreate, openEdit, close }
}
