
const AuctionOverlay = ({ locations, onSelect }) => {
  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex flex-col items-center justify-center p-8">
      <h2 className="text-yellow-500 text-6xl font-black italic mb-2 tracking-tighter uppercase">Location Auction</h2>
      <p className="text-white/40 mb-12 text-lg">최고의 수익을 낼 수 있는 부지를 낙찰받으세요.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {locations.map((loc) => (
          <div 
            key={loc.id}
            className="group relative bg-[#111] border-2 border-white/5 hover:border-yellow-500/50 p-8 rounded-[2rem] transition-all cursor-pointer overflow-hidden active:scale-95"
            onClick={() => onSelect(loc)}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
               <span className="text-6xl">🏗️</span>
            </div>
            
            <span className="text-yellow-500/50 font-mono text-sm tracking-widest mb-4 block">{loc.type} ZONE</span>
            <h3 className="text-white text-4xl font-black mb-4">{loc.name}</h3>
            <p className="text-white/50 mb-8 h-12 leading-relaxed">{loc.desc}</p>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white/30 uppercase font-bold tracking-tighter">예상 유동성</span>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${i < loc.traffic * 3 ? 'bg-yellow-500' : 'bg-white/10'}`}></div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-yellow-500 text-black font-black text-center py-4 rounded-2xl text-xl shadow-[0_10px_30px_rgba(234,179,8,0.2)]">
              낙찰가: ₩{(loc.cost / 10000).toLocaleString()}만
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AuctionOverlay;
