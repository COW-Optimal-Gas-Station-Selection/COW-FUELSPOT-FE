import React, { useEffect, useRef, useState } from 'react';
import KakaoMapCurrentLocationMarker from '../atoms/KakaoMapCurrentLocationMarker';
import KakaoMapMarker from '../atoms/KakaoMapMarker';
import KakaoMapMarkerLabel from '../atoms/KakaoMapMarkerLabel';
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
  currentLocation = { lat: 37.5665, lng: 126.9780 },
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
        mapInstance.current.relayout();
        mapInstance.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
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
      if (selectedStation && selectedStation.lat && selectedStation.lng) {
        const pos = new window.kakao.maps.LatLng(selectedStation.lat, selectedStation.lng);
        mapInstance.current.setCenter(pos);
        mapInstance.current.setLevel(3);
      } else if (currentLocation && currentLocation.lat && currentLocation.lng) {
        const pos = new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng);
        mapInstance.current.setCenter(pos);
        mapInstance.current.setLevel(3);
      }
    }
  }, [selectedStation, currentLocation]);

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
          {/* 주유소 마커 */}
          {stations && stations.length > 0 && stations.map(
            station =>
              station.lat && station.lng ? (
                <React.Fragment key={station.id}>
                  <KakaoMapMarker
                    mapInstance={mapInstance.current}
                    position={new window.kakao.maps.LatLng(station.lat, station.lng)}
                    station={station}
                    onClick={onMarkerClick}
                  />
                  <KakaoMapMarkerLabel
                    mapInstance={mapInstance.current}
                    position={new window.kakao.maps.LatLng(station.lat, station.lng)}
                    name={station.name}
                  />
                </React.Fragment>
              ) : null
          )}
          {/* 경로 표시 */}
          {routeTo && routeTo.lat && routeTo.lng && (
            <KakaoMapRoute
              mapInstance={mapInstance.current}
              from={new window.kakao.maps.LatLng(currentLocation.lat, currentLocation.lng)}
              to={new window.kakao.maps.LatLng(routeTo.lat, routeTo.lng)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default KakaoMap;