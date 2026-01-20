import { useEffect, useRef, useState } from 'react';
import AuctionOverlay from './components/AuctionOverlay';
import PriceGraph from './components/PriceGraph';
import StationCanvas from './components/StationCanvas';
import StockMarket from './components/StockMarket';
import { GAME_CONFIG } from './constants';
import { useCustomers } from './hooks/useCustomers';
import { useMarket } from './hooks/useMarket';

const PumpPanic = () => {
  const [gameStatus, setGameStatus] = useState('auction'); // auction, playing, dayend, gameOver
  const [money, setMoney] = useState(GAME_CONFIG.INITIAL_MONEY);
  const [location, setLocation] = useState(null);
  
  const [day, setDay] = useState(1);
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.DAY_DURATION);
  const [debt, setDebt] = useState(GAME_CONFIG.INITIAL_DEBT);
  const [dailyStats, setDailyStats] = useState({ revenue: 0, customers: 0, penalties: 0 });

  const [upgrades, setUpgrades] = useState({ 
    PIPE_EFFICIENCY: 0, 
    TANK_SIZE: 0, 
    HIRE_ALBA: 0, 
    BOOMBOX: 0,
    CONVENIENCE_STORE: 0 
  });
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState([]);

  // Rivals & Stocks
  const [rivals, setRivals] = useState([
    { id: 1, name: 'Speedy Sam Oil', icon: '🏎️', price: 250000, trend: 1.2, owned: 0 },
    { id: 2, name: 'Liz Luxury Fuel', icon: '💎', price: 480000, trend: -0.5, owned: 0 },
    { id: 3, name: 'Bob Corporate', icon: '🏢', price: 950000, trend: 0.3, owned: 0 }
  ]);

  // Inventory & Pricing State
  const [inventory, setInventory] = useState({
    GASOLINE: { current: 300, max: GAME_CONFIG.BASE_TANK_CAPACITY },
    DIESEL: { current: 200, max: GAME_CONFIG.BASE_TANK_CAPACITY }
  });
  const [retailPrices, setRetailPrices] = useState({ GASOLINE: 1750, DIESEL: 1650 });
  const [currentFillingId, setCurrentFillingId] = useState(null);
  const [selectedNozzle, setSelectedNozzle] = useState(null);

  // Hooks
  const { prices, news } = useMarket(gameStatus);
  
  const handleAngryCustomer = (customer) => {
    if (customer.isDrunk) {
      setMoney(prev => Math.max(0, prev - 50000));
      spawnFloatingText('취객이 기물을 파손했습니다! -₩50,000', 'error');
    }
  };

  const { customers, setCustomers } = useCustomers(
    location || GAME_CONFIG.AUCTION_LOCATIONS[0], 
    retailPrices, 
    gameStatus, 
    upgrades,
    handleAngryCustomer
  );

  const fillInterval = useRef(null);

  // Game Loop (Timer)
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameStatus('dayend');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameStatus]);

  // Mafia Event Logic
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const mafiaTimer = setInterval(() => {
      if (Math.random() > 0.95) {
        const extortionAmount = Math.floor(money * 0.1);
        setMoney(prev => Math.max(0, prev - extortionAmount));
        spawnFloatingText(`마피아가 자릿세를 뜯어갔습니다! -₩${extortionAmount.toLocaleString()}`, 'error');
      }
    }, 15000);
    return () => clearInterval(mafiaTimer);
  }, [gameStatus, money]);

  // Passive Income & Rival Prices Loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    const timer = setInterval(() => {
      // Passive Income from Acquired Rivals
      const passiveIncome = rivals.reduce((acc, r) => acc + (r.owned >= 100 ? 5000 : 0), 0);
      if (passiveIncome > 0) {
        setMoney(prev => prev + passiveIncome);
        spawnFloatingText(`+₩${passiveIncome.toLocaleString()} (배당금 💰)`, 'revenue');
      }

      // Fluctuating Rival Stock Prices
      setRivals(prev => prev.map(r => {
        const volatility = r.id === 3 ? 1000 : 5000;
        const change = (Math.random() - 0.5) * volatility;
        const nextPrice = Math.max(50000, r.price + change);
        const trend = (change / r.price) * 100;
        return { ...r, price: Math.floor(nextPrice), trend };
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, [gameStatus, rivals]);

  // Veteran Alba (Auto-Filling) Logic
  useEffect(() => {
    if (gameStatus !== 'playing' || !upgrades.HIRE_ALBA || currentFillingId) return;

    const waiter = customers.find(c => c.status === 'waiting');
    if (waiter) {
      if (inventory[waiter.fuelType].current > 5) {
        setSelectedNozzle(waiter.fuelType);
        setTimeout(() => {
          startFilling(waiter);
        }, 500);
      }
    }
  }, [customers, gameStatus, upgrades.HIRE_ALBA, currentFillingId, inventory]);

  const spawnFloatingText = (text, type = 'revenue') => {
    const id = Date.now();
    setFloatingTexts(prev => [...prev, { id, text, type }]);
    setTimeout(() => {
      setFloatingTexts(prev => prev.filter(t => t.id !== id));
    }, 2000);
  };

  const buyUpgrade = (key) => {
    const config = GAME_CONFIG.UPGRADES[key];
    const level = upgrades[key];
    const cost = config.cost * (level + 1);
    
    if (money >= cost) {
      setMoney(prev => prev - cost);
      setUpgrades(prev => ({ ...prev, [key]: level + 1 }));
      spawnFloatingText(`UPGRADED ${config.name}!`, 'upgrade');
      
      if (key === 'TANK_SIZE') {
        setInventory(prev => ({
          GASOLINE: { ...prev.GASOLINE, max: prev.GASOLINE.max + 500 },
          DIESEL: { ...prev.DIESEL, max: prev.DIESEL.max + 500 }
        }));
      }
    }
  };

  const nextDay = () => {
    // Apply Interest to remaining debt
    const interest = Math.floor(debt * GAME_CONFIG.DEBT_INTEREST);
    setDebt(prev => prev + interest);
    setDay(prev => prev + 1);
    setTimeLeft(GAME_CONFIG.DAY_DURATION);
    setDailyStats({ revenue: 0, customers: 0, penalties: 0 });
    setGameStatus('playing');
  };

  const payDebt = (amount) => {
    if (money >= amount) {
      setMoney(prev => prev - amount);
      setDebt(prev => Math.max(0, prev - amount));
      spawnFloatingText(`빚을 갚았습니다! -₩${amount.toLocaleString()}`, 'revenue');
    }
  };

  const selectLocation = (loc) => {
    if (money < loc.cost) return;
    setMoney(prev => prev - loc.cost);
    setLocation(loc);
    setGameStatus('playing');
  };

  const buyShare = (rival) => {
    if (money >= rival.price && rival.owned < 100) {
      setMoney(prev => prev - rival.price);
      setRivals(prev => prev.map(r => r.id === rival.id ? { ...r, owned: r.owned + 1 } : r));
      spawnFloatingText(`${rival.name} 주식 매수!`, 'upgrade');
    }
  };

  const sellShare = (rival) => {
    if (rival.owned > 0) {
      setMoney(prev => prev + rival.price);
      setRivals(prev => prev.map(r => r.id === rival.id ? { ...r, owned: r.owned - 1 } : r));
      spawnFloatingText(`${rival.name} 주식 매도!`, 'revenue');
    }
  };

  const buyOil = (type) => {
    const cost = Math.floor(prices[type].wholesale * 100);
    if (money >= cost && inventory[type].current + 100 <= inventory[type].max) {
      setMoney(prev => prev - cost);
      setInventory(prev => ({
        ...prev,
        [type]: { ...prev[type], current: prev[type].current + 100 }
      }));
      spawnFloatingText(`-₩${cost.toLocaleString()} (기름 매입)`, 'expense');
    }
  };

  const startFilling = (customer) => {
    if (currentFillingId || customer.status !== 'waiting') return;

    if (!selectedNozzle) {
      spawnFloatingText('노즐을 선택해주세요!', 'error');
      return;
    }

    if (selectedNozzle !== customer.fuelType) {
      setMoney(prev => Math.max(0, prev - GAME_CONFIG.MIX_UP_PENALTY));
      setDailyStats(prev => ({ ...prev, penalties: prev.penalties + GAME_CONFIG.MIX_UP_PENALTY }));
      spawnFloatingText(`혼유 사고! -₩${GAME_CONFIG.MIX_UP_PENALTY.toLocaleString()}`, 'error');
      setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: 'angry' } : c));
      setSelectedNozzle(null);
      setTimeout(() => {
        setCustomers(prev => prev.filter(c => c.id !== customer.id));
      }, 1500);
      return;
    }

    if (inventory[customer.fuelType].current < 1) {
      spawnFloatingText('기름이 부족합니다!', 'error');
      return;
    }

    setCurrentFillingId(customer.id);
    setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: 'filling' } : c));

    let filledSoFar = 0;
    const baseSpeed = 1 + (upgrades.PIPE_EFFICIENCY * 0.5);
    
    fillInterval.current = setInterval(() => {
      filledSoFar += baseSpeed;
      
      setInventory(prev => {
        const next = { ...prev };
        next[customer.fuelType].current = Math.max(0, next[customer.fuelType].current - baseSpeed);
        return next;
      });

      if (filledSoFar >= customer.amount) {
        clearInterval(fillInterval.current);
        const baseRevenue = Math.floor(customer.amount * retailPrices[customer.fuelType]);
        const vipBonus = customer.isVIP ? baseRevenue * 0.5 : 0;
        const tip = (customer.patience > 80 || customer.isVIP) ? Math.floor(baseRevenue * 0.2) : 0;
        
        const totalRevenue = baseRevenue + vipBonus + tip;
        
        setMoney(prev => prev + totalRevenue);
        setDailyStats(prev => ({ ...prev, revenue: prev.revenue + totalRevenue, customers: prev.customers + 1 }));
        spawnFloatingText(`+₩${totalRevenue.toLocaleString()}${customer.isVIP ? ' (VIP!! 🏆)' : tip > 0 ? ' (TIP! ✨)' : ''}`, 'revenue');
        
        // Convenience Store Logic
        const visitStore = upgrades.CONVENIENCE_STORE > 0 && Math.random() < 0.4;
        
        if (visitStore) {
          const storeRevenue = 5000 + Math.floor(Math.random() * 15000);
          setTimeout(() => {
            setMoney(prev => prev + storeRevenue);
            spawnFloatingText(`+₩${storeRevenue.toLocaleString()} (편의점 수익 🏪)`, 'revenue');
          }, 1500);
        }

        setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, status: 'completed' } : c));
        setCurrentFillingId(null);
        setSelectedNozzle(null);
        setTimeout(() => {
          setCustomers(prev => prev.filter(c => c.id !== customer.id));
        }, visitStore ? 2500 : 1000);
      }
    }, 50);
  };

  return (
    <div className="fixed inset-0 bg-[#0a0a0c] text-white flex flex-col font-sans select-none overflow-hidden">
      {/* Floating Feedback Texts */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        {floatingTexts.map(t => (
          <div 
            key={t.id}
            className={`absolute left-1/2 top-1/3 -translate-x-1/2 font-black text-3xl italic animate-[float-up_2s_ease-out_forwards]
              ${t.type === 'revenue' ? 'text-green-400' : t.type === 'expense' ? 'text-red-400' : t.type === 'error' ? 'text-orange-500 shadow-[0_0_20px_rgba(251,146,60,0.5)]' : 'text-cyan-400'}`}
          >
            {t.text}
          </div>
        ))}
      </div>

      {/* Header HUD */}
      <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-black/60 backdrop-blur-2xl z-50">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white/30 tracking-[0.4em] uppercase">Pump Panic 1980s</span>
            <h1 className="text-4xl font-black italic tracking-tighter text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]">
              ₩{money.toLocaleString()}
            </h1>
          </div>
          <button 
            onClick={() => setIsShopOpen(true)}
            className="bg-purple-600 hover:bg-purple-500 px-6 py-2 rounded-xl font-black italic text-sm transition-all active:scale-95 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
          >
            🏪 UPGRADE SHOP
          </button>
          <button 
            onClick={() => setIsStockOpen(true)}
            className="bg-cyan-600 hover:bg-cyan-500 px-6 py-2 rounded-xl font-black italic text-sm transition-all active:scale-95 shadow-[0_0_15px_rgba(34,211,238,0.3)] border-b-4 border-cyan-800"
          >
            📈 STOCK MARKET
          </button>
        </div>
        
        <div className="flex flex-col items-center">
           <div className="text-pink-500 font-black italic text-2xl tracking-tighter animate-pulse uppercase">DAY {day}</div>
           <div className={`text-3xl font-mono font-bold ${timeLeft < 10 ? 'text-red-500 animate-ping' : 'text-white'}`}>
             {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
           </div>
        </div>

        <div className="flex gap-8">
           <div className="text-right">
              <div className="text-[10px] text-red-500 uppercase font-black tracking-widest animate-pulse">Total Debt</div>
              <div className="text-2xl font-black italic text-red-500">₩{debt.toLocaleString()}</div>
           </div>
        </div>
      </header>

      {/* Main Layout */}
      <main className="flex-1 flex p-6 gap-6 overflow-hidden">
        {/* Left: Wholesale Market */}
        <aside className="w-[320px] flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
          <div className="bg-black/60 backdrop-blur-xl p-6 rounded-[2.5rem] border-2 border-white/5 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-black italic tracking-tight text-white/40 uppercase">Wholesale</h2>
              <div className="px-2 py-0.5 bg-white/5 rounded-full text-[8px] font-bold text-white/30 tracking-widest">LIVE</div>
            </div>
            
            <PriceGraph data={prices.GASOLINE.history} color="text-green-500" title="가솔린" currentPrice={prices.GASOLINE.wholesale} />
            <PriceGraph data={prices.DIESEL.history} color="text-yellow-600" title="디젤" currentPrice={prices.DIESEL.wholesale} />
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => buyOil('GASOLINE')}
                className="group relative bg-[#111] hover:bg-green-950/30 border-2 border-green-500/30 p-4 rounded-3xl transition-all active:scale-95 overflow-hidden flex justify-between items-center"
              >
                <div className="relative z-10 text-left">
                  <span className="text-xs font-black text-green-500 block uppercase">GASOLINE</span>
                  <span className="text-[9px] text-white/40">100L 매입</span>
                </div>
                <div className="text-right z-10">
                   <span className="text-xs font-mono font-bold">₩{(prices.GASOLINE.wholesale * 100).toLocaleString()}</span>
                </div>
                <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
              <button 
                onClick={() => buyOil('DIESEL')}
                className="group relative bg-[#111] hover:bg-yellow-950/30 border-2 border-yellow-500/30 p-4 rounded-3xl transition-all active:scale-95 overflow-hidden flex justify-between items-center"
              >
                <div className="relative z-10 text-left">
                  <span className="text-xs font-black text-yellow-500 block uppercase">DIESEL</span>
                  <span className="text-[9px] text-white/40">100L 매입</span>
                </div>
                <div className="text-right z-10">
                   <span className="text-xs font-mono font-bold">₩{(prices.DIESEL.wholesale * 100).toLocaleString()}</span>
                </div>
                <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </div>
          </div>
        </aside>

        {/* Center: Interaction Area */}
        <StationCanvas 
          customers={customers} 
          inventory={inventory} 
          onStartFilling={startFilling}
          currentFillingId={currentFillingId}
          selectedNozzle={selectedNozzle}
          setSelectedNozzle={setSelectedNozzle}
          location={location}
          upgrades={upgrades}
        />

        {/* Right: Retail & Staff */}
        <aside className="w-[300px] flex flex-col gap-6">
          <div className="bg-black/60 backdrop-blur-xl p-8 rounded-[3rem] border-2 border-white/5 space-y-8 shadow-2xl">
            <h2 className="text-xl font-black italic tracking-tight text-white/40 uppercase">Retail</h2>
            {Object.entries(retailPrices).map(([type, price]) => (
              <div key={type} className="space-y-4">
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest items-center">
                  <span className="text-white/30">{type}</span>
                  <span className={`text-lg font-mono ${type === 'GASOLINE' ? 'text-green-400' : 'text-yellow-400'}`}>₩{price}</span>
                </div>
                <input 
                  type="range" min="1400" max="2500" step="10" 
                  value={price}
                  onChange={(e) => setRetailPrices(prev => ({ ...prev, [type]: parseInt(e.target.value) }))}
                  className="w-full accent-cyan-500 transition-all cursor-pointer h-2 bg-white/5 rounded-full appearance-none overflow-hidden"
                />
              </div>
            ))}
            <div className="pt-4 border-t border-white/5">
               <p className="text-[10px] text-cyan-400/50 font-bold italic text-center">붐박스는 손님을 즐겁게 합니다 🎵</p>
            </div>
          </div>

          {/* Alba Status Panel */}
          <div className="bg-black/60 backdrop-blur-xl p-6 rounded-[2.5rem] border-2 border-white/5 shadow-2xl flex-1">
             <h2 className="text-sm font-black italic tracking-tight text-white/20 uppercase mb-4">Station Staff</h2>
             <div className="space-y-4">
               <div className={`p-4 rounded-2xl border ${upgrades.HIRE_ALBA ? 'border-purple-500/50 bg-purple-500/10' : 'border-white/5 bg-white/5 opacity-40'}`}>
                 <div className="flex items-center gap-3">
                   <span className="text-2xl">{upgrades.HIRE_ALBA ? '👷' : '👤'}</span>
                   <div>
                     <div className="text-[10px] font-black text-white/50 uppercase">Fuel Attendant</div>
                     <div className="text-xs font-bold text-white">{upgrades.HIRE_ALBA ? 'VETERAN HANS' : 'NOT HIRED'}</div>
                   </div>
                 </div>
                 {upgrades.HIRE_ALBA > 0 && (
                    <div className="mt-2 text-[8px] text-purple-400 font-bold animate-pulse uppercase">Currently: Monitoring Nozzles</div>
                 )}
               </div>

               <div className={`p-4 rounded-2xl border ${upgrades.BOOMBOX ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-white/5 bg-white/5 opacity-40'}`}>
                 <div className="flex items-center gap-3">
                   <span className="text-2xl">📻</span>
                   <div>
                     <div className="text-[10px] font-black text-white/50 uppercase">Entertainment</div>
                     <div className="text-xs font-bold text-white">{upgrades.BOOMBOX ? 'SYNTHWAVE BEATS' : 'SILENT'}</div>
                   </div>
                 </div>
               </div>
             </div>
          </div>
        </aside>
      </main>

      {/* Overlays */}
      {gameStatus === 'auction' && (
        <AuctionOverlay locations={GAME_CONFIG.AUCTION_LOCATIONS} onSelect={selectLocation} />
      )}

      {/* Day End Settlement Overlay */}
      {gameStatus === 'dayend' && (
        <div className="fixed inset-0 z-[300] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-8">
          <div className="bg-[#111] border-4 border-cyan-500/30 p-12 rounded-[4rem] w-full max-w-2xl shadow-[0_0_100px_rgba(34,211,238,0.2)]">
            <h2 className="text-cyan-400 text-6xl font-black italic tracking-tighter uppercase mb-2 text-center">SHIFT END</h2>
            <p className="text-white/30 font-mono text-center uppercase tracking-[0.5em] mb-12">Day {day} Settlement Report</p>
            
            <div className="space-y-6 mb-12">
               <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-white/50 font-bold uppercase">Today's Revenue</span>
                  <span className="text-2xl font-black text-green-400">+₩{dailyStats.revenue.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-white/50 font-bold uppercase">Penalties (Mix-ups)</span>
                  <span className="text-2xl font-black text-red-500">-₩{dailyStats.penalties.toLocaleString()}</span>
               </div>
               <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <span className="text-white/50 font-bold uppercase">Total Debt Remaining</span>
                  <span className="text-2xl font-black text-red-500">₩{debt.toLocaleString()}</span>
               </div>
            </div>

            <div className="flex flex-col gap-4">
               <button 
                  onClick={() => payDebt(Math.min(money, debt))}
                  disabled={money <= 0 || debt <= 0}
                  className="w-full py-5 bg-red-600 hover:bg-red-500 disabled:opacity-30 rounded-3xl font-black text-xl italic transition-all shadow-lg"
               >
                  PAY DEBT WITH ALL CASH
               </button>
               <button 
                  onClick={nextDay}
                  className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 rounded-3xl font-black text-xl italic transition-all shadow-lg"
               >
                  START DAY {day + 1}
               </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over (Death) Overlay */}
      {money <= 0 && debt > 1000000 && day > 3 && (
        <div className="fixed inset-0 z-[400] bg-red-950/90 backdrop-blur-3xl flex flex-col items-center justify-center p-8">
           <div className="text-9xl mb-8 animate-bounce">💀</div>
           <h2 className="text-white text-7xl font-black italic tracking-tighter uppercase mb-4">Wasted</h2>
           <p className="text-red-400 text-xl font-bold mb-12 text-center max-w-md">빚을 갚지 못한 당신은 마피아에 의해 차가운 바닷속으로 던져졌습니다...</p>
           <button 
              onClick={() => window.location.reload()}
              className="px-12 py-5 bg-white text-black font-black text-2xl italic rounded-full hover:scale-110 transition-all"
           >
              RETRY FROM HELL
           </button>
        </div>
      )}

      {/* Upgrade Shop Overlay */}
      {isShopOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="bg-[#111] border-4 border-purple-900/50 p-10 rounded-[4rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-[0_0_100px_rgba(147,51,234,0.2)]">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-purple-500 text-6xl font-black italic tracking-tighter uppercase">Upgrade Shop</h2>
                <p className="text-white/30 mt-2 font-mono uppercase tracking-widest text-sm text-center">최신 기술로 경쟁사를 압도하세요.</p>
              </div>
              <button onClick={() => setIsShopOpen(false)} className="bg-white/5 hover:bg-white/10 text-white w-16 h-16 rounded-full font-black text-2xl transition-all">X</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {Object.entries(GAME_CONFIG.UPGRADES).map(([key, item]) => {
                const level = upgrades[key];
                const cost = item.cost * (level + 1);
                return (
                  <div key={key} className="bg-white/5 p-8 rounded-[3rem] border-2 border-white/5 hover:border-purple-500/30 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                      <span className="text-8xl">🚀</span>
                    </div>
                    <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-white text-3xl font-black italic">{item.name}</h3>
                        <span className="bg-purple-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">LV. {level}</span>
                      </div>
                      <p className="text-white/40 text-sm mb-10 h-10 leading-relaxed font-medium">{item.desc}</p>
                      <button 
                        onClick={() => buyUpgrade(key)}
                        disabled={money < cost}
                        className={`w-full py-5 rounded-3xl font-black text-xl transition-all active:scale-95
                          ${money >= cost ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-[0_10px_30px_rgba(147,51,234,0.3)]' : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'}`}
                      >
                        UPGRADE: ₩{cost.toLocaleString()}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Stock Market Overlay */}
      {isStockOpen && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-xl flex items-center justify-center p-8">
          <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setIsStockOpen(false)} 
              className="absolute -top-4 -right-4 bg-white/5 hover:bg-white/10 text-white w-12 h-12 rounded-full font-black text-xl z-[210] transition-all"
            >
              X
            </button>
            <StockMarket 
              money={money} 
              rivals={rivals} 
              onBuyShare={buyShare} 
              onSellShare={sellShare} 
            />
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
        @keyframes float-up {
          0% { transform: translate(-50%, 0); opacity: 0; }
          20% { opacity: 1; }
          100% { transform: translate(-50%, -150px); opacity: 0; }
        }
        input[type='range']::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          background: #22d3ee;
          border-radius: 50%;
          cursor: pointer;
          border: 4px solid #000;
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
        }
      `}</style>
      {/* Game Over / Wasted Screen */}
      {gameStatus === 'gameOver' && (
        <div className="fixed inset-0 z-[500] bg-black flex flex-col items-center justify-center p-8 text-center">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
            <div className="relative z-10 space-y-8 animate-in fade-in zoom-in duration-1000">
               <h2 className="text-red-600 text-[10rem] font-black italic tracking-tighter uppercase leading-none drop-shadow-[0_0_50px_rgba(220,38,38,0.8)]">WASTED</h2>
               <div className="space-y-4">
                  <p className="text-white text-3xl font-black italic uppercase tracking-widest">빚을 갚지 못해 마피아에게 숙청당했습니다.</p>
                  <p className="text-white/40 font-mono">신체 포기 각서가 이행되었습니다.</p>
               </div>
               <div className="pt-12">
                  <button 
                    onClick={() => window.location.reload()}
                    className="group relative px-12 py-6 bg-white text-black font-black italic text-2xl hover:bg-red-600 hover:text-white transition-all transform hover:scale-110"
                  >
                    <span className="relative z-10">LAST CHANCE? (RETRY)</span>
                    <div className="absolute inset-x-0 -bottom-2 h-2 bg-gray-400 group-hover:bg-red-900 transition-colors"></div>
                  </button>
               </div>
            </div>
            
            {/* Mafia Shadows Decoration */}
            <div className="absolute bottom-0 left-0 w-64 h-64 opacity-20 filter grayscale invert contrast-150">
               <span className="text-[12rem]">🕶️</span>
            </div>
            <div className="absolute top-10 right-10 w-64 h-64 opacity-20 filter grayscale invert contrast-150 rotate-12">
               <span className="text-[12rem]">🔫</span>
            </div>
        </div>
      )}
    </div>
  );
};

export default PumpPanic;
