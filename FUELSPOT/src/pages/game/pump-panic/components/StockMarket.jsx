
const StockMarket = ({ money, rivals, onBuyShare, onSellShare }) => {
  return (
    <div className="bg-[#0a0a0c] border-4 border-cyan-900/50 rounded-[3rem] p-10 shadow-[0_0_50px_rgba(34,211,238,0.1)]">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-cyan-400 text-5xl font-black italic tracking-tighter uppercase">Rivalry Exchange</h2>
          <p className="text-white/30 font-mono text-xs uppercase tracking-[0.3em]">Corporate War Room - 198X</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-white/40 font-bold uppercase">Liquid Assets</div>
          <div className="text-3xl font-black text-yellow-500 italic">₩{money.toLocaleString()}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {rivals.map(rival => (
          <div key={rival.id} className="bg-white/5 border border-white/10 rounded-[2rem] p-6 hover:border-cyan-500/50 transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center text-3xl border-2 border-white/5 group-hover:border-cyan-500/30 transition-all shadow-inner">
                  {rival.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-black italic text-white/90">{rival.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${rival.trend > 0 ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'}`}>
                      {rival.trend > 0 ? '▲' : '▼'} {Math.abs(rival.trend).toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-white/20 font-mono">SHARES OWNED: {rival.owned}%</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <div className="text-[10px] text-white/40 font-bold uppercase">Share Price</div>
                  <div className="text-2xl font-mono text-cyan-400 font-bold">₩{rival.price.toLocaleString()}</div>
                </div>

                <div className="flex flex-col gap-2">
                  <button 
                    onClick={() => onBuyShare(rival)}
                    disabled={money < rival.price || rival.owned >= 100}
                    className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 px-6 py-2 rounded-xl font-black italic text-xs transition-all active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  >
                    {rival.owned >= 100 ? 'ACQUIRED' : 'BUY 1% SHARE'}
                  </button>
                  <button 
                    onClick={() => onSellShare(rival)}
                    disabled={rival.owned <= 0}
                    className="bg-red-600/20 hover:bg-red-600/40 text-red-400 px-6 py-1 rounded-xl font-black italic text-[10px] transition-all active:scale-95"
                  >
                    SELL {Math.min(1, rival.owned)}%
                  </button>
                </div>
              </div>
            </div>
            
            {/* Progress Bar for Takeover */}
            <div className="mt-6 w-full h-1.5 bg-gray-900 rounded-full overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-cyan-900 to-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-1000"
                style={{ width: `${rival.owned}%` }}
              ></div>
            </div>
            {rival.owned >= 100 && (
              <p className="text-[10px] text-cyan-400 font-black italic mt-2 animate-pulse">SUBSIDIARY ACQUIRED: +5% PASSIVE REVENUE</p>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-10 p-6 bg-cyan-500/5 border border-cyan-500/20 rounded-2xl">
        <p className="text-[10px] text-cyan-500/70 font-mono leading-relaxed">
           CORPORATE INTEL: Acquiring rivals increases your market dominance. 
           Complete a 100% takeover to redirect their customer base to your locations.
        </p>
      </div>
    </div>
  );
};

export default StockMarket;
