import { useState, useCallback } from 'react'

const STORAGE_KEY = 'learning-log-progress'

function load(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return new Set(parsed as number[])
  } catch {
    // ignore parse errors
  }
  return new Set()
}

function save(days: Set<number>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...days]))
}

export function useProgress() {
  const [completed, setCompleted] = useState<Set<number>>(load)

  const markDone = useCallback((day: number) => {
    setCompleted(prev => {
      const next = new Set(prev)
      next.add(day)
      save(next)
      return next
    })
  }, [])

  const markUndone = useCallback((day: number) => {
    setCompleted(prev => {
      const next = new Set(prev)
      next.delete(day)
      save(next)
      return next
    })
  }, [])

  const isDone = useCallback((day: number) => completed.has(day), [completed])

  const toggleDone = useCallback((day: number) => {
    if (completed.has(day)) {
      markUndone(day)
    } else {
      markDone(day)
    }
  }, [completed, markDone, markUndone])

  const completedCount = completed.size
  const streak = (() => {
    let s = 0
    for (let i = 1; i <= 30; i++) {
      if (completed.has(i)) s++
      else break
    }
    return s
  })()

  return { completed, markDone, markUndone, isDone, toggleDone, completedCount, streak }
}
