import StationCard from '../molecules/StationCard';

import { forwardRef } from 'react';

const StationListPanel = forwardRef(({ stations = [], onStationClick, onNavigate }, ref) => {
  return (
    <div ref={ref} className="bg-white rounded-[10px] shadow-sm overflow-hidden flex flex-col border border-gray-100 h-full">
      <div className="bg-[#f9fafb] border-b border-gray-100 p-4 flex items-center gap-2 sticky top-0 z-10">
        <h2 className="text-[#1e2939] text-xl font-bold">주유소 목록</h2>
        <span className="text-[#155dfc] text-xl font-bold">({stations.length}개)</span>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {stations.map(station => (
          <StationCard
            key={station.id}
            station={station}
            onClick={() => onStationClick && onStationClick(station)}
            onNavigate={onNavigate}
            data-station-id={station.id}
          />
        ))}
      </div>
    </div>
  );
});

export default StationListPanel;
