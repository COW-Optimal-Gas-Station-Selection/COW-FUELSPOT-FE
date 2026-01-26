import { useEffect, useState } from 'react'
import { STATIONS } from '../../../constants/stations'
import StationCard from '../../mainpage/molecules/StationCard'

function FavoriteStationsSection() {
  const [favoriteStations, setFavoriteStations] = useState([])

  useEffect(() => {
    const favoriteIds = JSON.parse(localStorage.getItem('favoriteStations') || '[]')
    const filtered = STATIONS.filter(s => favoriteIds.includes(s.id))
    setFavoriteStations(filtered)
  }, [])

  const handleToggleFavorite = (stationId) => {
    const currentIds = JSON.parse(localStorage.getItem('favoriteStations') || '[]')
    let nextIds
    if (currentIds.includes(stationId)) {
      nextIds = currentIds.filter(id => id !== stationId)
    } else {
      nextIds = [...currentIds, stationId]
    }
    localStorage.setItem('favoriteStations', JSON.stringify(nextIds))
    
    // UI 업데이트
    setFavoriteStations(STATIONS.filter(s => nextIds.includes(s.id)))
  }

  return (
    <div className="h-full flex flex-col">
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {favoriteStations.length > 0 ? (
          favoriteStations.map(station => (
            <StationCard 
              key={station.id}
              station={station}
              isFavorite={true}
              onToggleFavorite={handleToggleFavorite}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden mb-4 last:mb-0"
            />
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
