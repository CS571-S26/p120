// hooks/useLibrary.ts
import { useState, useEffect, useCallback } from 'react'

export type LibraryGame = {
  id: number
  title: string
  thumbnail: string
  status: 'Playing' | 'Played' | 'Backlog'
  platform: string
  genre: string
  favorite: boolean
  rating?: number       // 1-5 stars
  review?: string
  hours?: number
  addedAt: number       // timestamp
}

const STORAGE_KEY = 'checkpoint_library'

function loadLibrary(): LibraryGame[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLibrary(games: LibraryGame[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(games))
}

export function useLibrary() {
  const [games, setGames] = useState<LibraryGame[]>(() => loadLibrary())

  // Keep multiple tabs in sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setGames(loadLibrary())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const upsertGame = useCallback((game: LibraryGame) => {
    setGames(prev => {
      const exists = prev.find(g => g.id === game.id)
      const next = exists
        ? prev.map(g => g.id === game.id ? { ...g, ...game } : g)
        : [...prev, game]
      saveLibrary(next)
      return next
    })
  }, [])

  const removeGame = useCallback((id: number) => {
    setGames(prev => {
      const next = prev.filter(g => g.id !== id)
      saveLibrary(next)
      return next
    })
  }, [])

  const toggleFavorite = useCallback((id: number) => {
    setGames(prev => {
      const next = prev.map(g => g.id === id ? { ...g, favorite: !g.favorite } : g)
      saveLibrary(next)
      return next
    })
  }, [])

  const getGame = useCallback((id: number) => {
    return games.find(g => g.id === id) ?? null
  }, [games])

  return { games, upsertGame, removeGame, toggleFavorite, getGame }
}
