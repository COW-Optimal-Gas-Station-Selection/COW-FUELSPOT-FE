import KakaoMap from '../molecules/KakaoMap';
import LocationButton from '../atoms/LocationButton';
import SearchInput from '../atoms/SearchInput';

const MapViewPanel = ({ 
  stations = [], 
  selectedStation, 
  onMarkerClick, 
  routeTo, 
  currentLocation, 
  onLocationClick,
  searchKeyword,
  onSearchChange,
  suggestions = [],
  onSuggestionClick
}) => {
  return (
    <div className="bg-white rounded-[10px] shadow-sm flex flex-col border border-gray-100 h-full relative">
      {/* 지도 상단 검색 컨트롤 */}
      <div className="p-3 md:p-4 border-b border-gray-100 z-20 bg-[#f9fafb] rounded-t-[10px]">
        <div className="flex flex-row items-center gap-2 min-w-0">
          <div className="flex-1 min-w-0 relative">
            <SearchInput 
              value={searchKeyword}
              onChange={onSearchChange}
              suggestions={suggestions}
              onSuggestionClick={onSuggestionClick}
            />
          </div>
          <div className="shrink-0 w-[90px] md:w-[130px]">
            <LocationButton onClick={onLocationClick} />
          </div>
        </div>
      </div>
      {/* 지도 영역 */}
      <div className="flex-1 relative z-10 overflow-hidden rounded-b-[10px]">
        <KakaoMap
          className="w-full h-full min-h-[300px]"
          stations={stations}
          selectedStation={selectedStation}
          onMarkerClick={onMarkerClick}
          routeTo={routeTo}
          currentLocation={currentLocation}
        />
      </div>
    </div>
  );
};

export default MapViewPanel;