
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../api/memberService';
import { addSearchLog, deleteAllKeywords, deleteKeyword, getRecentKeywords } from '../../../api/searchService';
import { getAddressFromCoords, getNearbyStations, searchPlaces } from '../../../api/stationService';
import FuelspotLogo from '../../../components/FuelspotLogo';
import FindPasswordModal from '../../login/organisms/FindPasswordModal';
import AveragePricePanel from './AveragePricePanel';
import Header from './Header';
import LoginModal from './LoginModal';
import MapViewPanel from './MapViewPanel';
import SignupModal from './SignupModal';
import StationListPanel from './StationListPanel';

const MainPageLayout = () => {
  const navigate = useNavigate();
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStation, setSelectedStation] = useState(null);
  const [routeTo, setRouteTo] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [user, setUser] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentKeywords, setRecentKeywords] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState('gasoline');
  const [sortType, setSortType] = useState('optimal');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [detectedSido, setDetectedSido] = useState(null);
  const [priceDrawerOpen, setPriceDrawerOpen] = useState(false);
  const [mobileDrawerTab, setMobileDrawerTab] = useState(null); // null | 'average' | 'calc' | 'qa'
  const [contentExpanded, setContentExpanded] = useState(false);
  const [mobileListLevel, setMobileListLevel] = useState(1); // 0: 최소화, 1: 중간, 2: 전체
  const [isStationListOpen, setIsStationListOpen] = useState(false); // 기존 상태 유지용 (필요시 제거 가능)
  const listScrollRef = useRef(null);
  const lastScrollTop = useRef(0);
  const sheetTouchStartY = useRef(0);
  const isDraggingSheet = useRef(false);

  // 모달 상태
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
  const [isFindPasswordModalOpen, setIsFindPasswordModalOpen] = useState(false);

  const drawerRef = useRef(null);
  const contentWrapRef = useRef(null);

  const effectiveTab = mobileDrawerTab;

  // 드로어 열릴 때마다 메뉴 선택 초기화
  useEffect(() => {
    if (priceDrawerOpen) setMobileDrawerTab(null);
  }, [priceDrawerOpen]);

  // 탭 선택 시 확장 효과 (필요시)
  useEffect(() => {
    if (effectiveTab) {
      setContentExpanded(false);
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => setContentExpanded(true));
      });
      return () => cancelAnimationFrame(id);
    } else {
      setContentExpanded(false);
    }
  }, [effectiveTab]);

  const handleCloseTab = () => {
    setMobileDrawerTab(null);
    setContentExpanded(false);
  };

  // 모바일 목록 스크롤 핸들러
  const handleListScroll = (e) => {
    const st = e.target.scrollTop;
    lastScrollTop.current = st <= 0 ? 0 : st;
  };

  const handlePointerDown = (e) => {
    sheetTouchStartY.current = e.clientY;
    isDraggingSheet.current = false;
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (sheetTouchStartY.current === 0) return;
    const diff = Math.abs(e.clientY - sheetTouchStartY.current);
    if (diff > 5) {
      isDraggingSheet.current = true;
    }
  };

  const handlePointerUp = (e) => {
    if (sheetTouchStartY.current === 0) return;

    const deltaY = e.clientY - sheetTouchStartY.current;

    if (isDraggingSheet.current) {
      if (deltaY < -50) {
        // 위로 드래그
        setMobileListLevel(prev => Math.min(prev + 1, 2));
      } else if (deltaY > 50) {
        // 아래로 드래그
        setMobileListLevel(prev => Math.max(prev - 1, 0));
      }
    }

    sheetTouchStartY.current = 0;
    setTimeout(() => {
      isDraggingSheet.current = false;
    }, 100);
  };

  const handleSheetClick = (e) => {
    if (isDraggingSheet.current) return;
    // 클릭 시 순환: 0 -> 1 -> 2 -> 1
    if (mobileListLevel === 0) setMobileListLevel(1);
    else if (mobileListLevel === 1) setMobileListLevel(2);
    else setMobileListLevel(1);
  };

  const touchStartX = useRef(0);

  useEffect(() => {
    const fetchAddress = async () => {
      if (!currentLocation) return;
      try {
        const address = await getAddressFromCoords(currentLocation.lat, currentLocation.lng);
        if (address) {
          if (address.includes('서울')) setDetectedSido('SEOUL');
          else if (address.includes('인천')) setDetectedSido('INCHEON');
          else if (address.includes('대전')) setDetectedSido('DAEJEON');
          else if (address.includes('광주')) setDetectedSido('GWANGJU');
          else if (address.includes('대구')) setDetectedSido('DAEGU');
          else if (address.includes('울산')) setDetectedSido('ULSAN');
          else if (address.includes('세종')) setDetectedSido('SEJONG');
          else if (address.includes('경기')) setDetectedSido('GYEONGGI');
          else if (address.includes('강원')) setDetectedSido('GANGWON');
          else if (address.includes('충북') || address.includes('충청북도')) setDetectedSido('CHUNGBUK');
          else if (address.includes('충남') || address.includes('충청남도')) setDetectedSido('CHUNGNAM');
          else if (address.includes('전북') || address.includes('전라북도')) setDetectedSido('JEONBUK');
          else if (address.includes('전남') || address.includes('전라남도')) setDetectedSido('JEONNAM');
          else if (address.includes('경북') || address.includes('경상북도')) setDetectedSido('GYEONGBUK');
          else if (address.includes('경남') || address.includes('경상남도')) setDetectedSido('GYEONGNAM');
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
        const parsedUser = JSON.parse(userStr);
        setUser(parsedUser);

        // 선호 유종에 맞춰 초기 정렬 및 지도 표시 유종 설정
        if (parsedUser.fuelType) {
          const fuelTypeMap = {
            'GASOLINE': 'gasoline',
            'DIESEL': 'diesel',
            'PREMIUM_GASOLINE': 'premium',
            'LPG': 'lpg',
            'KEROSENE': 'kerosene'
          };
          const fuel = fuelTypeMap[parsedUser.fuelType] || 'gasoline';
          setSelectedFuel(fuel);
          setSortType(fuel);
        }
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
    fetchRecentKeywords();
  }, []);

  const fetchRecentKeywords = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        const data = await getRecentKeywords();
        setRecentKeywords(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch recent keywords:', error);
      }
    } else {
      const local = JSON.parse(localStorage.getItem('recentKeywords') || '[]');
      setRecentKeywords(local);
    }
  };

  const saveSearchKeyword = (keyword) => {
    if (!keyword || !keyword.trim()) return;
    const token = localStorage.getItem('accessToken');
    if (!token) {
      const local = JSON.parse(localStorage.getItem('recentKeywords') || '[]');
      const filtered = local.filter(k => k !== keyword);
      const updated = [keyword, ...filtered].slice(0, 10);
      localStorage.setItem('recentKeywords', JSON.stringify(updated));
      setRecentKeywords(updated);
    } else {
      // 로그인 상태일 때 수동으로 서버에 저장 API 호출
      addSearchLog(keyword).catch(err => console.error('Failed to save search log on server:', err));
    }
  };

  const handleDeleteRecentKeyword = async (keyword) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await deleteKeyword(keyword);
        setRecentKeywords(prev => prev.filter(k => k !== keyword));
      } catch (error) {
        console.error('Failed to delete keyword:', error);
      }
    } else {
      const local = JSON.parse(localStorage.getItem('recentKeywords') || '[]');
      const updated = local.filter(k => k !== keyword);
      localStorage.setItem('recentKeywords', JSON.stringify(updated));
      setRecentKeywords(updated);
    }
  };

  const handleDeleteAllRecentKeywords = async () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      try {
        await deleteAllKeywords();
        setRecentKeywords([]);
      } catch (error) {
        console.error('Failed to delete all keywords:', error);
      }
    } else {
      localStorage.removeItem('recentKeywords');
      setRecentKeywords([]);
    }
  };

  // 로그인 모달 핸들러
  const openLoginModal = () => {
    setIsSignupModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => setIsLoginModalOpen(false);

  // 회원가입 모달 핸들러
  const openSignupModal = () => {
    setIsLoginModalOpen(false);
    setIsSignupModalOpen(true);
  };

  const closeSignupModal = () => setIsSignupModalOpen(false);

  // 비밀번호 찾기 모달 핸들러
  const openFindPasswordModal = () => {
    setIsLoginModalOpen(false);
    setIsFindPasswordModalOpen(true);
  };

  const closeFindPasswordModal = () => setIsFindPasswordModalOpen(false);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsLoginModalOpen(false);

    // 선호 유종에 맞춰 초기 정렬 및 지도 표시 유종 설정
    if (userData.fuelType) {
      const fuelTypeMap = {
        'GASOLINE': 'gasoline',
        'DIESEL': 'diesel',
        'PREMIUM_GASOLINE': 'premium',
        'LPG': 'lpg',
        'KEROSENE': 'kerosene'
      };
      const fuel = fuelTypeMap[userData.fuelType] || 'gasoline';
      setSelectedFuel(fuel);
      setSortType(fuel);
    }
  };

  const handleSortChange = (newSortType) => {
    setSortType(newSortType);

    // 유종으로 정렬할 경우 지도 표시 유종도 변경
    const fuels = ['gasoline', 'diesel', 'premium', 'lpg', 'kerosene'];
    if (fuels.includes(newSortType)) {
      setSelectedFuel(newSortType);
    }
  };

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
          // 위치 권한 거부 등의 경우 기본 위치(서울)로 설정
          setCurrentLocation({ lat: 37.5665, lng: 126.9780 });
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      // Geolocation 미지원 시 기본 위치
      setCurrentLocation({ lat: 37.5665, lng: 126.9780 });
    }
  }, []);

  // 주유소 목록 가져오기
  useEffect(() => {
    const fetchStations = async () => {
      if (!currentLocation) return;
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
          carWash: s.carWash,
          tradeDate: s.tradeDate,
          tradeTime: s.tradeTime,
          distance: `${(s.distance / 1000).toFixed(1)}km`,
          lat: parseFloat(s.lat),
          lng: parseFloat(s.lon),
          prices: s.prices || {}
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

  // 검색 결과 또는 최근 검색어 선택 시
  const handleSuggestionClick = async (place) => {
    setIsTyping(false);
    setSuggestions([]);

    if (place.isKeyword) {
      setSearchKeyword(place.place_name);
      try {
        const data = await searchPlaces(place.place_name);
        if (data && data.documents && data.documents.length > 0) {
          const firstResult = data.documents[0];
          const newLoc = { lat: Number(firstResult.y), lng: Number(firstResult.x) };
          setCurrentLocation(newLoc);
          setSearchKeyword(firstResult.place_name);
          saveSearchKeyword(place.place_name); // 순서 업데이트를 위해 저장 호출
          fetchRecentKeywords();
        }
      } catch (error) {
        console.error('Recent keyword search failed:', error);
      }
      return;
    }

    const newLoc = { lat: Number(place.y), lng: Number(place.x) };
    setCurrentLocation(newLoc);
    setSearchKeyword(place.place_name);

    setSelectedStation(null);
    setRouteTo(null);
    saveSearchKeyword(place.place_name); // 검색어 저장
    fetchRecentKeywords(); // 최근 검색어 동기화 (서버 반영 등)
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
  const handleDrawerTouchEnd = () => { };
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

  // 길찾기 취소
  const handleCloseRoute = () => {
    setRouteTo(null);
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden relative">
      {/* Header - Desktop Only */}
      <div className="hidden xl:block">
        <Header
          user={user}
          onLoginClick={openLoginModal}
          onSignupClick={openSignupModal}
        />
      </div>

      {/* Login & Signup Modals */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        onLoginSuccess={handleLoginSuccess}
        onSignupClick={openSignupModal}
        onFindPasswordClick={openFindPasswordModal}
      />
      <SignupModal
        isOpen={isSignupModalOpen}
        onClose={closeSignupModal}
        onSignupSuccess={openLoginModal}
        onLoginClick={openLoginModal}
      />
      <FindPasswordModal
        isOpen={isFindPasswordModalOpen}
        onClose={closeFindPasswordModal}
      />

      {/* 모바일: 유가 드로어 오버레이 */}
      {priceDrawerOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[95] transition-opacity duration-300"
          onClick={() => setPriceDrawerOpen(false)}
          aria-hidden
        />
      )}

      {/* 모바일: 사이드바 (헤더 기능 통합) */}
      <aside
        ref={drawerRef}
        className="xl:hidden fixed left-0 top-0 bottom-0 w-[min(320px,85vw)] bg-white shadow-2xl z-[100] flex flex-col transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) overflow-hidden"
        style={{ transform: priceDrawerOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        {/* 드로어 상단: 로고 및 닫기 */}
        <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { navigate('/'); setPriceDrawerOpen(false); }}>
            <FuelspotLogo className="h-8 w-auto" />
            <div className="flex flex-col">
              <span className="text-lg font-black text-slate-900 tracking-tighter leading-none">FUELSPOT</span>
              <span className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Smart Finder</span>
            </div>
          </div>
          <button
            onClick={() => setPriceDrawerOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 사용자 섹션 */}
        <div className="p-6 bg-white border-b border-gray-50">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-0.5">Welcome back</span>
                <span className="text-lg font-black text-slate-800 leading-tight">
                  {user.nickname || user.name} <span className="text-sm font-bold text-blue-600">님</span>
                </span>
                <button
                  onClick={() => { navigate('/mypage'); setPriceDrawerOpen(false); }}
                  className="text-xs font-black text-blue-600 mt-1 hover:underline flex items-center gap-1"
                >
                  마이페이지 관리
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-bold text-gray-400 mb-1 px-1">더 많은 기능을 사용해보세요!</p>
              <button
                onClick={() => { openLoginModal(); setPriceDrawerOpen(false); }}
                className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl shadow-xl shadow-slate-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                <span>로그인하기</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </button>
              <button
                onClick={() => { openSignupModal(); setPriceDrawerOpen(false); }}
                className="w-full py-4 bg-blue-50 text-blue-700 font-black rounded-2xl active:scale-[0.98] transition-all"
              >
                회원가입
              </button>
            </div>
          )}
        </div>

        {/* 메뉴 및 콘텐츠 섹션 */}
        <div className="flex-1 overflow-y-auto">
          {effectiveTab === null && (
            <nav className="py-2">
              <p className="px-6 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Service Menu</p>
              <button type="button" onClick={() => setMobileDrawerTab('average')} className="w-full px-6 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between group">
                <span>평균 유가</span>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button type="button" onClick={() => setMobileDrawerTab('calc')} className="w-full px-6 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between group">
                <span>유류비계산</span>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
              <button type="button" onClick={() => setMobileDrawerTab('qa')} className="w-full px-6 py-4 text-left text-base font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-between group">
                <span>Q&A</span>
                <svg className="w-4 h-4 text-gray-300 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </nav>
          )}

          {effectiveTab === 'average' && (
            <div key="average" className="flex flex-col h-full animate-in fade-in slide-in-from-right duration-300">
              <nav className="shrink-0 border-b border-gray-100 bg-white sticky top-0 z-10">
                <button type="button" onClick={handleCloseTab} className="w-full px-6 py-4 text-left text-base font-bold text-blue-900 bg-blue-50/50 border-l-4 border-blue-600 flex items-center gap-2">
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  평균 유가
                </button>
              </nav>
              <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <AveragePricePanel initialSido={detectedSido} />
                </div>
              </div>
            </div>
          )}

          {effectiveTab === 'calc' && (
            <div key="calc" className="flex flex-col h-full animate-in fade-in slide-in-from-right duration-300">
              <nav className="shrink-0 border-b border-gray-100 bg-white sticky top-0 z-10">
                <button type="button" onClick={handleCloseTab} className="w-full px-6 py-4 text-left text-base font-bold text-blue-900 bg-blue-50/50 border-l-4 border-blue-600 flex items-center gap-2">
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  유류비계산
                </button>
              </nav>
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50/30 text-center">
                <div className="w-20 h-20 bg-blue-100/50 rounded-3xl flex items-center justify-center mb-6 shadow-sm mx-auto">
                  <svg className="w-10 h-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <h3 className="text-lg font-black text-slate-800 mb-2">업데이트 준비중</h3>
                <p className="text-slate-400 text-sm font-medium">보다 정확한 유류비 계산 기능을<br />곧 만나보실 수 있습니다.</p>
              </div>
            </div>
          )}

          {effectiveTab === 'qa' && (
            <div key="qa" className="flex flex-col h-full animate-in fade-in slide-in-from-right duration-300">
              <nav className="shrink-0 border-b border-gray-100 bg-white sticky top-0 z-10">
                <button type="button" onClick={handleCloseTab} className="w-full px-6 py-4 text-left text-base font-bold text-blue-900 bg-blue-50/50 border-l-4 border-blue-600 flex items-center gap-2">
                  <svg className="w-4 h-4 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  Q&A
                </button>
              </nav>
              <div className="flex-1 flex flex-col items-center justify-center p-8">
                <p className="text-gray-400 font-bold">궁금한 점은 고객센터로 문의주세요!</p>
              </div>
            </div>
          )}
        </div>

        {/* 로그아웃 섹션 (하단 고정) */}
        {user && (
          <div className="p-6 border-t border-gray-50 bg-slate-50/30 shrink-0">
            <button
              onClick={async () => {
                try {
                  await logout();
                } catch (error) {
                  console.error('Logout failed:', error);
                } finally {
                  localStorage.removeItem('user');
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  navigate('/');
                  window.location.reload();
                }
              }}
              className="w-full py-4 text-red-500 font-black text-sm border border-red-100 rounded-2xl active:bg-red-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2 bg-white"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              로그아웃
            </button>
          </div>
        )}
      </aside>

      <div className="flex-1 flex flex-row w-full max-w-[1550px] mx-auto min-h-0 overflow-y-auto overflow-x-hidden lg:overflow-hidden relative">
        <aside className="hidden xl:block w-[280px] p-6 pr-0 overflow-y-auto shrink-0">
          <AveragePricePanel initialSido={detectedSido} />
        </aside>
        <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 lg:gap-6 relative min-h-0 overflow-visible lg:p-4 md:p-6">
          <div className="h-full w-full relative z-10">
            <MapViewPanel
              stations={routeTo ? [routeTo] : stations}
              selectedStation={selectedStation}
              onMarkerClick={handleMarkerClick}
              routeTo={routeTo}
              onCloseRoute={handleCloseRoute}
              currentLocation={currentLocation}
              onLocationClick={handleLocationClick}
              searchKeyword={searchKeyword}
              onSearchChange={handleSearchChange}
              suggestions={suggestions}
              onSuggestionClick={handleSuggestionClick}
              recentKeywords={recentKeywords}
              onDeleteRecentKeyword={handleDeleteRecentKeyword}
              onDeleteAllRecentKeywords={handleDeleteAllRecentKeywords}
              selectedFuel={selectedFuel}
              onMenuClick={() => setPriceDrawerOpen(true)}
              mobileListLevel={mobileListLevel}
            />
          </div>

          {/* 모바일: 바텀 시트 형태의 주유소 목록 */}
          <div
            className={`
              fixed inset-x-0 bottom-0 z-40 bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.15)] transition-all duration-500 ease-out rounded-t-[32px] overflow-hidden
              xl:relative xl:inset-auto xl:shadow-none xl:rounded-none xl:translate-y-0 xl:h-full
              ${mobileListLevel === 2 ? 'h-[88vh]' : mobileListLevel === 1 ? 'h-[45vh]' : 'h-[64px]'}
            `}
          >
            {/* 모바일 핸들 및 헤더 */}
            <div
              className="xl:hidden h-16 w-full flex flex-col items-center justify-center cursor-pointer select-none border-b border-gray-50 bg-white sticky top-0 z-10"
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={handleSheetClick}
            >
              <div className={`w-12 h-1.5 rounded-full transition-colors duration-300 mb-2 ${mobileListLevel === 2 ? 'bg-blue-400' : 'bg-gray-200'}`}></div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-700">주유소 목록</span>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-full">{stations.length}개</span>
              </div>
            </div>

            <div
              className="h-[calc(100%-64px)] xl:h-full overflow-y-auto"
              onScroll={handleListScroll}
            >
              <StationListPanel
                stations={stations}
                user={user}
                selectedStationId={selectedStation?.id}
                onStationClick={(s) => {
                  handleStationClick(s);
                  if (window.innerWidth < 1280) setMobileListLevel(1);
                }}
                onNavigate={(s) => {
                  handleNavigate(s);
                  if (window.innerWidth < 1280) setMobileListLevel(1);
                }}
                ref={listPanelRef}
                sortType={sortType}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainPageLayout;
