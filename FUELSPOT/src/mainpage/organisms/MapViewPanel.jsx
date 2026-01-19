import KakaoMap from '../molecules/KakaoMap';


const MapViewPanel = ({ stations = [], selectedStation, onMarkerClick, routeTo, currentLocation }) => {
  return (
    <div className="bg-white rounded-[10px] shadow-sm overflow-hidden flex flex-col border border-gray-100 h-full">
      <KakaoMap
        className="w-full flex-1 min-h-[300px]"
        stations={stations}
        selectedStation={selectedStation}
        onMarkerClick={onMarkerClick}
        routeTo={routeTo}
        currentLocation={currentLocation}
      />
    </div>
  );
};

export default MapViewPanel;