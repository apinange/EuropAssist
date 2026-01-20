import { useEffect, useState, useRef } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'

// Coordenadas fixas para cenário de guincho
const ORIGEM_GUINCHO = [-23.5505, -46.6333] // Local do guincho (parceiro)
const DESTINO_CARRO = [-23.5612, -46.6560] // Local do carro quebrado

// Ícone customizado do guincho (emoji 🚛 com tamanho maior para touch)
const createGuinchoIcon = () => {
  return L.divIcon({
    className: 'custom-guincho-icon',
    html: '<div style="font-size: 32px;">🚛</div>',
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

function GuinchoRastreamento() {
  const [route, setRoute] = useState([])
  const [guinchoPosition, setGuinchoPosition] = useState(ORIGEM_GUINCHO)
  const [isAnimating, setIsAnimating] = useState(false)
  const animationFrameRef = useRef(null)
  const startTimeRef = useRef(null)

  // Fetch da rota via OSRM (demo service, pode ter rate limit)
  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // OSRM espera [lon, lat] na URL
        // IMPORTANTE: usar HTTPS para evitar mixed content em produção
        const url = `https://router.project-osrm.org/route/v1/driving/${ORIGEM_GUINCHO[1]},${ORIGEM_GUINCHO[0]};${DESTINO_CARRO[1]},${DESTINO_CARRO[0]}?overview=full&geometries=geojson`
        
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
          setRoute([ORIGEM_GUINCHO, DESTINO_CARRO])
        }
      } catch (error) {
        console.warn('Erro ao buscar rota OSRM, usando rota reta:', error)
        // Fallback: rota reta
        setRoute([ORIGEM_GUINCHO, DESTINO_CARRO])
      }
    }

    fetchRoute()
  }, [])

  // Animar guincho pela rota
  useEffect(() => {
    if (route.length === 0) return

    // Resetar posição e estado quando rota mudar
    setGuinchoPosition(ORIGEM_GUINCHO)
    setIsAnimating(true)
    startTimeRef.current = Date.now()
    const duration = 1000000 // 45 segundos (aproximadamente 15 minutos em tempo real)

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
        setGuinchoPosition([lat, lng])
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        // Chegou ao destino
        setGuinchoPosition(DESTINO_CARRO)
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
      center={ORIGEM_GUINCHO}
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
            color: '#f59e0b',
            weight: 6,
            opacity: 0.8,
          }}
        />
      )}

      <Marker position={guinchoPosition} icon={createGuinchoIcon()}>
        <Popup autoOpen={false} closeButton={false}>
          Guincho a caminho!
        </Popup>
      </Marker>
    </MapContainer>
  )
}

export default GuinchoRastreamento

