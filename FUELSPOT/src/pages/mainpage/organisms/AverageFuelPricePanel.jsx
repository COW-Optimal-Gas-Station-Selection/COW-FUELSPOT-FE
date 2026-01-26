import { FUEL_TYPE } from '../../../components/FuelPriceBox';
import PriceStatsCard from '../atoms/PriceStatsCard';
import { useAveragePrices } from '../hooks/useAveragePrices';

const AverageFuelPricePanel = () => {
  const { loading, error, ...avg } = useAveragePrices();
  const today = new Date().toLocaleDateString('ko-KR', { 
    month: 'long', 
    day: 'numeric',
    weekday: 'short'
  });

  return (
    <aside className="bg-white/90 backdrop-blur-md rounded-[24px] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col overflow-hidden w-full h-full relative">
      {loading && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md uppercase tracking-wide mb-1">Price Trend</span>
            <span className="text-[11px] text-gray-400 font-medium">{today}</span>
          </div>
        </div>
        <h2 className="text-lg font-extrabold text-gray-900 tracking-tight">오늘의 평균 유가</h2>
        <p className="text-[12px] text-gray-400 mt-1 leading-tight">전국 실시간 데이터를 분석한 평균 가격입니다.</p>
      </div>
      
      <div className="px-6 pb-6 flex flex-col gap-4">
        {error ? (
          <div className="p-4 bg-rose-50 text-rose-600 text-xs font-medium rounded-xl border border-rose-100">
            데이터를 불러오는 중 오류가 발생했습니다.
          </div>
        ) : (
          <div className="grid gap-3">
            <PriceStatsCard type="휘발유" price={avg[FUEL_TYPE.GASOLINE]} color="amber" />
            <PriceStatsCard type="경유" price={avg[FUEL_TYPE.DIESEL]} color="green" />
            <PriceStatsCard type="고급휘발유" price={avg[FUEL_TYPE.PREMIUM]} color="purple" />
          </div>
        )}
      </div>
    </aside>
  );
};

export default AverageFuelPricePanel;
