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
      <div className="p-4 border-b border-gray-100 z-20 bg-white rounded-t-[10px]">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <SearchInput 
              value={searchKeyword}
              onChange={onSearchChange}
              suggestions={suggestions}
              onSuggestionClick={onSuggestionClick}
            />
          </div>
          <div className="flex gap-2">
            <div className="w-[130px]">
              <LocationButton onClick={onLocationClick} />
            </div>
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