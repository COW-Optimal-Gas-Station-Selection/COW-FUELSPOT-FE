import { useEffect, useState } from 'react'
import { addFavorite, getFavorites, removeFavorite } from '../../../api/favoriteService'
import { getStationDetail } from '../../../api/stationService'
import StationCard from '../../mainpage/molecules/StationCard'
import MyPageTitle from '../atoms/MyPageTitle'

function FavoriteStationsSection() {
  const [favoriteStations, setFavoriteStations] = useState([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadFavorites()
  }, [])

  const loadFavorites = async () => {
    try {
      setLoading(true)
      const data = await getFavorites()

      if (!data || data.length === 0) {
        setFavoriteStations([])
        return
      }

      const detailPromises = data.map(f => getStationDetail(f.stationId))
      const rawDetails = await Promise.all(detailPromises)

      const mappedDetails = rawDetails.map(s => ({
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

  return (
    <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden transition-all duration-300">
      {/* 아코디언 헤더 */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-8 md:p-10 flex items-center justify-between hover:bg-gray-50/50 lg:hover:bg-transparent transition-colors group lg:cursor-default"
      >
        <div className="mb-0">
          <MyPageTitle title="즐겨찾는 주유소" color="yellow-400" />
        </div>
        <div className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-yellow-50 group-hover:text-yellow-600 transition-all duration-300 lg:hidden ${isOpen ? 'rotate-180' : ''}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* 아코디언 컨텐츠 */}
      <div className={`grid transition-all duration-500 ease-in-out lg:grid-rows-[1fr] lg:opacity-100 ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
        <div className="overflow-hidden">
          <div className="p-8 md:p-10 pt-0 border-t border-gray-50 lg:border-t-0 flex flex-col min-h-[400px]">
            {loading ? (
              <div className="flex-1 flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
              </div>
            ) : (
              <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar max-h-[600px]">
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
                  <div className="py-20 text-center text-gray-400 text-sm font-medium italic">
                    즐겨찾기한 주유소가 없습니다.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default FavoriteStationsSection


