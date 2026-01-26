import { useLocation, useNavigate } from 'react-router-dom';
import FuelspotLogo from './FuelspotLogo';
import UserMenu from './UserMenu';
import { useEffect, useState } from 'react';

function GlobalSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
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
  }, [location]);

  // 로그인/회원가입 페이지에서는 사이드바 숨김
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  
  if (isAuthPage) {
    return null;
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-20 bg-white shadow-lg z-50 flex flex-col items-center py-6 border-r border-gray-100">
      <div className="flex flex-col items-center gap-6">
        <FuelspotLogo 
          className="cursor-pointer w-12 h-auto" 
          onClick={() => navigate('/')} 
        />
        <div className="w-full flex justify-center">
          <UserMenu user={user} />
        </div>
      </div>
    </aside>
  );
}

export default GlobalSidebar;
