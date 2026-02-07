import SearchIcon from '../../../assets/icon/search.svg?react';
import Input from '../../../components/Input';

const SearchInput = ({ className = '', suggestions = [], onSuggestionClick, ...props }) => (
  <div className="relative w-full">
    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-[1] pointer-events-none">
      <SearchIcon className="w-4 h-4 md:w-6 md:h-6" />
    </span>
    <Input
      className={`w-full h-[40px] md:h-[46px] pl-9 md:pl-10 pr-3 md:pr-4 bg-white! border border-[#d1d5dc] rounded-[10px] text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-[#155dfc] placeholder:text-gray-400 ${className}`}
      placeholder='예) "명지대학교", "거북골로 34"'
      {...props}
    />
    
    {suggestions.length > 0 && (
      <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-[100] max-h-[300px] overflow-y-auto">
        {suggestions.map((place, index) => (
          <div
            key={index}
            className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-none"
            onClick={() => onSuggestionClick(place)}
          >
            <div className="text-sm font-medium text-gray-900">{place.place_name}</div>
            <div className="text-xs text-gray-500 mt-0.5">{place.address_name}</div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default SearchInput;
