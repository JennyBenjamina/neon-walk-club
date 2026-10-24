import { useQuery } from './useQuery.js'
import { FALLBACK_ROUTES } from '../data/fallback.js'

export const useRoutes = () =>
  useQuery(
    'routes',
    (sb) => sb.from('routes').select('*').eq('is_published', true).order('sort_order'),
    FALLBACK_ROUTES,
  )

export const useGallery = (limit = 60) =>
  useQuery(
    `gallery-${limit}`,
    (sb) => sb.from('gallery_photos').select('*').order('sort_order').order('created_at', { ascending: false }).limit(limit),
    [],
  )

export const useSpotlights = () =>
  useQuery(
    'spotlights',
    (sb) => sb.from('spotlights').select('*').eq('is_published', true).order('created_at', { ascending: false }),
    [],
  )

export const usePartners = () =>
  useQuery(
    'partners',
    (sb) => sb.from('partners').select('*').eq('is_active', true).order('sort_order'),
    [],
  )
