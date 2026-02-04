import { useEffect, useState } from 'react';
import { getDirections } from '../../../api/stationService';

const KakaoMapRoute = ({ mapInstance, from, to }) => {
  const [path, setPath] = useState([]);

  useEffect(() => {
    if (!mapInstance || !from || !to) return;

    const fetchRoute = async () => {
      try {
        const origin = `${from.getLng()},${from.getLat()}`;
        const destination = `${to.getLng()},${to.getLat()}`;
        const data = await getDirections(origin, destination);
        console.log('Route data received:', data);

        const newPath = [];
        if (data && data.routes && Array.isArray(data.routes) && data.routes.length > 0) {
          const route = data.routes[0];
          if (route.sections && Array.isArray(route.sections)) {
            route.sections.forEach(section => {
              if (section.roads && Array.isArray(section.roads)) {
                section.roads.forEach(road => {
                  const vertexes = road.vertexes;
                  if (vertexes && Array.isArray(vertexes)) {
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
        } else {
          console.warn('No path found in directions response, using straight line');
          setPath([from, to]);
        }
      } catch (error) {
        console.error('Failed to fetch route:', error);
        setPath([from, to]);
      }
    };

    fetchRoute();
  }, [from, to]);

  useEffect(() => {
    if (!mapInstance || path.length === 0) return;

    const polyline = new window.kakao.maps.Polyline({
      map: mapInstance,
      path: path,
      strokeWeight: 5,
      strokeColor: '#155dfc',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    // 경로에 맞춰 지도 범위 확장
    const bounds = new window.kakao.maps.LatLngBounds();
    path.forEach(pos => bounds.extend(pos));
    mapInstance.setBounds(bounds);

    return () => {
      polyline.setMap(null);
    };
  }, [mapInstance, path]);

  return null;
};

export default KakaoMapRoute;
