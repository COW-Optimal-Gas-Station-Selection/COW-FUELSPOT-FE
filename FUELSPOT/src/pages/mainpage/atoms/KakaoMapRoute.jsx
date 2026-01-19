const KakaoMapRoute = ({ mapInstance, from, to }) => {
  useEffect(() => {
    if (!mapInstance || !from || !to) return;
    const polyline = new window.kakao.maps.Polyline({
      map: mapInstance,
      path: [from, to],
      strokeWeight: 5,
      strokeColor: '#155dfc',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });
    return () => {
      polyline.setMap(null);
    };
  }, [mapInstance, from, to]);
  return null;
};

export default KakaoMapRoute;
