import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Coordenadas fixas
const ORIGEM = [-23.5505, -46.6333] // João (São Paulo)
const DESTINO = [-23.5612, -46.6560] // Passageiro

// Ícone customizado do carro (emoji 🚗 com tamanho maior para touch)
const createCarIcon = () => {
  return L.divIcon({
    className: 'custom-car-icon',
    html: '<div style="font-size: 20px;">🚗</div>',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  })
}

// Componente interno para invalidar tamanho do mapa (mobile optimization)
function MapSizeInvalidator() {
  const map = useMap()

  useEffect(() => {
    // Pequeno delay para garantir que o DOM está pronto
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 100)

    // Invalidar também quando a janela redimensionar
    const handleResize = () => {
      map.invalidateSize()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
    }
  }, [map])

  return null
}

function MapaRastreamento() {
  const [route, setRoute] = useState([])
  const [carPosition, setCarPosition] = useState(ORIGEM)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationFrameRef = useRef(null)
  const startTimeRef = useRef(null)

  // Fetch da rota via OSRM (demo service, pode ter rate limit)
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // OSRM espera [lon, lat] na URL
        const url = `http://router.project-osrm.org/route/v1/driving/${ORIGEM[1]},${ORIGEM[0]};${DESTINO[1]},${DESTINO[0]}?overview=full&geometries=geojson`
        
        const response = await fetch(url)
        if (!response.ok) throw new Error('OSRM request failed')
        
        const data = await response.json()
        
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          // Converter GeoJSON [lon, lat] para Leaflet [lat, lon]
          const coordinates = data.routes[0].geometry.coordinates.map(
            (coord) => [coord[1], coord[0]]
          )
          setRoute(coordinates)
        } else {
          // Fallback: rota reta se OSRM falhar
          setRoute([ORIGEM, DESTINO])
        }
      } catch (error) {
        console.warn('Erro ao buscar rota OSRM, usando rota reta:', error)
        // Fallback: rota reta
        setRoute([ORIGEM, DESTINO])
      }
    }

    fetchRoute()
  }, [])

  // Animar carro pela rota
  useEffect(() => {
    if (route.length === 0) return

    // Resetar posição e estado quando rota mudar
    setCarPosition(ORIGEM)
    setIsAnimating(true)
    startTimeRef.current = Date.now()
    const duration = 1000000 // 45 segundos

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Interpolação linear ao longo da rota
      const totalSegments = route.length - 1
      const segmentProgress = progress * totalSegments
      const segmentIndex = Math.floor(segmentProgress)
      const segmentFraction = segmentProgress - segmentIndex

      if (segmentIndex < totalSegments) {
        const start = route[segmentIndex]
        const end = route[segmentIndex + 1]
        const lat = start[0] + (end[0] - start[0]) * segmentFraction
        const lng = start[1] + (end[1] - start[1]) * segmentFraction
        setCarPosition([lat, lng])
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Chegou ao destino
        setCarPosition(DESTINO)
        setIsAnimating(false)
      }
    }

    animationFrameRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [route])

  return (
    <MapContainer
      center={ORIGEM}
      zoom={13}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={false}
      dragging={true}
      touchZoom={true}
    >
      <MapSizeInvalidator />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {route.length > 0 && (
        <Polyline
          positions={route}
          pathOptions={{
            color: '#2563eb',
            weight: 6,
            opacity: 0.8,
          }}
        />
      )}

      <Marker position={carPosition} icon={createCarIcon()}>
        <Popup autoOpen={false} closeButton={false}>
          João a caminho!
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default MapaRastreamento

