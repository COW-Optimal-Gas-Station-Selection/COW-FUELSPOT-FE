import { useEffect, useState } from 'react';
import { getAveragePrices, getSidoAveragePrices } from '../../../api/stationService';
import PriceCard from '../molecules/PriceCard';

const SIDO_LIST = [
  { id: 'SEOUL', name: '서울' },
  { id: 'GYEONGGI', name: '경기' },
  { id: 'GANGWON', name: '강원' },
  { id: 'CHUNGBUK', name: '충북' },
  { id: 'CHUNGNAM', name: '충남' },
  { id: 'JEONBUK', name: '전북' },
  { id: 'JEONNAM', name: '전남' },
  { id: 'GYEONGBUK', name: '경북' },
  { id: 'GYEONGNAM', name: '경남' },
  { id: 'BUSAN', name: '부산' },
  { id: 'JEJU', name: '제주' },
];

const AveragePricePanel = ({ initialSido }) => {
  const [nationalPrices, setNationalPrices] = useState(null);
  const [sidoPrices, setSidoPrices] = useState(null);
  const [selectedSido, setSelectedSido] = useState('SEOUL');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNationalPrices();
  }, []);

  useEffect(() => {
    if (initialSido) {
      setSelectedSido(initialSido);
    }
  }, [initialSido]);

  useEffect(() => {
    fetchSidoPrices();
  }, [selectedSido]);

  const fetchNationalPrices = async () => {
    try {
      const data = await getAveragePrices();
      setNationalPrices(data.prices);
    } catch (error) {
      console.error('Failed to fetch national prices', error);
    }
  };

  const fetchSidoPrices = async () => {
    setLoading(true);
    try {
      const data = await getSidoAveragePrices(selectedSido);
      setSidoPrices(data.prices);
    } catch (error) {
      console.error('Failed to fetch sido prices', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <PriceCard title="전국 평균 유가" prices={nationalPrices} />
      <PriceCard
        title="지역별 평균 유가"
        prices={sidoPrices}
        isSido={true}
        selectedSido={selectedSido}
        onSidoChange={setSelectedSido}
        sidoList={SIDO_LIST}
      />
    </div>
  );
};

export default AveragePricePanel;
