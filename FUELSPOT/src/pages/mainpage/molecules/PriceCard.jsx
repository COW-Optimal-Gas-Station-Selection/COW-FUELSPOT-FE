import PriceItem from '../atoms/PriceItem';

const FUEL_LABELS = {
  GASOLINE: '휘발유',
  DIESEL: '경유',
  PREMIUM_GASOLINE: '고급유',
  LPG: 'LPG',
};

const PriceCard = ({ title, prices, isSido = false, selectedSido, onSidoChange, sidoList }) => {
  if (!prices) return null;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 animate-fadeIn">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-gray-800 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          {title}
        </h3>
        {isSido && (
          <select
            value={selectedSido}
            onChange={(e) => onSidoChange(e.target.value)}
            className="text-xs bg-gray-50 border-none rounded-lg px-2 py-1 outline-none text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {sidoList.map((sido) => (
              <option key={sido.id} value={sido.id}>
                {sido.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-2.5">
        {Object.entries(FUEL_LABELS).map(([key, label]) => {
          const info = prices[key];
          if (!info) return null;
          return (
            <PriceItem
              key={key}
              label={label}
              average={info.average}
              weeklyChange={info.weeklyChange}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PriceCard;
