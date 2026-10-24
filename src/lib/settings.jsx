import { createContext, useContext, useMemo } from 'react'
import { doc, getDoc } from 'firebase/firestore/lite'
import { useQuery } from './useQuery.js'

export const DEFAULT_SETTINGS = {
  sirkle_join_url: import.meta.env.VITE_SIRKLE_JOIN_URL || '',
  sirkle_calendar_embed_url: import.meta.env.VITE_SIRKLE_CALENDAR_EMBED_URL || '',
  contact_email: 'hello@neonwalkclub.com',
  instagram_url: '',
  member_count: '350',
  walks_per_week: '5–6',
}

export const SETTING_LABELS = {
  sirkle_join_url: 'Sirkle invite / join link',
  sirkle_calendar_embed_url: 'Sirkle calendar embed URL (the src="…" part of the embed code)',
  contact_email: 'Contact email shown on the site',
  instagram_url: 'Instagram URL (optional)',
  member_count: 'Member count (shown on the homepage)',
  walks_per_week: 'Walks per week (e.g. 5–6)',
}

// All settings live in one Firestore document: config/site
export const SETTINGS_DOC = ['config', 'site']

const SettingsContext = createContext({ settings: DEFAULT_SETTINGS, reload: () => {} })

export function SettingsProvider({ children }) {
  const { data, reload } = useQuery(
    'settings',
    async (db) => {
      const snap = await getDoc(doc(db, ...SETTINGS_DOC))
      return snap.exists() ? snap.data() : {}
    },
    {},
  )
  const settings = useMemo(() => {
    const merged = { ...DEFAULT_SETTINGS }
    for (const [k, v] of Object.entries(data || {})) if (typeof v === 'string' && v) merged[k] = v
    return merged
  }, [data])
  return <SettingsContext.Provider value={{ settings, reload }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
