import { useEffect, useRef } from 'react';

const KakaoMapCurrentLocationMarker = ({ mapInstance, position }) => {
  const markerRef = useRef();

  useEffect(() => {
    if (!mapInstance || !position) return;
    if (markerRef.current) markerRef.current.setMap(null);
    // Create a custom marker with SVG
    const svgString = encodeURIComponent(
      `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="32" cy="32" r="22" fill="#2563eb" fill-opacity="0.2"/><circle cx="32" cy="32" r="12" fill="#2563eb"/><circle cx="32" cy="32" r="5" fill="#fff"/></svg>`
    );
    const markerImage = new window.kakao.maps.MarkerImage(
      `data:image/svg+xml;charset=UTF-8,${svgString}`,
      new window.kakao.maps.Size(64, 64),
      { offset: new window.kakao.maps.Point(32, 32) }
    );
    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(position.lat, position.lng),
      map: mapInstance,
      title: '내 위치',
      image: markerImage
    });
    markerRef.current = marker;
    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
    };
  }, [mapInstance, position]);

  return null;
};

export default KakaoMapCurrentLocationMarker;
