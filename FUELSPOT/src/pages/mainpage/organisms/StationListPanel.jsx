import { forwardRef, useEffect, useState } from 'react';
import { FUEL_TYPE } from '../../../components/FuelPriceBox';
import StationFilterBox from '../atoms/StationFilterBox';
import StationCard from '../molecules/StationCard';


const getFavoriteIds = () => {
  try {
    return JSON.parse(localStorage.getItem('favoriteStations') || '[]');
  } catch {
    return [];
  }
};

const StationListPanel = forwardRef(({ stations = [], onStationClick, onNavigate }, ref) => {
  const [sortType, setSortType] = useState('distance');
  // ...sortOptions moved to StationFilterBox
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    setFavoriteIds(getFavoriteIds());
  }, []);

  const handleSortChange = (value) => {
    setSortType(value);
  };

  const handleToggleFavorite = (stationId) => {
    let next;
    if (favoriteIds.includes(stationId)) {
      next = favoriteIds.filter(id => id !== stationId);
    } else {
      next = [...favoriteIds, stationId];
    }
    setFavoriteIds(next);
    localStorage.setItem('favoriteStations', JSON.stringify(next));
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
            <span className="inline-block align-middle">⛽</span> 주유소 목록
          </h2>
          <span className="text-[#155dfc] text-xl font-bold">({stations.length}개)</span>
        </div>
        <StationFilterBox sortType={sortType} onSortChange={handleSortChange} />
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {sortedStations.map(station => (
          <StationCard
            key={station.id}
            station={station}
            onClick={() => onStationClick && onStationClick(station)}
            onNavigate={onNavigate}
            isFavorite={favoriteIds.includes(station.id)}
            onToggleFavorite={handleToggleFavorite}
            data-station-id={station.id}
          />
        ))}
      </div>
    </div>
  );
});

export default StationListPanel;
