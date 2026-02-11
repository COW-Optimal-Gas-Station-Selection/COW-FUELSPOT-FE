import { useNavigate } from 'react-router-dom';
import FuelspotLogo from '../../../components/FuelspotLogo';
import UserMenu from '../../../components/UserMenu';

const Header = ({ user, onLoginClick, onSignupClick }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white py-3 border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
          <FuelspotLogo
            className="h-10 md:h-12 w-auto transition-transform group-hover:scale-105 duration-200"
          />
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter leading-none">FUELSPOT</h1>
            <p className="text-[10px] md:text-xs font-medium text-slate-500 tracking-wider">SMART FUEL FINDER</p>
          </div>
        </div>
        <div>
          <UserMenu
            user={user}
            onLoginClick={onLoginClick}
            onSignupClick={onSignupClick}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
