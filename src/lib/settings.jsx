import { createContext, useContext, useMemo } from 'react'
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

const SettingsContext = createContext({ settings: DEFAULT_SETTINGS, reload: () => {} })

export function SettingsProvider({ children }) {
  const { data, reload } = useQuery('site_settings', (sb) => sb.from('site_settings').select('key,value'), [])
  const settings = useMemo(() => {
    const merged = { ...DEFAULT_SETTINGS }
    for (const row of data || []) if (row.value) merged[row.key] = row.value
    return merged
  }, [data])
  return <SettingsContext.Provider value={{ settings, reload }}>{children}</SettingsContext.Provider>
}

export function useSettings() {
  return useContext(SettingsContext)
}
