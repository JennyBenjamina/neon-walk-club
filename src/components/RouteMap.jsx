import { useEffect } from 'react'
import { MapContainer, TileLayer, Polyline, CircleMarker, Tooltip, useMap } from 'react-leaflet'

function FitTo({ path }) {
  const map = useMap()
  useEffect(() => {
    if (path?.length) map.fitBounds(path, { padding: [40, 40], maxZoom: 16 })
  }, [map, path])
  return null
}

export default function RouteMap({ routes, selected, onSelect }) {
  const active = routes.find((r) => r.slug === selected) || routes[0]
  return (
    <div className="route-map card">
      <MapContainer center={[36.125, -115.165]} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        {routes.map((r) => {
          const isActive = r.slug === active?.slug
          return (
            <Polyline
              key={r.slug}
              positions={r.path}
              pathOptions={{ color: r.color, weight: isActive ? 7 : 4, opacity: isActive ? 1 : 0.35 }}
              eventHandlers={{ click: () => onSelect(r.slug) }}
            >
              <Tooltip sticky>{r.name}</Tooltip>
            </Polyline>
          )
        })}
        {active && (
          <>
            <CircleMarker center={active.path[0]} radius={8} pathOptions={{ color: '#fff', fillColor: active.color, fillOpacity: 1 }}>
              <Tooltip direction="top">Start</Tooltip>
            </CircleMarker>
            <CircleMarker center={active.path[active.path.length - 1]} radius={8} pathOptions={{ color: active.color, fillColor: '#0a0612', fillOpacity: 1, weight: 3 }}>
              <Tooltip direction="top">Finish</Tooltip>
            </CircleMarker>
            <FitTo path={active.path} />
          </>
        )}
      </MapContainer>
    </div>
  )
}
