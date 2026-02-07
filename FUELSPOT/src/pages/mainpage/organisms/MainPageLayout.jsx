
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
  const [priceDrawerOpen, setPriceDrawerOpen] = useState(false);
  const [mobileDrawerTab, setMobileDrawerTab] = useState(null); // null(아무것도 안 열림) | 'average' | 'calc' | 'qa'
  const [closing, setClosing] = useState(false);
  const [closingTab, setClosingTab] = useState(null);
  const [contentExpanded, setContentExpanded] = useState(false);
  const drawerRef = useRef(null);
  const contentWrapRef = useRef(null);

  const effectiveTab = closing ? closingTab : mobileDrawerTab;

  // 드로어 열릴 때마다 메뉴 선택 초기화
  useEffect(() => {
    if (priceDrawerOpen) setMobileDrawerTab(null);
  }, [priceDrawerOpen]);

  // 촤라락 열림: 탭 선택 시 contentExpanded 켜기
  useEffect(() => {
    if (effectiveTab && !closing) {
      setContentExpanded(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setContentExpanded(true));
      });
      return () => cancelAnimationFrame(id);
    } else {
      setContentExpanded(false);
    }
  }, [effectiveTab, closing]);

  const handleCloseTab = () => {
    setClosingTab(mobileDrawerTab);
    setClosing(true);
  };

  const handleContentTransitionEnd = (e) => {
    if (e.target !== contentWrapRef.current || e.propertyName !== 'grid-template-rows') return;
    if (closing) {
      setMobileDrawerTab(null);
      setClosingTab(null);
      setClosing(false);
      setContentExpanded(false);
    }
  };

  const touchStartX = useRef(0);

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

  const handleDrawerTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleDrawerTouchMove = (e) => {
    const x = e.touches[0].clientX;
    const delta = x - touchStartX.current;
    if (priceDrawerOpen && delta > 50) setPriceDrawerOpen(false);
  };
  const handleDrawerTouchEnd = () => {};
  const handleEdgeDragStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };
  const handleEdgeDragMove = (e) => {
    const x = e.touches ? e.touches[0].clientX : e.clientX;
    if (touchStartX.current - x > 50) setPriceDrawerOpen(true);
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
      {/* 모바일: 유가 패널 열기/닫기 탭 - 오른쪽(닫힐 땐 화면 오른쪽, 열릴 땐 드로어 왼쪽 가장자리) */}
      <div
        className="xl:hidden fixed top-1/2 -translate-y-1/2 z-[60] flex items-center transition-[right] duration-300 ease-out"
        style={{ right: priceDrawerOpen ? 'min(280px, 85vw)' : 0 }}
        onTouchStart={handleEdgeDragStart}
        onTouchMove={handleEdgeDragMove}
      >
        <button
          type="button"
          onClick={() => setPriceDrawerOpen((prev) => !prev)}
          className={`flex items-center justify-center w-8 h-24 md:h-28 backdrop-blur-sm border border-gray-200/60 shadow-md transition-colors cursor-pointer ${priceDrawerOpen ? 'rounded-l-xl border-r-0 bg-white/50 hover:bg-white/60' : 'rounded-r-none rounded-l-2xl border-r-0 bg-white/40 hover:bg-white/55 active:bg-white/50'}`}
          aria-label={priceDrawerOpen ? '유가 정보 닫기' : '유가 정보 열기'}
        >
          <svg className={`w-5 h-5 text-gray-600 transition-transform ${priceDrawerOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
      {/* 모바일: 유가 드로어 오버레이 */}
      {priceDrawerOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={() => setPriceDrawerOpen(false)}
          onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => { if (e.changedTouches[0].clientX > touchStartX.current + 50) setPriceDrawerOpen(false); }}
          aria-hidden
        />
      )}
      {/* 모바일: 사이드바 (평균유가 / 유류비계산 / Q&A) - 디폴트는 메뉴만, 선택 시 콘텐츠 */}
      <aside
        ref={drawerRef}
        className="xl:hidden fixed right-0 top-0 bottom-0 w-[min(280px,85vw)] bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ease-out overflow-hidden"
        style={{ transform: priceDrawerOpen ? 'translateX(0)' : 'translateX(100%)' }}
        onTouchStart={handleDrawerTouchStart}
        onTouchMove={handleDrawerTouchMove}
        onTouchEnd={handleDrawerTouchEnd}
      >
        {/* 디폴트: 세 메뉴만 표시, 아무것도 열리지 않음 */}
        {mobileDrawerTab === null && !closing && (
          <nav className="flex flex-col flex-1 min-h-0 py-2">
            <button type="button" onClick={() => setMobileDrawerTab('average')} className="w-full px-4 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 border-l-4 border-transparent">평균 유가</button>
            <button type="button" onClick={() => setMobileDrawerTab('calc')} className="w-full px-4 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 border-l-4 border-transparent">유류비계산</button>
            <button type="button" onClick={() => setMobileDrawerTab('qa')} className="w-full px-4 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 border-l-4 border-transparent">Q&A</button>
          </nav>
        )}
        {effectiveTab === 'average' && (
          <div key="average" className="flex flex-col flex-1 min-h-0">
            <nav className="shrink-0 border-b border-gray-100">
              <button type="button" onClick={handleCloseTab} className="w-full px-4 py-4 text-left text-base font-bold text-blue-900 bg-blue-50/50 border-l-4 border-blue-600">평균 유가</button>
            </nav>
            <div ref={contentWrapRef} onTransitionEnd={handleContentTransitionEnd} className="flex-1 min-h-0 grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: closing ? '0fr' : contentExpanded ? '1fr' : '0fr' }}>
              <div className="min-h-0 overflow-hidden">
                <div className="overflow-y-auto overflow-x-hidden p-4 h-full [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full">
                  <AveragePricePanel initialSido={detectedSido} />
                </div>
              </div>
            </div>
            <nav className="shrink-0 border-t border-gray-100">
              <button type="button" onClick={() => setMobileDrawerTab('calc')} className="w-full px-4 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 border-l-4 border-transparent">유류비계산</button>
              <button type="button" onClick={() => setMobileDrawerTab('qa')} className="w-full px-4 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 border-l-4 border-transparent">Q&A</button>
            </nav>
          </div>
        )}
        {effectiveTab === 'calc' && (
          <div key="calc" className="flex flex-col flex-1 min-h-0">
            <nav className="shrink-0 border-b border-gray-100">
              <button type="button" onClick={() => setMobileDrawerTab('average')} className="w-full px-4 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 border-l-4 border-transparent">평균 유가</button>
              <button type="button" onClick={handleCloseTab} className="w-full px-4 py-4 text-left text-base font-bold text-blue-900 bg-blue-50/50 border-l-4 border-blue-600">유류비계산</button>
            </nav>
            <div ref={contentWrapRef} onTransitionEnd={handleContentTransitionEnd} className="flex-1 min-h-0 grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: closing ? '0fr' : contentExpanded ? '1fr' : '0fr' }}>
              <div className="min-h-0 overflow-hidden">
                <div className="bg-white flex items-center justify-center p-6 h-full min-h-[120px]">
                  <p className="text-gray-500 text-base font-medium">준비중입니다!</p>
                </div>
              </div>
            </div>
            <nav className="shrink-0 border-t border-gray-100">
              <button type="button" onClick={() => setMobileDrawerTab('qa')} className="w-full px-4 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 border-l-4 border-transparent">Q&A</button>
            </nav>
          </div>
        )}
        {effectiveTab === 'qa' && (
          <div key="qa" className="flex flex-col flex-1 min-h-0">
            <nav className="shrink-0 border-b border-gray-100">
              <button type="button" onClick={() => setMobileDrawerTab('average')} className="w-full px-4 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 border-l-4 border-transparent">평균 유가</button>
              <button type="button" onClick={() => setMobileDrawerTab('calc')} className="w-full px-4 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 border-l-4 border-transparent">유류비계산</button>
              <button type="button" onClick={handleCloseTab} className="w-full px-4 py-4 text-left text-base font-bold text-blue-900 bg-blue-50/50 border-l-4 border-blue-600">Q&A</button>
            </nav>
            <div ref={contentWrapRef} onTransitionEnd={handleContentTransitionEnd} className="flex-1 min-h-0 grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: closing ? '0fr' : contentExpanded ? '1fr' : '0fr' }}>
              <div className="min-h-0 overflow-hidden">
                <div className="bg-white flex items-center justify-center p-6 h-full min-h-[120px]">
                  <p className="text-gray-500 text-base font-medium">준비중입니다!</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
      <div className="flex-1 flex flex-row w-full max-w-[1550px] mx-auto min-h-0 overflow-y-auto overflow-x-hidden lg:overflow-hidden">
        <aside className="hidden xl:block w-[280px] p-6 pr-0 overflow-y-auto shrink-0">
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
