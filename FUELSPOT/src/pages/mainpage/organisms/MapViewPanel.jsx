import LocationButton from '../atoms/LocationButton';
import SearchInput from '../atoms/SearchInput';
import KakaoMap from '../molecules/KakaoMap';

const MapViewPanel = ({
  stations = [],
  selectedStation,
  onMarkerClick,
  routeTo,
  onCloseRoute,
  currentLocation,
  onLocationClick,
  searchKeyword,
  onSearchChange,
  suggestions = [],
  onSuggestionClick,
  recentKeywords = [],
  onDeleteRecentKeyword,
  onDeleteAllRecentKeywords,
  selectedFuel,
  onMenuClick,
  mobileListLevel
}) => {
  return (
    <div className="bg-white rounded-[10px] shadow-sm flex flex-col border border-gray-100 h-full relative">
      {/* 지도 상단 검색 컨트롤 */}
      <div className="p-3 md:p-4 border-b border-gray-100 z-20 bg-[#f9fafb] rounded-t-[10px]">
        <div className="flex flex-row items-center gap-2 min-w-0">
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="xl:hidden shrink-0 w-11 h-11 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center active:scale-95 transition-all"
              aria-label="메뉴 열기"
            >
              <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            </button>
          )}
          <div className="flex-1 min-w-0 relative">
            <SearchInput
              value={searchKeyword}
              onChange={onSearchChange}
              suggestions={suggestions}
              onSuggestionClick={onSuggestionClick}
              recentKeywords={recentKeywords}
              onDeleteRecentKeyword={onDeleteRecentKeyword}
              onDeleteAllRecentKeywords={onDeleteAllRecentKeywords}
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
          onCloseRoute={onCloseRoute}
          currentLocation={currentLocation}
          selectedFuel={selectedFuel}
          mobileListLevel={mobileListLevel}
        />
      </div>
    </div>
  );
};

export default MapViewPanel;