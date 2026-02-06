
import { useEffect, useRef, useState } from 'react';
import { getAddressFromCoords, getNearbyStations, searchPlaces } from '../../../api/stationService';
import { FUEL_TYPE } from '../../../components/FuelPriceBox';
import AveragePricePanel from './AveragePricePanel';
import Header from './Header';
import MapViewPanel from './MapViewPanel';
import StationListPanel from './StationListPanel';

const MainPageLayout = () => {
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [routeTo, setRouteTo] = useState(null); 
  const [currentLocation, setCurrentLocation] = useState({ lat: 37.5665, lng: 126.9780 });
  const [user, setUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState('gasoline');
  const [sortType, setSortType] = useState('optimal');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [detectedSido, setDetectedSido] = useState(null);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!currentLocation) return;
      try {
        const address = await getAddressFromCoords(currentLocation.lat, currentLocation.lng);
        if (address) {
          if (address.includes('서울')) setDetectedSido('SEOUL');
          else if (address.includes('경기')) setDetectedSido('GYEONGGI');
          else if (address.includes('인천')) setDetectedSido('GYEONGGI');
          else if (address.includes('강원')) setDetectedSido('GANGWON');
          else if (address.includes('충북') || address.includes('충청북도')) setDetectedSido('CHUNGBUK');
          else if (address.includes('충남') || address.includes('충청남도')) setDetectedSido('CHUNGNAM');
          else if (address.includes('세종')) setDetectedSido('CHUNGNAM');
          else if (address.includes('대전')) setDetectedSido('CHUNGNAM');
          else if (address.includes('전북') || address.includes('전라북도')) setDetectedSido('JEONBUK');
          else if (address.includes('전남') || address.includes('전라남도')) setDetectedSido('JEONNAM');
          else if (address.includes('광주')) setDetectedSido('JEONNAM');
          else if (address.includes('경북') || address.includes('경상북도')) setDetectedSido('GYEONGBUK');
          else if (address.includes('대구')) setDetectedSido('GYEONGBUK');
          else if (address.includes('경남') || address.includes('경상남도')) setDetectedSido('GYEONGNAM');
          else if (address.includes('울산')) setDetectedSido('GYEONGNAM');
          else if (address.includes('부산')) setDetectedSido('BUSAN');
          else if (address.includes('제주')) setDetectedSido('JEJU');
        }
      } catch (error) {
        console.error('Failed to detect Sido from location:', error);
      }
    };
    fetchAddress();
  }, [currentLocation]);

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
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentLocation(newLoc);
        },
        err => {
          console.error('Geolocation error:', err);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, []);

  // 주유소 목록 가져오기
  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const radius = (user?.radius || 3) * 1000; // km to m
        const params = {
          lon: currentLocation.lng,
          lat: currentLocation.lat,
          radius: radius
        };
        
        const data = await getNearbyStations(params);
        
        // 백엔드 데이터를 프론트엔드 형식으로 변환
        const mappedStations = data.map(s => ({
          id: String(s.id),
          name: s.name,
          brand: s.brand,
          address: s.address, 
          tel: s.tel,
          isCarWash: s.isCarWash,
          tradeDate: s.tradeDate,
          tradeTime: s.tradeTime,
          distance: `${(s.distance / 1000).toFixed(1)}km`,
          lat: parseFloat(s.lat),
          lng: parseFloat(s.lon),
          prices: [
            { type: FUEL_TYPE.GASOLINE, price: s.prices?.GASOLINE || 0 },
            { type: FUEL_TYPE.DIESEL, price: s.prices?.DIESEL || 0 },
            { type: FUEL_TYPE.PREMIUM, price: s.prices?.PREMIUM_GASOLINE || 0 },
            { type: FUEL_TYPE.LPG, price: s.prices?.LPG || 0 }
          ].filter(p => p.price > 0)
        }));
        
        setStations(mappedStations);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStations();
  }, [currentLocation, user?.radius, refreshTrigger]);

  const listPanelRef = useRef();

  // 자동완성 검색 (Debounce)
  useEffect(() => {
    if (!isTyping) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const keyword = searchKeyword.trim();
      if (keyword.length > 0) {
        try {
          const data = await searchPlaces(keyword);
          if (data && data.documents) {
            setSuggestions(data.documents);
          }
        } catch (error) {
          console.error('Autocomplete failed:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchKeyword, isTyping]);

  // 검색 결과 선택 시
  const handleSuggestionClick = (place) => {
    setIsTyping(false);
    const newLoc = { lat: Number(place.y), lng: Number(place.x) };
    setCurrentLocation(newLoc);
    setSearchKeyword(place.place_name);
    setSuggestions([]);
    
    setSelectedStation(null);
    setRouteTo(null);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setIsTyping(true);
  };

  const handleSearchSubmit = async () => {
    if (!searchKeyword.trim()) return;
    try {
      const data = await searchPlaces(searchKeyword);
      if (data && data.documents && data.documents.length > 0) {
        handleSuggestionClick(data.documents[0]);
      }
    } catch (error) {
      console.error('Manual search failed:', error);
    }
  };

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

  const handleStationClick = (station) => {
    setSelectedStation(station);
  };

  // 길찾기 버튼 클릭 시
  const handleNavigate = (station) => {
    setRouteTo(station);
    setSelectedStation(station);
  };

  // 현재 위치 버튼 클릭 시 내 위치 새로 받아와서 지도 중심 이동 및 주변 주유소 검색
  const handleLocationClick = () => {
    setSelectedStation(null);
    setRouteTo(null);
    setSearchKeyword(''); 
    setSuggestions([]);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setCurrentLocation(newLoc);
          setRefreshTrigger(prev => prev + 1);
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
    <div className="flex flex-col h-screen bg-[#f9fafb] overflow-hidden">
      <Header user={user} />
      <div className="flex-1 flex flex-row w-full max-w-[1550px] mx-auto min-h-0 overflow-y-auto overflow-x-hidden lg:overflow-hidden">
        <aside className="hidden xl:block w-[280px] p-6 pr-0 overflow-y-auto flex-shrink-0">
          <AveragePricePanel initialSido={detectedSido} />
        </aside>
        <main className="flex-1 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 relative min-h-0 overflow-visible">
          <MapViewPanel 
            stations={stations} 
            selectedStation={selectedStation} 
            onMarkerClick={handleMarkerClick} 
            routeTo={routeTo} 
            currentLocation={currentLocation}
            onLocationClick={handleLocationClick}
            searchKeyword={searchKeyword}
            onSearchChange={handleSearchChange}
            suggestions={suggestions}
            onSuggestionClick={handleSuggestionClick}
          />
          <div className="min-h-[600px] lg:min-h-0 lg:h-full">
            <StationListPanel 
              stations={stations} 
              selectedStationId={selectedStation?.id}
              onStationClick={handleStationClick} 
              onNavigate={handleNavigate} 
              ref={listPanelRef} 
            />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainPageLayout;
