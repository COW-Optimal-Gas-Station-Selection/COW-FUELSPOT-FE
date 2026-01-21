import { useCallback, useEffect, useState } from 'react';

export const useCustomers = (location, retailPrices, gameStatus, upgrades, onAngryCustomer) => {
  const [customers, setCustomers] = useState([]);

  const spawnCustomer = useCallback(() => {
    const types = ['GASOLINE', 'DIESEL'];
    const fuelType = location.id === 'industrial' && Math.random() > 0.4 ? 'DIESEL' : types[Math.floor(Math.random() * 2)];
    
    // Price sensitivity
    const avgPrice = fuelType === 'GASOLINE' ? 1700 : 1600;
    const priceDiff = retailPrices[fuelType] - avgPrice;
    
    if (priceDiff > 400) return; // Increased threshold slightly

    const id = Date.now();
    const isVIP = Math.random() > 0.9;
    const isDrunk = !isVIP && Math.random() > 0.95;
    
    const newCustomer = {
      id,
      fuelType,
      amount: Math.floor(Math.random() * (upgrades?.PIPE_EFFICIENCY ? 80 : 50)) + 10,
      patience: isVIP ? 150 : isDrunk ? 40 : 100,
      status: 'waiting', 
      isVIP,
      isDrunk,
      icon: isVIP ? '🏎️' : isDrunk ? '🤢' : ['🚗', '🚘', '🚙', '🚛', '🚕'][Math.floor(Math.random() * 5)]
    };

    setCustomers(prev => [...prev, newCustomer]);
  }, [location, retailPrices, upgrades]);

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const baseInterval = 5000 / location.traffic;
    const interval = setInterval(() => {
      if (Math.random() > 0.4) spawnCustomer();
    }, baseInterval);

    return () => clearInterval(interval);
  }, [gameStatus, location, spawnCustomer]);

  // Patience tick
  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const interval = setInterval(() => {
      setCustomers(prev => prev.map(c => {
        if (c.status === 'completed' || c.status === 'angry') return c;
        
        // Loss of patience based on price
        const pricePenalty = Math.max(0, (retailPrices[c.fuelType] - 1700) / 20);
        const boomboxBonus = upgrades?.BOOMBOX ? 0.5 : 0;
        const drunkPenalty = c.isDrunk ? 1.5 : 0;
        const nextPatience = c.patience - (1 + pricePenalty + drunkPenalty - boomboxBonus);
        
        if (nextPatience <= 0) {
            onAngryCustomer?.(c);
        }

        return {
          ...c,
          patience: nextPatience,
          status: nextPatience <= 0 ? 'angry' : c.status
        };
      }).filter(c => c.patience > -20)); 
    }, 1000);

    return () => clearInterval(interval);
  }, [gameStatus, retailPrices, upgrades, onAngryCustomer]);

  return { customers, setCustomers };
};
