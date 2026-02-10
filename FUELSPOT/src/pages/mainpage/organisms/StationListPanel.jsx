import { forwardRef, useEffect, useState } from 'react';
import { addFavorite, getFavorites, removeFavorite } from '../../../api/favoriteService';
import { FUEL_TYPE } from '../../../components/FuelPriceBox';
import FavoriteButton from '../atoms/FavoriteButton';
import StationFilterBox from '../atoms/StationFilterBox';
import StationCard from '../molecules/StationCard';


const getLocalFavoriteIds = () => {
  try {
    const ids = JSON.parse(localStorage.getItem('favoriteStations') || '[]');
    return ids.map(id => String(id));
  } catch {
    return [];
  }
};

const StationListPanel = forwardRef(({ stations = [], selectedStationId, onStationClick, onNavigate }, ref) => {
  const [sortType, setSortType] = useState('optimal');
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
      setFavoriteIds(data.map(f => String(f.stationId)));
    } catch (error) {
      console.error('Failed to load backend favorites:', error);
      setFavoriteIds(getLocalFavoriteIds().map(id => String(id)));
    }
  };

  const handleSortChange = (value) => {
    setSortType(value);
  };

  const handleToggleFavorite = async (stationId) => {
    if (!isLoggedIn) {
      alert('즐겨찾기 기능을 이용하려면 로그인이 필요합니다.');
      return;
    }

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
      const getPremium = s => (s.prices.find(p => p.type === FUEL_TYPE.PREMIUM_GASOLINE)?.price ?? Infinity);
      return getPremium(a) - getPremium(b);
    });
  } else if (sortType === 'kerosene') {
    sortedStations.sort((a, b) => {
      const getKerosene = s => (s.prices.find(p => p.type === FUEL_TYPE.KEROSENE)?.price ?? Infinity);
      return getKerosene(a) - getKerosene(b);
    });
  } else if (sortType === 'lpg') {
    sortedStations.sort((a, b) => {
      const getLpg = s => (s.prices.find(p => p.type === FUEL_TYPE.LPG)?.price ?? Infinity);
      return getLpg(a) - getLpg(b);
    });
  }

  return (
    <div ref={ref} className="bg-white rounded-[10px] shadow-sm overflow-visible flex flex-col border border-gray-100 min-h-[600px] lg:h-full">
      <div className="bg-[#f9fafb] border-b border-gray-100 p-3 md:p-4 flex items-center gap-1 md:gap-2 sticky top-0 z-10 shrink-0 justify-between overflow-visible flex-nowrap min-w-0">
        <div className="flex items-center gap-1 md:gap-2 min-w-0 shrink">
          <h2 className="text-[#1e2939] text-sm md:text-xl font-bold whitespace-nowrap">주유소 목록</h2>
          <span className="text-[#155dfc] text-sm md:text-xl font-bold whitespace-nowrap shrink-0">({stations.length}개)</span>
        </div>
        <div className="shrink-0">
          <StationFilterBox sortType={sortType} onSortChange={handleSortChange} />
        </div>
      </div>
      <div className="overflow-visible flex-none lg:flex-1 lg:min-h-0 lg:overflow-y-auto lg:overflow-x-hidden custom-scrollbar rounded-b-[10px]">
        {sortedStations.map(station => (
          <div key={station.id} className="relative group">
            <StationCard
              station={station}
              isSelected={selectedStationId === station.id}
              onClick={() => onStationClick && onStationClick(station)}
              onNavigate={onNavigate}
              data-station-id={station.id}
            />
            <div className={`absolute top-4 right-4 z-[1] ${selectedStationId === station.id ? 'opacity-100' : ''}`}>
              <FavoriteButton
                stationId={station.id}
                isFavorite={favoriteIds.includes(station.id)}
                onToggle={handleToggleFavorite}
                disabled={!isLoggedIn}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

export default StationListPanel;
