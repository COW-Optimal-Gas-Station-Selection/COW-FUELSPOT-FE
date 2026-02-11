import { useEffect, useRef } from 'react';
import currentLocationIcon from '../../../assets/icon/current-location.svg';

const KakaoMapCurrentLocationMarker = ({ mapInstance, position }) => {
  const markerRef = useRef();

  useEffect(() => {
    if (!mapInstance || !position) return;
    if (markerRef.current) markerRef.current.setMap(null);
    const imageSize = new window.kakao.maps.Size(70, 70);
    const imageOption = { offset: new window.kakao.maps.Point(35, 35) };
    const markerImage = new window.kakao.maps.MarkerImage(
      currentLocationIcon,
      imageSize,
      imageOption
    );

    const marker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(position.lat, position.lng),
      map: mapInstance,
      title: '내 위치',
      image: markerImage,
      zIndex: 5
    });
    markerRef.current = marker;
    return () => {
      if (markerRef.current) markerRef.current.setMap(null);
    };
  }, [mapInstance, position]);

  return null;
};

export default KakaoMapCurrentLocationMarker;
