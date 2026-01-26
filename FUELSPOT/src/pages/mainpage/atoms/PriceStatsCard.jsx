
const PriceStatsCard = ({ type, price, color }) => {
  const colorStyles = {
    amber: "bg-amber-50/50 border-amber-100 text-amber-700",
    green: "bg-emerald-50/50 border-emerald-100 text-emerald-700",
    purple: "bg-purple-50/50 border-purple-100 text-purple-700",
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorStyles[color]} transition-all hover:shadow-md hover:translate-y-[-2px] cursor-default bg-white`}>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{type}</span>
        <div className="text-[10px] font-bold flex items-center gap-0.5 text-rose-500 bg-rose-50 px-1.5 py-0.5 rounded-full">
          <span>▲</span>
          <span>0.2%</span>
        </div>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black tracking-tight">{price.toLocaleString()}</span>
        <span className="text-xs font-bold opacity-50">원</span>
      </div>
    </div>
  );
};

export default PriceStatsCard;
