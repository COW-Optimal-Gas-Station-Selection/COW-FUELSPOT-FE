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

        const newPath = [];
        data.sections.forEach(section => {
          section.roads.forEach(road => {
            const vertexes = road.vertexes;
            for (let i = 0; i < vertexes.length; i += 2) {
              newPath.push(new window.kakao.maps.LatLng(vertexes[i + 1], vertexes[i]));
            }
          });
        });
        setPath(newPath);
      } catch (error) {
        console.error('Failed to fetch route:', error);
        // Fallback to straight line
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
