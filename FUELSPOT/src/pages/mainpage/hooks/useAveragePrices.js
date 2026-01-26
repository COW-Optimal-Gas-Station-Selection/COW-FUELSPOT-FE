import { useEffect, useState } from 'react';
import { stationService } from '../../../api/stationService';
import { FUEL_TYPE } from '../../../components/FuelPriceBox';

export const useAveragePrices = () => {
  const [data, setData] = useState({
    [FUEL_TYPE.GASOLINE]: 0,
    [FUEL_TYPE.DIESEL]: 0,
    [FUEL_TYPE.PREMIUM]: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await stationService.getAveragePrices();
        setData({
          [FUEL_TYPE.GASOLINE]: response.gasoline,
          [FUEL_TYPE.DIESEL]: response.diesel,
          [FUEL_TYPE.PREMIUM]: response.premium,
          loading: false,
          error: null
        });
      } catch (err) {
        setData(prev => ({ ...prev, loading: false, error: err }));
      }
    };

    fetchPrices();
  }, []);

  return data;
};
