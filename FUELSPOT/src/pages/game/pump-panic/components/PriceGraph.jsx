
const PriceGraph = ({ data, color, title, currentPrice }) => {
  const max = 2200;
  const min = 1200;
  const range = max - min;

  return (
    <div className="bg-black/80 p-3 rounded-xl border border-white/10 w-full">
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">{title} 도매가</span>
        <span className={`font-mono font-bold ${color}`}>₩{currentPrice.toLocaleString()}</span>
      </div>
      <div className="h-16 flex items-end gap-1 px-1">
        {data.map((val, i) => (
          <div
            key={i}
            className={`flex-1 ${color.replace('text-', 'bg-')}/40 rounded-t-sm transition-all duration-500`}
            style={{ height: `${((val - min) / range) * 100}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default PriceGraph;
