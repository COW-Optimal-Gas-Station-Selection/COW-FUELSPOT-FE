import { useEffect, useRef } from 'react';


const KakaoMapMarker = ({ mapInstance, position, station, onClick }) => {
  const markerRef = useRef();
  const clickOverlayRef = useRef();

  useEffect(() => {
    if (!mapInstance || !position) return;

    // 마커 생성
    const marker = new window.kakao.maps.Marker({
      position,
      map: mapInstance,
      title: station.name,
    });
    markerRef.current = marker;

    // 클릭 영역 확장용 커스텀 오버레이 (투명 원) 범위는 고민 해봐야 할 듯
    let clickOverlay = null;
    if (onClick) {
      const clickDiv = document.createElement('div');
      clickDiv.style.width = '56px';
      clickDiv.style.height = '56px';
      clickDiv.style.position = 'absolute';
      clickDiv.style.left = '-28px';
      clickDiv.style.top = '-70px';
      clickDiv.style.borderRadius = '50%';
      clickDiv.style.background = 'rgba(0,0,0,0)';
      clickDiv.style.cursor = 'pointer';
      clickDiv.style.zIndex = '10';
      clickDiv.addEventListener('click', e => {
        e.stopPropagation();
        onClick(station);
      });
      clickOverlay = new window.kakao.maps.CustomOverlay({
        position,
        content: clickDiv,
        yAnchor: 0.5,
        zIndex: 10,
        clickable: true
      });
      clickOverlay.setMap(mapInstance);
      clickOverlayRef.current = clickOverlay;
    }

    // 마커 자체 클릭 이벤트
    if (onClick) {
      window.kakao.maps.event.addListener(marker, 'click', () => {
        onClick(station);
      });
    }


    return () => {
      marker.setMap(null);
      if (clickOverlay) clickOverlay.setMap(null);
    };
  }, [mapInstance, position, station, onClick]);

  return null;
};

export default KakaoMapMarker;
