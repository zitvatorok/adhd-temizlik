import { useEffect, useState } from 'react'

export function useLocalStorageState(key, defaultValue) {
  const [state, setState] = useState(() => {
    if (typeof window === 'undefined') return defaultValue
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return defaultValue
      return JSON.parse(raw)
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state))
    } catch {
      // sessizce yoksay
    }
  }, [key, state])

  return [state, setState]
}

