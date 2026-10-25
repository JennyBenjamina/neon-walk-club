// Google Analytics (through Firebase). Counts page views so organizers can see daily traffic
// in the Firebase console -> Analytics, or at analytics.google.com.
// Does nothing until VITE_FIREBASE_MEASUREMENT_ID is set.
import { app } from './firebase.js'

const measurementId = import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
let analyticsPromise = null

function getAnalyticsOnce() {
  if (!app || !measurementId) return Promise.resolve(null)
  if (!analyticsPromise) {
    // Loaded on demand so the analytics code doesn't slow down the first page load.
    analyticsPromise = import('firebase/analytics')
      .then(async ({ initializeAnalytics, isSupported, logEvent }) => {
        if (!(await isSupported())) return null
        // We send page views ourselves on every route change (see trackPageView).
        const analytics = initializeAnalytics(app, { config: { send_page_view: false } })
        return { analytics, logEvent }
      })
      .catch(() => null)
  }
  return analyticsPromise
}

export function trackPageView(path) {
  // Organizer pages aren't counted as site traffic.
  if (path.startsWith('/admin')) return
  getAnalyticsOnce().then((ga) => {
    if (!ga) return
    ga.logEvent(ga.analytics, 'page_view', {
      page_path: path,
      page_location: window.location.href,
      page_title: document.title,
    })
  })
}

// Records a button click or other action as a named event, e.g. trackEvent('join_sirkl_click').
// Shows up in Google Analytics under Reports -> Engagement -> Events.
export function trackEvent(name, params = {}) {
  if (window.location.pathname.startsWith('/admin')) return
  getAnalyticsOnce().then((ga) => {
    if (!ga) return
    ga.logEvent(ga.analytics, name, { page_path: window.location.pathname, ...params })
  })
}
