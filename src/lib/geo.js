// Distance helpers for route paths given as [[lat, lng], ...]
const R_MILES = 3958.8

export function segmentMiles([lat1, lng1], [lat2, lng2]) {
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(lat2 - lat1)
  const dLng = toRad(lng2 - lng1)
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2
  return 2 * R_MILES * Math.asin(Math.sqrt(a))
}

export function pathMiles(path = []) {
  let total = 0
  for (let i = 1; i < path.length; i++) total += segmentMiles(path[i - 1], path[i])
  return total
}

// Relaxed group pace, about 3 mph, not counting photo stops.
export function walkMinutes(miles, mph = 3) {
  return Math.round(((miles / mph) * 60) / 5) * 5
}
