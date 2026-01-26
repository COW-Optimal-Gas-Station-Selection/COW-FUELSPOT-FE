import PointIcon from '../../../assets/icon/point.svg?react';
import FuelPriceBox from '../../../components/FuelPriceBox';
import GasBrandIconBox from '../../../components/GasBrandIconBox';
import { mockFavoriteCounts } from '../api/mockFavoriteCounts';

const StationCard = ({ station, onClick, onNavigate, ...props }) => {
  return (
    <div className="border-b border-[#f3f4f6] p-4 flex flex-col gap-3 hover:bg-gray-50 transition-colors cursor-pointer" onClick={onClick} {...props}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <GasBrandIconBox brand={station.brand} />
          <h3 className="text-[#101828] text-base font-semibold">{station.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-[#4a5565] text-sm mt-1">
          <PointIcon className="shrink-0 w-4 h-4" />
          <span>{station.address}</span>
        </div>
        
      </div>
      <div className="flex gap-2 mt-1">
        {station.prices.map((p, idx) => (
          <div key={idx} className="flex-1">
            <FuelPriceBox fuelType={p.type} price={p.price} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-1 gap-2">
        <div className="flex flex-col items-start gap-1">
          <div className="text-[#155dfc] text-sm font-medium">{station.distance}</div>
          <span className="text-xs text-gray-400 bg-gray-50 rounded px-2 py-0.5 border border-gray-200 mt-1">
            {mockFavoriteCounts[station.id] || 0}명 즐겨찾기
          </span>
        </div>
        <button
          className="px-3 py-1 rounded bg-[#155dfc] text-white text-xs font-semibold hover:bg-[#0d3fa6] transition-colors w-fit"
          onClick={e => {
            e.stopPropagation();
            if (onNavigate) onNavigate(station);
          }}
        >
          길찾기
        </button>
      </div>
    </div>
  );
};

export default StationCard;