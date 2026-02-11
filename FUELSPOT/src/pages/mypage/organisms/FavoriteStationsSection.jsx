import { useEffect, useState } from 'react'
import { addFavorite, getFavorites, removeFavorite } from '../../../api/favoriteService'
import { getStationDetail } from '../../../api/stationService'
import StationCard from '../../mainpage/molecules/StationCard'

function FavoriteStationsSection() {
  const [favoriteStations, setFavoriteStations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const data = await getFavorites() // [{ favoriteId, stationId }, ...]

      if (!data || data.length === 0) {
        setFavoriteStations([])
        return
      }

      const detailPromises = data.map(f => getStationDetail(f.stationId))
      const rawDetails = await Promise.all(detailPromises)

      // 백엔드 데이터를 프론트엔드 형식으로 변환 (MainPageLayout과 동일한 로직 적용)
      const mappedDetails = rawDetails.map(s => ({
        id: String(s.id),
        name: s.name,
        brand: s.brand,
        address: s.address,
        tel: s.tel,
        carWash: s.carWash,
        tradeDate: s.tradeDate,
        tradeTime: s.tradeTime,
        distance: '', // 마이페이지에서는 거리 표시 제외 또는 별도 처리
        lat: parseFloat(s.lat),
        lng: parseFloat(s.lon),
        prices: s.prices || {}
      }));

      setFavoriteStations(mappedDetails)
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
        if (!confirm('즐겨찾기에서 삭제하시겠습니까?')) return;
        await removeFavorite(stationId)
        setFavoriteStations(prev => prev.filter(s => s.id !== stationId))
      } else {
        await addFavorite(stationId)
        const s = await getStationDetail(stationId)
        const mapped = {
          id: String(s.id),
          name: s.name,
          brand: s.brand,
          address: s.address,
          tel: s.tel,
          carWash: s.carWash,
          tradeDate: s.tradeDate,
          tradeTime: s.tradeTime,
          distance: '',
          lat: parseFloat(s.lat),
          lng: parseFloat(s.lon),
          prices: s.prices || {}
        }
        setFavoriteStations(prev => [...prev, mapped])
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
            <div key={station.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <StationCard
                station={station}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
                isLoggedIn={true}
              />
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

