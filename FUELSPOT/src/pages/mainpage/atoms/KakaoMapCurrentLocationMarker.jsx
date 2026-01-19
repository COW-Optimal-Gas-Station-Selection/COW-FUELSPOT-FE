import { useEffect, useRef } from 'react';

const KakaoMapCurrentLocationMarker = ({ mapInstance, position }) => {
  const markerRef = useRef();

  useEffect(() => {
    if (!mapInstance || !position) return;
    if (markerRef.current) markerRef.current.setMap(null);
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(position.lat, position.lng),
      map: mapInstance,
      title: '내 위치'
    });
    markerRef.current = marker;
    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
    };
  }, [mapInstance, position]);

  return null;
};

export default KakaoMapCurrentLocationMarker;
