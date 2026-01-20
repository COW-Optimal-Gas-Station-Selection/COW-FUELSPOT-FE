
const StationCanvas = ({ customers, inventory, onStartFilling, currentFillingId, selectedNozzle, setSelectedNozzle, location, upgrades }) => {
  return (
    <div className="relative flex-1 bg-[#050505] rounded-[3rem] border-4 border-white/5 overflow-hidden shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
      {/* 80s Synthwave Background Elements */}
      <div className="absolute inset-0 z-0">
        {/* Sun/Horizon effect */}
        <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
        {/* Distant Mountains/Skyline */}
        <div className="absolute bottom-1/3 w-full h-[2px] bg-pink-500/30 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
        
        {/* Retro Grid Floor */}
        <div className="absolute bottom-0 w-full h-1/3 opacity-20 bg-[linear-gradient(to_right,#ff00ff44_1px,transparent_1px),linear-gradient(to_bottom,#ff00ff44_1px,transparent_1px)] bg-[size:40px_40px] [transform:perspective(500px)_rotateX(60deg)] origin-bottom"></div>
      </div>

      {/* Retro Fun Elements */}
      {upgrades?.BOOMBOX > 0 && (
         <div className="absolute bottom-40 left-10 z-40 animate-bounce">
            <div className="text-4xl">📻</div>
            <div className="flex gap-1 mt-2">
               {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1 h-4 bg-cyan-400 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }}></div>
               ))}
            </div>
         </div>
      )}

      {/* Veteran Alba Visual */}
      {upgrades?.HIRE_ALBA > 0 && (
        <div className="absolute bottom-32 left-[30%] z-40 transition-all duration-500">
          <div className="text-6xl animate-pulse">👷</div>
          <div className="bg-black/80 px-2 py-0.5 rounded border border-purple-500 text-[8px] font-bold text-purple-400 mt-2 whitespace-nowrap">
            ALBA WORKING...
          </div>
        </div>
      )}

      {/* Gas Station Structure */}
      <div className="absolute inset-0 z-10">
        {/* The Roof/Canopy */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[90%] h-24 bg-[#111] border-b-4 border-pink-500 shadow-[0_15px_30px_rgba(236,72,153,0.2)] rounded-b-xl flex items-center justify-center">
          <div className="text-pink-500 font-black italic text-3xl tracking-tighter animate-pulse uppercase">
            {location?.name} GAS & GO
          </div>
          {/* Neon Lights */}
          <div className="absolute bottom-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee]"></div>
        </div>

        {/* Support Pillars */}
        <div className="absolute top-24 left-[15%] w-8 h-full bg-gradient-to-r from-gray-800 to-gray-900 border-x border-white/5"></div>
        <div className="absolute top-24 right-[15%] w-8 h-full bg-gradient-to-r from-gray-900 to-gray-800 border-x border-white/5"></div>
      </div>

      {/* Pipes Layout (Visual) */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <svg className="w-full h-full">
          {/* Gasoline Pipe */}
          <path 
            d="M 280 450 L 280 500 L 100 500 L 100 400" 
            fill="none" 
            stroke={selectedNozzle === 'GASOLINE' ? '#4ade80' : '#166534'} 
            strokeWidth={selectedNozzle === 'GASOLINE' ? '8' : '4'} 
            strokeDasharray="8 4" 
            className="animate-[scroll_2s_linear_infinite] transition-all duration-300" 
          />
          {/* Diesel Pipe */}
          <path 
            d="M 380 450 L 380 480 L 600 480 L 600 400" 
            fill="none" 
            stroke={selectedNozzle === 'DIESEL' ? '#facc15' : '#854d0e'} 
            strokeWidth={selectedNozzle === 'DIESEL' ? '8' : '4'} 
            strokeDasharray="8 4" 
            className="animate-[scroll_3s_linear_infinite] transition-all duration-300" 
          />
        </svg>
      </div>
      
      {/* Tank Indicators & Nozzle Selection */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-12 z-50">
        {Object.entries(inventory).map(([type, stats]) => (
          <div key={type} className="relative group flex flex-col items-center">
             <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-black/80 px-3 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white/50 tracking-tighter uppercase whitespace-nowrap">
               {type === 'GASOLINE' ? 'GASOLINE' : 'DIESEL'}
             </div>
             
             {/* Nozzle Picker */}
             <button 
               onClick={() => setSelectedNozzle(selectedNozzle === type ? null : type)}
               className={`mb-4 w-12 h-12 rounded-full border-4 flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg
                 ${selectedNozzle === type 
                   ? (type === 'GASOLINE' ? 'bg-green-500 border-white shadow-[0_0_20px_#22c55e]' : 'bg-yellow-500 border-white shadow-[0_0_20px_#eab308]') 
                   : 'bg-gray-800 border-gray-700 hover:border-white/50'}`}
             >
               <span className="text-xl">⛽</span>
             </button>

             <div className={`w-24 h-40 bg-gray-950 border-2 rounded-2xl overflow-hidden relative shadow-2xl transition-colors duration-500 ${selectedNozzle === type ? 'border-white' : 'border-white/10'}`}>
                <div 
                  className={`absolute bottom-0 w-full ${type === 'GASOLINE' ? 'bg-gradient-to-t from-green-900 to-green-500' : 'bg-gradient-to-t from-yellow-900 to-yellow-600'} transition-all duration-1000`}
                  style={{ height: `${(stats.current / stats.max) * 100}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-white/30 animate-pulse"></div>
                  {/* Fluid Animation */}
                  <div className="absolute inset-0 bg-white/5 animate-pulse"></div>
                </div>
                {/* Measuring Marks */}
                <div className="absolute inset-0 flex flex-col justify-between py-4 px-1 opacity-20">
                  {[...Array(10)].map((_, i) => <div key={i} className="w-full h-[1px] bg-white"></div>)}
                </div>
             </div>
             <div className="mt-3 text-xs text-white font-mono font-black tracking-tighter">
               {Math.floor(stats.current)}L / {stats.max}L
             </div>
          </div>
        ))}
      </div>

      {/* Customer Lane & Interaction */}
      <div className="absolute inset-0 z-30 flex items-center justify-around pb-32">
        {customers.map((c, i) => (
          <div 
            key={c.id} 
            className={`flex flex-col items-center transition-all duration-700 ease-out
              ${currentFillingId === c.id ? 'scale-125 z-50' : 'z-30'}`}
          >
            <div className="relative">
              {/* Retro HUD Speech Bubble */}
              {c.status === 'waiting' && (
                <div className={`absolute -top-24 left-1/2 -translate-x-1/2 border-2 p-3 rounded-2xl font-mono shadow-[0_0_20px_rgba(34,211,238,0.4)] animate-bounce min-w-[120px] 
                  ${c.isVIP ? 'bg-yellow-400/90 border-yellow-200 text-black' : 'bg-black/90 border-cyan-500 text-cyan-400'}`}>
                  {c.isVIP && <div className="text-[10px] font-black text-center mb-1 underline italic">VIP GUEST! ✨</div>}
                  <div className="text-[8px] opacity-70 mb-1">REQUESTED: {c.fuelType}</div>
                  <div className="text-xl font-black">{c.amount}L</div>
                  <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 border-r-2 border-b-2 rotate-45 
                    ${c.isVIP ? 'bg-yellow-400 border-yellow-200' : 'bg-black border-cyan-500'}`}></div>
                </div>
              )}

              {c.status === 'filling' && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center">
                   <div className="text-green-500 font-black text-2xl animate-pulse">FILLING...</div>
                   <div className="w-24 h-2 bg-gray-800 rounded-full mt-1 border border-white/10 overflow-hidden">
                      <div className="h-full bg-green-500 animate-[fill-progress_0.1s_linear_infinite]" style={{width: '100%'}}></div>
                   </div>
                </div>
              )}

              {c.status === 'angry' && (
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 bg-red-600 px-4 py-2 rounded-full text-white font-black text-sm italic shadow-lg animate-ping">
                  BAIL!! 😡
                </div>
              )}
              
              {/* Car Visual with Shadows */}
              <div 
                className="relative cursor-pointer group"
                onClick={() => onStartFilling(c)}
              >
                {/* Drunk/VIP Badges */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-50">
                   {c.isVIP && <span className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-lg">VIP</span>}
                   {c.isDrunk && <span className="bg-green-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse border border-green-400 whitespace-nowrap">DANGER: DRUNK 🤢</span>}
                </div>
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-black/40 blur-xl rounded-full"></div>
                <div className="text-9xl transition-transform hover:scale-105 active:scale-95 drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
                  {c.icon}
                </div>
              </div>
            </div>

            {/* Patience Meter (Digital Look) */}
            <div className="mt-8 w-24 h-4 bg-gray-950 border border-white/10 rounded-sm p-0.5 overflow-hidden">
               <div 
                 className={`h-full transition-all duration-300 ${c.patience > 50 ? 'bg-cyan-500' : c.patience > 25 ? 'bg-yellow-500 shadow-[0_0_10px_#eab308]' : 'bg-red-500 animate-pulse shadow-[0_0_10px_#ef4444]'}`}
                 style={{ width: `${c.patience}%` }}
               ></div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        @keyframes scroll {
          from { stroke-dashoffset: 24; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes fill-progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default StationCanvas;
