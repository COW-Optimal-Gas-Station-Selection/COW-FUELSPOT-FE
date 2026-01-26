import { useNavigate } from 'react-router-dom';
import FuelspotLogo from '../../../components/FuelspotLogo';
import UserMenu from '../../../components/UserMenu';

const Header = ({ user }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white/90 backdrop-blur-sm py-4 shadow-sm z-50 sticky top-0">
      <div className="max-w-[1248px] mx-auto flex flex-row items-center justify-between w-full px-4 md:px-8">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
          <FuelspotLogo 
            className="flex-shrink-0 h-12 w-auto" 
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-blue-900 tracking-tight">FUELSPOT</h1>
            <p className="text-sm font-semibold text-blue-900 tracking-wide">주유비를 아끼는 최선의 선택</p>
          </div>
        </div>
        <UserMenu user={user} />
      </div>
    </header>
  );
};

export default Header;
