
import { useEffect, useState } from 'react';
import Header from './Header';
import MapViewPanel from './MapViewPanel';
import StationListPanel from './StationListPanel';

import { useRef } from 'react';

const MainPageLayout = ({ stations }) => {
  const [selectedStation, setSelectedStation] = useState(null);
  const [routeTo, setRouteTo] = useState(null); 
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.5665, lng: 126.9780 }); 
  const [user, setUser] = useState(null);
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  // 내 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        err => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);
  const listPanelRef = useRef();

  // 마커 클릭 시 해당 주유소 카드로 스크롤
  const handleMarkerClick = (station) => {
    setSelectedStation(station);
    if (listPanelRef.current && station && station.id) {
      const card = listPanelRef.current.querySelector(`[data-station-id="${station.id}"]`);
      if (card) {
        card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // 길찾기 버튼 클릭 시
  const handleNavigate = (station) => {
    setRouteTo(station);
    setSelectedStation(station);
  };

  // 현재 위치 버튼 클릭 시 내 위치 새로 받아와서 지도 중심 이동
  const handleLocationClick = () => {
    setSelectedStation(null);
    setRouteTo(null);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        err => {
          alert('내 위치를 가져올 수 없습니다. 위치 권한을 확인해주세요.');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      alert('이 브라우저에서는 위치 기능을 지원하지 않습니다.');
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#f9fafb]">
      <Header onLocationClick={handleLocationClick} user={user} />
      <main className="flex-1 max-w-[1248px] mx-auto w-full p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
        <MapViewPanel stations={stations} selectedStation={selectedStation} onMarkerClick={handleMarkerClick} routeTo={routeTo} currentLocation={currentLocation} />
        <StationListPanel stations={stations} onStationClick={setSelectedStation} onNavigate={handleNavigate} ref={listPanelRef} />
      </main>
    </div>
  );
};

export default MainPageLayout;
