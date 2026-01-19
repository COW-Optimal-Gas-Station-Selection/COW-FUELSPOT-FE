import { useEffect, useRef } from 'react';

const KakaoMapMarkerLabel = ({ position, mapInstance, name }) => {
  const overlayRef = useRef();

  useEffect(() => {
    if (!mapInstance || !position) return;
    const overlay = new window.kakao.maps.CustomOverlay({
      position,
      content: `<div style="pointer-events:none;padding:2px 8px;background:#fff;border-radius:6px;border:1px solid #155dfc;font-size:13px;color:#155dfc;font-weight:600;box-shadow:0 2px 6px #0001;white-space:nowrap;transform:translateY(-100%);">${name}</div>`,
      yAnchor: 1.2,
      zIndex: 2,
      clickable: false
    });
    overlay.setMap(mapInstance);
    overlayRef.current = overlay;
    return () => {
      if (overlayRef.current) overlayRef.current.setMap(null);
    };
  }, [mapInstance, position, name]);

  return null;
};

export default KakaoMapMarkerLabel;
