import SearchIcon from '../../../assets/icon/search.svg?react';
import Input from '../../../components/Input';

const SearchInput = ({ className = '', ...props }) => (
  <div className="relative w-full">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
      <SearchIcon className="w-5 h-5 md:w-6 md:h-6" />
    </span>
    <Input
      className={`w-full h-[46px] pl-10 pr-4 bg-white border border-[#d1d5dc] rounded-[10px] text-sm focus:outline-none focus:ring-1 focus:ring-[#155dfc] placeholder:text-gray-400 ${className}`}
      placeholder="서울 시청 (기본 위치)"
      {...props}
    />
  </div>
);

export default SearchInput;
