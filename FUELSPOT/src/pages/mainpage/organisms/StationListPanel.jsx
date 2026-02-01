import { forwardRef, useEffect, useState } from 'react';
import { addFavorite, getFavorites, removeFavorite } from '../../../api/favoriteService';
import { FUEL_TYPE } from '../../../components/FuelPriceBox';
import FavoriteButton from '../atoms/FavoriteButton';
import StationFilterBox from '../atoms/StationFilterBox';
import StationCard from '../molecules/StationCard';


const getLocalFavoriteIds = () => {
  try {
    return JSON.parse(localStorage.getItem('favoriteStations') || '[]');
  } catch {
    return [];
  }
};

const StationListPanel = forwardRef(({ stations = [], onStationClick, onNavigate }, ref) => {
  const [sortType, setSortType] = useState('distance');
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
      loadBackendFavorites();
    } else {
      setIsLoggedIn(false);
      setFavoriteIds(getLocalFavoriteIds());
    }
  }, []);

  const loadBackendFavorites = async () => {
    try {
      const data = await getFavorites();
      setFavoriteIds(data.map(f => f.stationId));
    } catch (error) {
      console.error('Failed to load backend favorites:', error);
      setFavoriteIds(getLocalFavoriteIds());
    }
  };

  const handleSortChange = (value) => {
    setSortType(value);
  };

  const handleToggleFavorite = async (stationId) => {
    if (isLoggedIn) {
      try {
        if (favoriteIds.includes(stationId)) {
          await removeFavorite(stationId);
          setFavoriteIds(prev => prev.filter(id => id !== stationId));
        } else {
          await addFavorite(stationId);
          setFavoriteIds(prev => [...prev, stationId]);
        }
      } catch (error) {
        alert('즐겨찾기 처리 중 오류가 발생했습니다.');
      }
    } else {
      // Guest logic (localStorage)
      let next;
      const currentLocal = getLocalFavoriteIds();
      if (currentLocal.includes(stationId)) {
        next = currentLocal.filter(id => id !== stationId);
      } else {
        next = [...currentLocal, stationId];
      }
      setFavoriteIds(next);
      localStorage.setItem('favoriteStations', JSON.stringify(next));
    }
  };

  let sortedStations = [...stations];
  if (sortType === 'distance') {
    sortedStations.sort((a, b) => {
      const d1 = parseFloat(a.distance);
      const d2 = parseFloat(b.distance);
      return d1 - d2;
    });
  } else if (sortType === 'gasoline') {
    sortedStations.sort((a, b) => {
      const getGasoline = s => (s.prices.find(p => p.type === FUEL_TYPE.GASOLINE)?.price ?? Infinity);
      return getGasoline(a) - getGasoline(b);
    });
  } else if (sortType === 'diesel') {
    sortedStations.sort((a, b) => {
      const getDiesel = s => (s.prices.find(p => p.type === FUEL_TYPE.DIESEL)?.price ?? Infinity);
      return getDiesel(a) - getDiesel(b);
    });
  } else if (sortType === 'premium') {
    sortedStations.sort((a, b) => {
      const getPremium = s => (s.prices.find(p => p.type === FUEL_TYPE.PREMIUM)?.price ?? Infinity);
      return getPremium(a) - getPremium(b);
    });
  }

  return (
    <div ref={ref} className="bg-white rounded-[10px] shadow-sm overflow-hidden flex flex-col border border-gray-100 h-full">
      <div className="bg-[#f9fafb] border-b border-gray-100 p-4 flex items-center gap-2 sticky top-0 z-10 justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-[#1e2939] text-xl font-bold flex items-center gap-2">
            주유소 목록
          </h2>
          <span className="text-[#155dfc] text-xl font-bold">({stations.length}개)</span>
        </div>
        <StationFilterBox sortType={sortType} onSortChange={handleSortChange} />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {sortedStations.map(station => (
          <div key={station.id} className="relative group">
            <StationCard
              station={station}
              onClick={() => onStationClick && onStationClick(station)}
              onNavigate={onNavigate}
              data-station-id={station.id}
            />
            <div className="absolute top-4 right-4 z-[1]">
              <FavoriteButton
                stationId={station.id}
                isFavorite={favoriteIds.includes(station.id)}
                onToggle={handleToggleFavorite}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default StationListPanel;
