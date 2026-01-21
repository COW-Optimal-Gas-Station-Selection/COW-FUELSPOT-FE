import { useNavigate } from 'react-router-dom';
import FuelspotLogo from '../../../components/FuelspotLogo';
import UserMenu from '../../../components/UserMenu';
import LocationButton from '../atoms/LocationButton';
import SearchButton from '../atoms/SearchButton';
import SearchInput from '../atoms/SearchInput';

const Header = ({ onLocationClick, user }) => {
  const navigate = useNavigate();

  return (
    <header className="bg-white py-6 shadow-sm z-10 sticky top-0">
      <div className="max-w-[1248px] mx-auto flex flex-row items-center w-full px-4 md:px-8">
        <FuelspotLogo 
          className="flex-shrink-0 cursor-pointer" 
          onClick={() => navigate('/')} 
        />
        <div className="flex flex-1 gap-3 items-center ml-6">
          <div className="flex-1 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            </span>
            <SearchInput />
          </div>
          <div className="w-[130px]">
            <LocationButton onClick={onLocationClick} />
          </div>
          <div className="w-[100px]">
            <SearchButton />
          </div>
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;
