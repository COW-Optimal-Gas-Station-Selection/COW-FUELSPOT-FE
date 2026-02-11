import PointIcon from '../../../assets/icon/point.svg?react';
import FuelPriceBox, { FUEL_TYPE } from '../../../components/FuelPriceBox';
import GasBrandIconBox from '../../../components/GasBrandIconBox';
import FavoriteButton from '../atoms/FavoriteButton';

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

const StationCard = ({
  station,
  isSelected,
  isFavorite,
  onToggleFavorite,
  isLoggedIn,
  onClick,
  onNavigate,
  ...props
}) => {
  const standardText = formatPriceStandard(station.tradeDate, station.tradeTime);
  return (
    <div
      className={`p-5 flex flex-col gap-4 transition-all duration-300 cursor-pointer ${isSelected ? 'bg-blue-50/60 ring-2 ring-blue-500 ring-inset z-10' : 'bg-white hover:bg-slate-50'}`}
      onClick={(e) => { onClick?.(); }}
      {...props}
    >
      {/* Header: Brand & Name */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <GasBrandIconBox brand={station.brand} />
          </div>
          <div>
            <h3 className={`text-lg font-bold transition-colors ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
              {station.name}
            </h3>
            <div className="flex items-center gap-1 text-slate-500 text-sm mt-0.5">
              <PointIcon className="shrink-0 w-3.5 h-3.5 text-slate-400" />
              <span className="truncate max-w-[200px]">{station.address}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <FavoriteButton
            stationId={station.id}
            isFavorite={isFavorite}
            onToggle={onToggleFavorite}
            disabled={!isLoggedIn}
          />
        </div>
      </div>

      {/* Prices */}
      <div className="grid grid-cols-2 gap-2.5">
        {Object.entries(station.prices || {})
          .filter(([_, price]) => price > 0)
          .map(([key, price], idx) => (
            <FuelPriceBox key={idx} fuelType={FUEL_TYPE[key]} price={price} />
          ))}
      </div>

      {/* Facilities / Options */}
      <div className="flex items-center gap-2 pt-1">
        {station.carWash ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-xs font-bold ring-1 ring-blue-100">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.121 15.536c-1.171 1.952-3.07 1.952-4.242 0-1.172-1.953-1.172-5.119 0-7.072 1.171-1.952 3.07-1.952 4.242 0M8 10.5h4m-4 3h4m9-1.5a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            세차가능
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-50 text-slate-400 text-xs font-bold ring-1 ring-slate-100 italic">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            세차불가
          </span>
        )}
      </div>

      {/* Footer: Info & Action */}
      <div className="flex items-end justify-between pt-3 border-t border-slate-50 mt-1">
        <div className="flex flex-col gap-1">
          {station.tel && <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
            <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            {station.tel}
          </span>}
          {standardText && (
            <span className="text-[10px] text-slate-400">{standardText}</span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <span className="text-blue-600 font-bold text-sm bg-blue-50 px-2 py-1 rounded-md">{station.distance}</span>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors shadow-sm active:scale-95 flex items-center gap-1"
            onClick={e => {
              e.stopPropagation();
              if (onNavigate) onNavigate(station);
            }}
          >
            <span>길찾기</span>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StationCard;