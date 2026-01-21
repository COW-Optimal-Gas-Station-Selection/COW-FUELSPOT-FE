import { useEffect, useState } from 'react';

export const useMarket = (gameStatus) => {
  const [prices, setPrices] = useState({
    GASOLINE: { wholesale: 1500, history: [1500] },
    DIESEL: { wholesale: 1400, history: [1400] }
  });
  const [news, setNews] = useState(null);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      setPrices(prev => {
        const update = (current) => {
          const change = (Math.random() - 0.5) * 50;
          const next = Math.max(1200, Math.min(2200, current + change));
          return next;
        };

        const nextG = update(prev.GASOLINE.wholesale);
        const nextD = update(prev.DIESEL.wholesale);

        return {
          GASOLINE: { 
            wholesale: nextG, 
            history: [...prev.GASOLINE.history.slice(-19), nextG] 
          },
          DIESEL: { 
            wholesale: nextD, 
            history: [...prev.DIESEL.history.slice(-19), nextD] 
          }
        };
      });

      // Random News
      if (Math.random() > 0.95) {
        const events = [
          { msg: "중동 정세불안! 유가 급등 조짐! 📈", effect: 'high' },
          { msg: "새로운 유전 발견! 유가 하락 예상 📉", effect: 'low' },
          { msg: "러시아워 시작! 수요 폭증! 🚗", effect: 'traffic' }
        ];
        setNews(events[Math.floor(Math.random() * events.length)]);
        setTimeout(() => setNews(null), 5000);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [gameStatus]);

  return { prices, news };
};
