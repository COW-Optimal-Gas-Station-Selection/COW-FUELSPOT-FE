import LocationButton from '../atoms/LocationButton';
import SearchButton from '../atoms/SearchButton';
import SearchInput from '../atoms/SearchInput';

const Header = ({ onLocationClick }) => {
  return (
    <header className="bg-white px-4 md:px-8 py-6 shadow-sm z-10 sticky top-0">
      <div className="max-w-[1248px] mx-auto flex flex-col gap-4">
        <h1 className="text-[#155dfc] text-base font-bold">주유소 찾기</h1>
        <div className="flex gap-3">
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
        </div>
      </div>
    </header>
  );
};

export default Header;
