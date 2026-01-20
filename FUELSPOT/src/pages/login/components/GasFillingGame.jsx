import { useCallback, useEffect, useRef, useState } from 'react';

const FUEL_TYPES = {
  REGULAR: { name: '가솔린', color: 'bg-green-500', icon: '🟢', price: 1650 },
  DIESEL: { name: '디젤', color: 'bg-yellow-600', icon: '🟡', price: 1530 },
  PREMIUM: { name: '고급유', color: 'bg-purple-600', icon: '🟣', price: 1890 },
};

const GasFillingGame = () => {
  const [score, setScore] = useState(0);
  const [lastScore, setLastScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameStatus, setGameStatus] = useState('idle'); // idle, arrival, filling, completed, gameover
  const [gameOverReason, setGameOverReason] = useState(null); // timeout, overflow
  const [feedback, setFeedback] = useState(null); // { label, points, color }
  
  // Current Task State
  const [targets, setTargets] = useState([]); // Array of { type, amount, current }
  const [currentTargetIdx, setCurrentTargetIdx] = useState(0);
  const [selectedFuelType, setSelectedFuelType] = useState(null); // User must select this
  const [isFilling, setIsFilling] = useState(false);
  
  // Obstacles & Effects
  const [isGlitching, setIsGlitching] = useState(false);
  const [showDistraction, setShowDistraction] = useState(false);
  const [isOilSpilled, setIsOilSpilled] = useState(false);
  const [isNozzleJammed, setIsNozzleJammed] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);
  const [wrongFuelWarning, setWrongFuelWarning] = useState(false);
  
  const fillInterval = useRef(null);
  const timerInterval = useRef(null);

  // 타이머 시스템 수정: score 의존성 제거 및 로직 강화
  useEffect(() => {
    let interval = null;
    if (gameStatus === 'filling' || gameStatus === 'idle' || gameStatus === 'arrival' || gameStatus === 'completed') {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 0) {
            clearInterval(interval);
            setLastScore(score);
            setGameOverReason('timeout');
            setGameStatus('gameover');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameStatus]); // score 제거하여 타이머가 리셋되는 현상 방지

  const initNewCustomer = useCallback(() => {
    setGameStatus('arrival');
    setIsOilSpilled(false);
    setShowDistraction(false);
    setIsNozzleJammed(false);
    setSelectedFuelType(null);
    setWrongFuelWarning(false);
    
    // Difficulty scaling based on score/combo
    const taskCount = combo >= 10 ? 3 : combo >= 5 ? 2 : 1;
    const types = Object.keys(FUEL_TYPES);
    const newTargets = Array.from({ length: taskCount }, () => {
      const type = types[Math.floor(Math.random() * types.length)];
      return {
        type,
        amount: Math.floor(Math.random() * 30) + 15,
        current: 0,
        price: FUEL_TYPES[type].price
      };
    });
    
    setTargets(newTargets);
    setCurrentTargetIdx(0);
    
    setTimeout(() => {
      setGameStatus('idle');
    }, 800);
  }, [combo]);

  useEffect(() => {
    initNewCustomer();
    setTimeLeft(60); // 좀 더 넉넉하게 부여
  }, [initNewCustomer]);

  const startFilling = () => {
    if (gameStatus === 'arrival' || gameStatus === 'gameover' || isNozzleJammed) return;
    
    const currentTarget = targets[currentTargetIdx];
    if (selectedFuelType !== currentTarget.type) {
      setWrongFuelWarning(true);
      setTimeout(() => setWrongFuelWarning(false), 500);
      return;
    }

    if (gameStatus === 'completed') {
      initNewCustomer();
      return;
    }
    setIsFilling(true);
    setGameStatus('filling');
    
    const baseSpeed = 0.12; // 초기 속도를 낮춰서 시작을 쉽게 조절
    const difficultyMultiplier = Math.min(combo * 0.08, 2.0); // 콤보가 쌓일수록 확실하게 빨라짐
    const currentSpeed = baseSpeed + difficultyMultiplier + (Math.random() * 0.1);

    fillInterval.current = setInterval(() => {
      setTargets(prev => {
        const next = [...prev];
        const target = next[currentTargetIdx];
        target.current += currentSpeed;

        // Obstacle: Screen Glitch
        if (combo >= 3 && Math.random() > 0.96) {
          setIsGlitching(true);
          setTimeout(() => setIsGlitching(false), 150);
        }

        // Obstacle: Nozzle Jam (Randomly stops filling)
        if (combo >= 5 && Math.random() > 0.99) {
          stopFilling();
          setIsNozzleJammed(true);
          setShakeIntensity(2);
          setTimeout(() => {
            setIsNozzleJammed(false);
            setShakeIntensity(0);
          }, 1200);
        }

        // Distraction: Angry Customer
        if (target.current > target.amount * 0.9 && Math.random() > 0.97) {
          setShowDistraction(true);
        }

        return next;
      });
    }, 30);
  };

  const calculateScore = (diff) => {
    if (diff < 0.2) return { points: 2500, label: 'PERFECT!! 💎', color: 'text-cyan-400' };
    if (diff < 0.6) return { points: 1200, label: 'EXCELLENT! 🌟', color: 'text-yellow-400' };
    if (diff < 1.8) return { points: 500, label: 'GREAT! 👍', color: 'text-green-400' };
    return { points: 0, label: 'OVERFLOW! ⛽', color: 'text-red-500' };
  };

  const stopFilling = () => {
    if (gameStatus !== 'filling') return;
    setIsFilling(false);
    clearInterval(fillInterval.current);
    setShowDistraction(false);
    
    const currentTarget = targets[currentTargetIdx];
    const diff = Math.abs(currentTarget.current - currentTarget.amount);
    const result = calculateScore(diff);
    
    if (result.points > 0) {
      const bonus = combo * 500;
      const earned = result.points + (currentTargetIdx === targets.length - 1 ? bonus : 0);
      
      setFeedback({ 
        label: result.label, 
        points: earned, 
        color: result.color 
      });
      setTimeout(() => setFeedback(null), 1500);

      if (currentTargetIdx < targets.length - 1) {
        // Next Fuel Type in same car
        setCurrentTargetIdx(prev => prev + 1);
        setSelectedFuelType(null); // 다시 골라야 함
        setScore(prev => prev + result.points);
      } else {
        // Car Completed
        setScore(prev => prev + result.points + bonus);
        setCombo(prev => prev + 1);
        setTimeLeft(prev => Math.min(prev + 12, 60));
        setGameStatus('completed');
      }
    } else {
      setLastScore(score);
      setScore(0);
      setCombo(0);
      setIsOilSpilled(true);
      setGameOverReason('overflow');
      setTimeout(() => {
        setGameStatus('gameover');
      }, 1000);
    }
  };

  const currentFuelTarget = targets[currentTargetIdx];
  const fuelInfo = FUEL_TYPES[currentFuelTarget?.type || 'REGULAR'];
  const totalPrice = targets.reduce((acc, t) => acc + (t.current * t.price), 0);

  return (
    <div className={`absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none transition-colors duration-1000
      ${combo >= 5 ? 'bg-[#1a0b2e]' : 'bg-[#0a0f1d]'}`}>
      
      {/* Background FX */}
      <div className="absolute inset-0">
        {combo >= 5 && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.3),transparent_70%)] animate-pulse"></div>
        )}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_10%,rgba(37,99,235,0.15),transparent_50%)]"></div>
      </div>
      
      {/* Cars */}
      <div className={`absolute transition-all duration-700 ease-in-out flex flex-col items-center
        ${gameStatus === 'arrival' ? '-left-64' : 
          gameStatus === 'completed' && !isFilling ? 'left-[120%]' : 
          'left-10 lg:left-[10%]'} 
        bottom-24 lg:bottom-[15%]`}>
        
        <div className="relative">
          {/* Requirement Speech Bubble */}
          {(gameStatus === 'idle' || gameStatus === 'filling') && currentFuelTarget && (
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 bg-white px-6 py-4 rounded-3xl shadow-2xl animate-bounce z-20 flex items-center gap-3 border-4 border-blue-500">
              <span className="text-3xl">{FUEL_TYPES[currentFuelTarget.type].icon}</span>
              <div className="flex flex-col">
                <span className="text-black text-xl font-black whitespace-nowrap">{FUEL_TYPES[currentFuelTarget.type].name}</span>
                <span className="text-blue-600 text-2xl font-mono font-black">{currentFuelTarget.amount}L</span>
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 border-[16px] border-transparent border-t-white"></div>
            </div>
          )}

          {showDistraction && (
            <div className="absolute -top-20 -right-20 bg-red-500 text-white p-4 rounded-2xl animate-ping z-30 font-black text-lg">
              빨리요! 😡
            </div>
          )}
          
          <div className={`text-[140px] lg:text-[220px] drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)] transition-transform duration-300
            ${isFilling ? `animate-[shake_0.1s_infinite]` : ''}
            ${shakeIntensity > 0 ? 'animate-ping' : ''}`}>
            {isOilSpilled ? '💥' : 
             targets.length === 3 ? '🚛' : 
             targets.length === 2 ? '🚐' : 
             combo >= 10 ? '🏎️' : '🚗'}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-8 left-8 right-8 flex justify-between items-start pointer-events-none">
        <div>
          <div className="text-blue-500 text-[10px] font-black tracking-[0.5em] uppercase mb-1">Total Score</div>
          <div className="text-white text-5xl font-mono font-bold tracking-tighter drop-shadow-lg">
            {score.toLocaleString()}
          </div>
          {combo > 0 && (
            <div className="mt-2 flex items-center gap-2">
              <span className={`px-3 py-0.5 rounded-full italic text-[10px] font-black ${combo >= 5 ? 'bg-purple-500 text-white animate-pulse' : 'bg-orange-500 text-black'}`}>
                {combo >= 5 ? 'FEVER' : 'COMBO'}
              </span>
              <span className={`text-2xl font-black italic ${combo >= 5 ? 'text-purple-400' : 'text-orange-500'}`}>{combo}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end w-48">
          <div className="text-red-500 text-[10px] font-black tracking-[0.5em] uppercase mb-1">Time Remaining</div>
          <div className={`text-5xl font-mono font-bold transition-colors duration-300 ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
            {timeLeft}s
          </div>
          {/* 시각적 타이머 바 추가 */}
          <div className="w-full h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden border border-white/5">
            <div 
              className={`h-full transition-all duration-1000 ease-linear ${timeLeft <= 10 ? 'bg-red-500' : 'bg-blue-500'}`}
              style={{ width: `${(timeLeft / 60) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main UI */}
      <div className={`relative pointer-events-auto flex flex-col gap-6 p-8 rounded-[3rem] bg-black/85 backdrop-blur-3xl border-2 border-white/20 shadow-[0_0_80px_rgba(0,0,0,0.8)] transition-all duration-300
        ${isGlitching ? 'skew-x-6 scale-105' : ''} 
        ${gameStatus === 'gameover' ? 'scale-110 blur-xl' : 'scale-90 lg:scale-100'}`}>
        
        {/* Fuel Selection Buttons */}
        <div className="flex justify-center gap-4 mb-2">
          {Object.entries(FUEL_TYPES).map(([type, info]) => (
            <button
              key={type}
              onClick={() => {
                if (gameStatus === 'arrival' || gameStatus === 'gameover') return;
                setSelectedFuelType(type);
              }}
              className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 border-2
                ${selectedFuelType === type 
                  ? `${info.color} border-white scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]` 
                  : 'bg-white/5 border-transparent hover:bg-white/10'}`}
            >
              <span className="text-3xl">{info.icon}</span>
              <span className="text-white text-[10px] font-black">{info.name}</span>
            </button>
          ))}
        </div>

        {/* Display Panel */}
        <div className="space-y-6">
          <div className={`bg-[#050505] p-6 rounded-[2rem] border-[8px] border-[#1a1a1a] w-[320px] lg:w-[380px] shadow-[inset_0_8px_40px_rgba(0,0,0,1)] relative`}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>
            
            <div className="flex flex-col mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-xs font-black uppercase tracking-widest ${selectedFuelType ? 'text-white' : 'text-gray-600 animate-pulse'}`}>
                   {selectedFuelType ? `${FUEL_TYPES[selectedFuelType].name} 주유 중` : '유종을 선택하세요'}
                </span>
                {currentFuelTarget && (
                  <span className="text-blue-400 text-lg font-mono font-black">{currentFuelTarget.amount.toFixed(0)}L</span>
                )}
              </div>
              <div className="h-4 bg-gray-900 rounded-full overflow-hidden border border-white/5">
                <div 
                  className={`h-full transition-all duration-150 ${fuelInfo.color} shadow-[0_0_15px_rgba(255,255,255,0.1)]`}
                  style={{ width: `${(targets[currentTargetIdx]?.current / targets[currentTargetIdx]?.amount) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex justify-between items-end mb-4 overflow-hidden">
              <span className="text-gray-600 text-[10px] font-mono font-black uppercase tracking-widest leading-none mb-1">Total Price (KRW)</span>
              <span className="text-orange-500 text-4xl font-mono tracking-tighter font-black leading-none">
                {Math.floor(totalPrice).toLocaleString()}
              </span>
            </div>
            
            <div className="flex flex-col bg-black/60 p-5 rounded-2xl border border-white/10">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-600 text-[9px] font-mono font-black uppercase tracking-widest">Liters Filled</span>
              </div>
              <span className={`text-7xl font-mono tracking-tighter text-center transition-all
                ${isFilling ? 'text-green-400 drop-shadow-[0_0_30px_rgba(74,222,128,0.6)]' : 'text-green-900'}`}>
                {targets[currentTargetIdx]?.current.toFixed(2)}
              </span>
            </div>
          </div>

          <div 
            className={`relative cursor-pointer group active:scale-95 transition-all mx-auto
              ${isNozzleJammed ? 'opacity-50 grayscale' : ''}
              ${wrongFuelWarning ? 'animate-shake-horizontal ring-4 ring-red-500 rounded-full' : ''}`}
            onMouseDown={startFilling}
            onMouseUp={stopFilling}
            onMouseLeave={isFilling ? stopFilling : undefined}
            onTouchStart={startFilling}
            onTouchEnd={stopFilling}
          >
            {isNozzleJammed && (
              <div className="absolute -top-12 left-1/2 -translate-x-1/2 text-red-500 font-extrabold text-sm animate-bounce whitespace-nowrap bg-black/50 px-4 py-1 rounded-full border border-red-500">노즐 걸림!!</div>
            )}
            <div className={`w-32 h-32 rounded-full flex items-center justify-center text-6xl transition-all duration-300 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative border-4 border-white/20
              ${isFilling ? `${fuelInfo.color} ring-[15px] ring-white/10 scale-105 shadow-[0_0_60px_rgba(255,255,255,0.2)]` : 'bg-gray-800 hover:bg-gray-700'}`}>
              <span className={`transition-transform duration-300 ${isFilling ? 'rotate-[-20deg] scale-110' : 'rotate-0'}`}>
                {isNozzleJammed ? '❌' : '⛽'}
              </span>
              {isFilling && <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping"></div>}
            </div>
          </div>
        </div>
        
        <div className="text-center text-white/30 text-xs font-black tracking-[0.4em] uppercase">
          Hold to Pump • Choose Fuel First
        </div>
      </div>

      {feedback && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] pointer-events-none animate-bounce">
          <div className={`flex flex-col items-center justify-center bg-black/80 backdrop-blur-md p-10 rounded-[3rem] border-4 border-white/20 shadow-[0_0_100px_rgba(0,0,0,0.8)]`}>
            <span className={`text-7xl font-black ${feedback.color} mb-3 tracking-tighter`}>{feedback.label}</span>
            <span className="text-white text-4xl font-mono font-black">+{feedback.points.toLocaleString()} PTS</span>
          </div>
      </div>
      )}

      {gameStatus === 'gameover' && (
        <div className="absolute inset-0 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center z-[100] pointer-events-auto">
          <div className={`${gameOverReason === 'overflow' ? 'text-orange-500' : 'text-red-600'} text-9xl font-black mb-6 tracking-tighter uppercase animate-pulse`}>
            {gameOverReason === 'overflow' ? 'GAS EXPLOSION!' : 'SHIFT ENDED'}
          </div>
          <div className="text-white/60 text-2xl mb-4 font-black">
            {gameOverReason === 'overflow' ? '유종을 넘겨버렸습니다! 🌋' : '시간이 다 되었습니다! ⏰'}
          </div>
          <div className="text-white text-4xl mb-12 font-mono font-black border-y-4 border-white/20 py-8 px-16">
            FINAL PROFIT: <span className="text-yellow-400">₩{Math.floor(totalPrice).toLocaleString()}</span>
          </div>
          <div className="text-blue-400 text-2xl mb-12 font-black italic">
            PREVIOUS SCORE: {lastScore.toLocaleString()}
          </div>
          <button 
            onClick={() => {
              setScore(0);
              setLastScore(0);
              setCombo(0);
              setTimeLeft(60);
              setGameOverReason(null);
              initNewCustomer();
            }}
            className="bg-blue-600 hover:bg-blue-500 text-white px-20 py-8 rounded-[2rem] font-black text-4xl transition-all active:scale-95 shadow-[0_20px_50px_rgba(37,99,235,0.4)]"
          >
            RETRY SHIFT
          </button>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translate(0, 0) rotate(0); }
          25% { transform: translate(-4px, 4px) rotate(-1deg); }
          50% { transform: translate(4px, -4px) rotate(1deg); }
          75% { transform: translate(-4px, -4px) rotate(-0.5deg); }
        }
        @keyframes shake-horizontal {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-10px); }
          40%, 80% { transform: translateX(10px); }
        }
        .animate-shake-horizontal {
          animation: shake-horizontal 0.3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default GasFillingGame;
