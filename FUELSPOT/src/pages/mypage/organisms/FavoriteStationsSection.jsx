import { useEffect, useState } from 'react'
import { addFavorite, getFavorites, removeFavorite } from '../../../api/favoriteService'
import { STATIONS } from '../../../constants/stations'
import FavoriteButton from '../../mainpage/atoms/FavoriteButton'
import StationCard from '../../mainpage/molecules/StationCard'

function FavoriteStationsSection() {
  const [favoriteStations, setFavoriteStations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const data = await getFavorites()
      const favoriteIds = data.map(f => String(f.stationId))
      const filtered = STATIONS.filter(s => favoriteIds.includes(String(s.id)))
      setFavoriteStations(filtered)
    } catch (error) {
      console.error('Failed to load favorites:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleFavorite = async (stationId) => {
    try {
      const isCurrentlyFavorite = favoriteStations.some(s => s.id === stationId)
      
      if (isCurrentlyFavorite) {
        await removeFavorite(stationId)
        setFavoriteStations(prev => prev.filter(s => s.id !== stationId))
      } else {
        await addFavorite(stationId)
        const station = STATIONS.find(s => s.id === stationId)
        if (station) {
          setFavoriteStations(prev => [...prev, station])
        }
      }
    } catch (error) {
      alert('즐겨찾기 처리 중 오류가 발생했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {favoriteStations.length > 0 ? (
          favoriteStations.map(station => (
            <div key={station.id} className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <StationCard station={station} />
              <div className="absolute top-4 right-4 z-[1]">
                <FavoriteButton
                  stationId={station.id}
                  isFavorite={true}
                  onToggle={handleToggleFavorite}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-400 text-sm italic">
            즐겨찾기한 주유소가 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

export default FavoriteStationsSection
