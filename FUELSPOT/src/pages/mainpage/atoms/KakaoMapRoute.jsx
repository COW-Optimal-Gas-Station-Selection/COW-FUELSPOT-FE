import { useEffect, useRef, useState } from 'react';
import { getDirections } from '../../../api/stationService';

const KakaoMapRoute = ({ mapInstance, from, to, onClose }) => {
  const [path, setPath] = useState([]);
  const polylineRef = useRef(null);
  const overlayRef = useRef(null);

  // 실제 위경도 값이 변할 때만 경로를 가져오도록 의존성 설정
  const fromLat = from?.lat;
  const fromLng = from?.lng;
  const toLat = to?.lat;
  const toLng = to?.lng;

  useEffect(() => {
    if (!mapInstance || !fromLat || !fromLng || !toLat || !toLng) return;

    const fetchRoute = async () => {
      try {
        const origin = `${fromLng},${fromLat}`;
        const destination = `${toLng},${toLat}`;

        const data = await getDirections(origin, destination);

        const newPath = [];
        let distance = 0;
        let duration = 0;

        if (data && data.routes && data.routes.length > 0) {
          const route = data.routes[0];

          if (route.summary) {
            distance = route.summary.distance || 0;
            duration = route.summary.duration || 0;
          }

          if (route.sections) {
            route.sections.forEach(section => {
              if (section.roads) {
                section.roads.forEach(road => {
                  const vertexes = road.vertexes;
                  if (vertexes) {
                    for (let i = 0; i < vertexes.length; i += 2) {
                      newPath.push(new window.kakao.maps.LatLng(vertexes[i + 1], vertexes[i]));
                    }
                  }
                });
              }
            });
          }
        }

        if (newPath.length > 0) {
          setPath(newPath);

          // 기존 오버레이 제거
          if (overlayRef.current) {
            overlayRef.current.setMap(null);
          }

          const distanceKm = (distance / 1000).toFixed(1);
          const durationMin = Math.ceil(duration / 60);

          // 오버레이 컨텐츠 생성 (DOM 엘리먼트 방식 - 이벤트 리스너 부착 가능)
          const content = document.createElement('div');
          content.style.padding = '16px 24px';
          content.style.background = 'white';
          content.style.borderRadius = '16px';
          content.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
          content.style.border = '1px solid #e2e8f0';
          content.style.display = 'flex';
          content.style.flexDirection = 'column';
          content.style.alignItems = 'center';
          content.style.gap = '4px';
          content.style.minWidth = '180px';
          content.style.position = 'relative';

          // 닫기 버튼
          const closeBtn = document.createElement('button');
          closeBtn.innerHTML = '<svg style="width: 20px; height: 20px;" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>';
          closeBtn.style.position = 'absolute';
          closeBtn.style.top = '8px';
          closeBtn.style.right = '8px';
          closeBtn.style.color = '#94a3b8';
          closeBtn.style.background = 'none';
          closeBtn.style.border = 'none';
          closeBtn.style.padding = '4px';
          closeBtn.style.cursor = 'pointer';
          closeBtn.style.borderRadius = '50%';
          closeBtn.onmouseover = () => { closeBtn.style.background = '#f1f5f9'; };
          closeBtn.onmouseout = () => { closeBtn.style.background = 'none'; };
          closeBtn.onclick = (e) => {
            e.stopPropagation();
            if (onClose) onClose();
          };
          content.appendChild(closeBtn);

          // 소요 시간
          const timeDiv = document.createElement('div');
          timeDiv.style.fontSize = '20px';
          timeDiv.style.fontWeight = '800';
          timeDiv.style.color = '#1e293b';
          timeDiv.style.marginTop = '4px';
          timeDiv.innerHTML = `<span style="color: #2563eb;">${durationMin}분</span> 소요`;
          content.appendChild(timeDiv);

          // 거리
          const distDiv = document.createElement('div');
          distDiv.style.fontSize = '14px';
          distDiv.style.fontWeight = '600';
          distDiv.style.color = '#64748b';
          distDiv.innerText = `총 거리 ${distanceKm}km`;
          content.appendChild(distDiv);

          const overlay = new window.kakao.maps.CustomOverlay({
            content: content,
            position: new window.kakao.maps.LatLng(toLat, toLng),
            yAnchor: 1.4,
            zIndex: 500
          });

          overlay.setMap(mapInstance);
          overlayRef.current = overlay;

        } else {
          setPath([
            new window.kakao.maps.LatLng(fromLat, fromLng),
            new window.kakao.maps.LatLng(toLat, toLng)
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch route:', error);
      }
    };

    fetchRoute();

    return () => {
      if (overlayRef.current) {
        overlayRef.current.setMap(null);
        overlayRef.current = null;
      }
    };
  }, [mapInstance, fromLat, fromLng, toLat, toLng, onClose]);

  useEffect(() => {
    if (!mapInstance || path.length === 0) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
    }

    const solidPolyline = new window.kakao.maps.Polyline({
      map: mapInstance,
      path: path,
      strokeWeight: 5,
      strokeColor: '#155dfc',
      strokeOpacity: 1,
      strokeStyle: 'solid',
    });
    polylineRef.current = solidPolyline;

    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(pos => bounds.extend(pos));
    mapInstance.setBounds(bounds);

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [mapInstance, path]);

  return null;
};

export default KakaoMapRoute;
