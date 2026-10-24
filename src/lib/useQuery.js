import { useCallback, useEffect, useState } from 'react'
import { db } from './firebase.js'

/**
 * Small data hook: runs `queryFn(db)` (which returns a Promise of data) and
 * falls back to `fallback` when Firebase isn't configured or the request fails.
 */
export function useQuery(key, queryFn, fallback) {
  const [state, setState] = useState({ data: fallback, loading: Boolean(db), error: null })
  const [tick, setTick] = useState(0)
  const reload = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (!db) return
    let live = true
    Promise.resolve()
      .then(() => queryFn(db))
      .then((data) => live && setState({ data: data ?? fallback, loading: false, error: null }))
      .catch((error) => {
        if (!live) return
        console.warn(`[${key}]`, error)
        setState({ data: fallback, loading: false, error })
      })
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick])

  return { ...state, reload }
}

/** Turn a Firestore QuerySnapshot into plain objects with an `id`. */
export const rows = (snap) => snap.docs.map((d) => ({ id: d.id, ...d.data() }))

/** Firestore Timestamp | Date | string -> Date */
export const toDate = (v) => (v?.toDate ? v.toDate() : v ? new Date(v) : null)
