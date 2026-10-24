import { useCallback, useEffect, useState } from 'react'
import { supabase } from './supabase.js'

/**
 * Small data hook: runs `queryFn(supabase)` and falls back to `fallback`
 * when Supabase isn't configured or the request fails.
 */
export function useQuery(key, queryFn, fallback) {
  const [state, setState] = useState({ data: fallback, loading: Boolean(supabase), error: null })
  const [tick, setTick] = useState(0)
  const reload = useCallback(() => setTick((t) => t + 1), [])

  useEffect(() => {
    if (!supabase) return
    let live = true
    Promise.resolve(queryFn(supabase)).then(({ data, error }) => {
      if (!live) return
      setState({ data: error || data == null ? fallback : data, loading: false, error })
    })
    return () => {
      live = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, tick])

  return { ...state, reload }
}
