import { useEffect, useRef, useState } from 'react';
import KakaoMapCurrentLocationMarker from '../atoms/KakaoMapCurrentLocationMarker';
import KakaoMapMarker from '../atoms/KakaoMapMarker';
import KakaoMapRoute from '../atoms/KakaoMapRoute';

const KAKAO_MAP_KEY = import.meta.env.VITE_KAKAO_MAP_KEY;


const KakaoMap = ({
  width = '100%',
  height = '100%',
  lat = 37.5665,
  lng = 126.9780,
  level = 3,
  stations = [],
  selectedStation = null,
  onMarkerClick,
  routeTo = null,
  onCloseRoute,
  currentLocation = { lat: 37.5665, lng: 126.9780 },
  selectedFuel,
  mobileListLevel = 0,
  ...props
}) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const [mapReady, setMapReady] = useState(false);

  // 지도 및 마커 렌더링
  useEffect(() => {
    const container = mapRef.current;
    const createOrUpdateMap = () => {
      window.kakao.maps.load(() => {
        if (!mapInstance.current) {
          const options = {
            center: new window.kakao.maps.LatLng(lat, lng),
            level,
          };
          mapInstance.current = new window.kakao.maps.Map(container, options);
          setMapReady(true);
          // 초기 렌더링 시 크기 조정이 필요할 수 있음
          setTimeout(() => {
            if (mapInstance.current) {
              mapInstance.current.relayout();
            }
          }, 100);
        } else {
          mapInstance.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
          mapInstance.current.setLevel(level);
          mapInstance.current.relayout();
          setMapReady(true);
        }
      });
    };

    if (!window.kakao) {
      const script = document.createElement('script');
      script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_MAP_KEY}&autoload=false`;
      script.async = true;
      script.onload = createOrUpdateMap;
      document.head.appendChild(script);
    } else {
      createOrUpdateMap();
    }

    // 화면 리사이즈 시 지도 크기 재조정 (반응형)
    const handleResize = () => {
      if (mapInstance.current) {
        const currentCenter = mapInstance.current.getCenter();
        mapInstance.current.relayout();
        mapInstance.current.setCenter(currentCenter);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mapInstance.current = null;
      if (container) {
        container.innerHTML = '';
      }
      setMapReady(false);
    };
  }, [lat, lng, level]);

  // 선택된 주유소 또는 내 위치로 지도 이동
  useEffect(() => {
    if (mapInstance.current) {
      let targetPos = null;
      if (selectedStation && selectedStation.lat && selectedStation.lng) {
        targetPos = new window.kakao.maps.LatLng(selectedStation.lat, selectedStation.lng);
      } else if (currentLocation && currentLocation.lat && currentLocation.lng) {
        targetPos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
      }

      if (targetPos) {
        mapInstance.current.setCenter(targetPos);
        mapInstance.current.setLevel(3);

        // 모바일 환경에서 바텀 시트 높이에 따른 중심점 조정 (마커를 위로 올림)
        if (window.innerWidth < 1280 && mobileListLevel > 0) {
          const mapHeight = mapRef.current?.offsetHeight || window.innerHeight;
          let offsetY = 0;
          if (mobileListLevel === 1) {
            // 바텀 시트가 45vh일 때: 약 22.5% 아래로 팬 (마커는 시각적으로 위로 이동)
            offsetY = mapHeight * 0.225;
          } else if (mobileListLevel === 2) {
            // 바텀 시트가 88vh일 때: 약 44% 아래로 팬
            offsetY = mapHeight * 0.44;
          }
          mapInstance.current.panBy(0, offsetY);
        }
      }
    }
  }, [selectedStation, currentLocation, mobileListLevel]);

  return (
    <div
      ref={mapRef}
      style={{ width, height }}
      {...props}
    >
      {mapReady && mapInstance.current && (
        <>
          {/* 내 위치 마커 */}
          {currentLocation && (
            <KakaoMapCurrentLocationMarker
              mapInstance={mapInstance.current}
              position={currentLocation}
            />
          )}
          {stations && stations.length > 0 && stations.map(station =>
            station.lat && station.lng ? (
              <KakaoMapMarker
                key={station.id}
                mapInstance={mapInstance.current}
                position={new window.kakao.maps.LatLng(station.lat, station.lng)}
                station={station}
                isSelected={selectedStation?.id === station.id}
                selectedFuel={selectedFuel}
                onClick={onMarkerClick}
              />
            ) : null
          )}
          {/* 경로 표시 */}
          {routeTo && routeTo.lat && routeTo.lng && (
            <KakaoMapRoute
              mapInstance={mapInstance.current}
              from={currentLocation}
              to={routeTo}
              onClose={onCloseRoute}
            />
          )}
        </>
      )}
    </div>
  );
};

export default KakaoMap;