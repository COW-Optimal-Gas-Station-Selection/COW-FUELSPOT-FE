const PriceItem = ({ label, average, weeklyChange }) => {
  const isNegative = weeklyChange < 0;
  const isPositive = weeklyChange > 0;

  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-500">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-900">
          {average?.toLocaleString()}원
        </span>
        <div
          className={`flex items-center text-[11px] font-medium px-1.5 py-0.5 rounded-full ${
            isNegative
              ? 'bg-red-50 text-red-500'
              : isPositive
              ? 'bg-blue-50 text-blue-500'
              : 'bg-gray-50 text-gray-400'
          }`}
        >
          {isPositive ? '▲' : isNegative ? '▼' : ''}
          {Math.abs(weeklyChange || 0).toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default PriceItem;
