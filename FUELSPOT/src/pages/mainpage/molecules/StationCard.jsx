import PointIcon from '../../../assets/icon/point.svg?react';
import FuelPriceBox from '../../../components/FuelPriceBox';
import GasBrandIconBox from '../../../components/GasBrandIconBox';
import { FUEL_TYPE } from '../../../components/FuelPriceBox';

const StationCard = ({ station, isSelected, onClick, onNavigate, ...props }) => {
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
            <div className="flex justify-between">
              <span className="text-gray-500">전화번호</span>
              <span className="font-medium text-gray-700">{station.tel}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-500">세차 가능</span>
            <span className={`font-bold ${station.isCarWash ? 'text-blue-600' : 'text-gray-400'}`}>
              {station.isCarWash ? '예' : '아니오'}
            </span>
          </div>
          {station.tradeDate && (
            <div className="text-[11px] text-gray-400 text-right pt-1">
              기준: {station.tradeDate} {station.tradeTime}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1 gap-2">
        <div className="text-[#155dfc] text-sm font-medium">{station.distance}</div>
        <button
          className="px-3 py-1 rounded bg-[#155dfc] text-white text-xs font-semibold hover:bg-[#0d3fa6] transition-colors w-fit shadow-sm"
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