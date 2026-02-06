import PointIcon from '../../../assets/icon/point.svg?react';
import FuelPriceBox from '../../../components/FuelPriceBox';
import GasBrandIconBox from '../../../components/GasBrandIconBox';
import { FUEL_TYPE } from '../../../components/FuelPriceBox';

/** 서버 값 "20260206" "175729" → "2026년 02월06일 17시 57분29초에 업데이트 됨" */
function formatPriceStandard(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;
  const y = dateStr.slice(0, 4);
  const m = dateStr.slice(4, 6);
  const d = dateStr.slice(6, 8);
  const h = timeStr.slice(0, 2);
  const min = timeStr.slice(2, 4);
  const s = timeStr.slice(4, 6);
  return `${y}년 ${m}월${d}일 ${h}시 ${min}분${s}초에 업데이트 됨`;
}

const StationCard = ({ station, isSelected, onClick, onNavigate, ...props }) => {
  const standardText = formatPriceStandard(station.tradeDate, station.tradeTime);
  return (
    <div 
      className={`border-b border-[#f3f4f6] p-4 flex flex-col gap-3 transition-all cursor-pointer ${isSelected ? 'bg-blue-50/50 ring-1 ring-blue-100' : 'hover:bg-gray-50'}`} 
      onClick={onClick} 
      {...props}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <GasBrandIconBox brand={station.brand} />
          <h3 className={`text-base font-semibold ${isSelected ? 'text-blue-900' : 'text-[#101828]'}`}>{station.name}</h3>
        </div>
        <div className="flex items-center gap-1 text-[#4a5565] text-sm mt-1">
          <PointIcon className="shrink-0 w-4 h-4" />
          <span>{station.address}</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 py-1">
        <div className="grid grid-cols-2 gap-2">
          {station.prices.map((p, idx) => (
            <FuelPriceBox key={idx} fuelType={p.type} price={p.price} />
          ))}
        </div>
        
        <div className="bg-white/60 rounded-lg p-3 space-y-2 text-sm border border-gray-100/50">
          {station.tel && (
            <div className="flex flex-col gap-0.5">
              <span className="text-gray-500">전화번호</span>
              <span className="font-medium text-gray-700">{station.tel}</span>
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <span className="text-gray-500">세차 가능 여부</span>
            <span className="font-bold">
              {station.isCarWash ? (
                <span className="text-blue-600">예</span>
              ) : (
                <span className="text-red-500 font-bold" aria-label="세차 불가">✕</span>
              )}
            </span>
          </div>
          {standardText && (
            <div className="text-[11px] text-gray-400 text-right pt-1">
              {standardText}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 gap-2">
        <div className="text-[#155dfc] text-sm font-medium">{station.distance}</div>
        <button
          className="px-4 py-2 rounded-md bg-[#155dfc] text-white text-sm font-semibold hover:bg-[#0d3fa6] transition-colors w-fit shadow-sm"
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