import SearchIcon from '../../assets/icon/search.svg?react';

const SearchButton = ({ className = '', ...props }) => (
  <button
    className={`w-full h-[44px] bg-[#1e2939] text-white rounded-[10px] text-base font-medium flex items-center justify-center gap-2 px-3 hover:bg-slate-700 transition-colors ${className}`}
    {...props}
  >
    <SearchIcon className="w-5 h-5 md:w-6 md:h-6" />
    <span className="text-[15px] md:text-base">검색</span>
  </button>
);

export default SearchButton;
