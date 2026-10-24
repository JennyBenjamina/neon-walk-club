import { collection, getDocs, limit as qLimit, orderBy, query, where } from 'firebase/firestore/lite'
import { useQuery, rows } from './useQuery.js'
import { pathFromFirestore } from './firebase.js'
import { FALLBACK_ROUTES } from '../data/fallback.js'

const bySort = (a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
const newestFirst = (a, b) => (b.created_at?.seconds ?? 0) - (a.created_at?.seconds ?? 0)

export const useRoutes = () =>
  useQuery(
    'routes',
    async (db) => {
      const list = rows(await getDocs(query(collection(db, 'routes'), where('is_published', '==', true))))
      if (!list.length) return FALLBACK_ROUTES
      return list.sort(bySort).map((r) => ({ ...r, path: pathFromFirestore(r.path) }))
    },
    FALLBACK_ROUTES,
  )

export const useGallery = (max = 60) =>
  useQuery(
    `gallery-${max}`,
    async (db) => rows(await getDocs(query(collection(db, 'gallery_photos'), orderBy('created_at', 'desc'), qLimit(max)))),
    [],
  )

export const useSpotlights = () =>
  useQuery(
    'spotlights',
    async (db) =>
      rows(await getDocs(query(collection(db, 'spotlights'), where('is_published', '==', true)))).sort(newestFirst),
    [],
  )

export const usePartners = () =>
  useQuery(
    'partners',
    async (db) => rows(await getDocs(query(collection(db, 'partners'), where('is_active', '==', true)))).sort(bySort),
    [],
  )
