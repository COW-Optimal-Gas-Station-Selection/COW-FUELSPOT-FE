import KakaoMap from '../molecules/KakaoMap';
import LocationButton from '../atoms/LocationButton';
import SearchButton from '../atoms/SearchButton';
import SearchInput from '../atoms/SearchInput';

const MapViewPanel = ({ stations = [], selectedStation, onMarkerClick, routeTo, currentLocation, onLocationClick }) => {
  return (
    <div className="bg-white rounded-[10px] shadow-sm overflow-hidden flex flex-col border border-gray-100 h-full">
      {/* 지도 상단 검색 컨트롤 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput />
          </div>
          <div className="flex gap-2">
            <div className="w-[130px]">
              <LocationButton onClick={onLocationClick} />
            </div>
            <div className="w-[100px]">
              <SearchButton />
            </div>
          </div>
        </div>
      </div>
      {/* 지도 영역 */}
      <div className="flex-1 relative">
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