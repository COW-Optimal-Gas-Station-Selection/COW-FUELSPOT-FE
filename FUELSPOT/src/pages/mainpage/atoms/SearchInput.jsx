import { useState } from 'react';
import SearchIcon from '../../../assets/icon/search.svg?react';
import Input from '../../../components/Input';

const SearchInput = ({
  className = '',
  suggestions = [],
  onSuggestionClick,
  recentKeywords = [],
  onDeleteRecentKeyword,
  onDeleteAllRecentKeywords,
  value,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative w-full">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-[1] pointer-events-none">
        <SearchIcon className="w-4 h-4 md:w-6 md:h-6" />
      </span>
      <Input
        className={`w-full h-[40px] md:h-[46px] pl-9 md:pl-10 pr-3 md:pr-4 bg-white! border border-[#d1d5dc] rounded-[10px] text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-[#155dfc] placeholder:text-gray-400 ${className}`}
        placeholder='예) "명지대학교", "거북골로 34"'
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)} // 클릭 이벤트 처리를 위해 딜레이
        {...props}
      />

      {/* 검색어 입력 시 자동완성 제안 */}
      {value && suggestions.length > 0 && (
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

      {/* 포커스 시 & 입력값 없을 때 최근 검색어 표시 */}
      {isFocused && !value && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-[100] overflow-hidden">
          <div className="p-4">
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="text-sm font-bold text-gray-800">최근 검색어</span>
              {recentKeywords.length > 0 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteAllRecentKeywords?.();
                  }}
                  className="text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  전체 삭제
                </button>
              )}
            </div>

            <div className="flex flex-col gap-1">
              {recentKeywords.length > 0 ? (
                recentKeywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between px-3 py-2.5 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => {
                      // 실제 검색 동작을 위해 props의 onChange 등을 호출하거나 
                      // 여기서 특정 액션을 수행해야 할 수 있음. 
                      // 이 구조에서는 input의 value를 직접 바꾸는 handleSuggestionClick과 유사한 처리가 필요.
                      onSuggestionClick?.({ place_name: keyword, isKeyword: true });
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm text-gray-600 truncate">{keyword}</span>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteRecentKeyword?.(keyword);
                      }}
                      className="p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-md hover:bg-gray-100"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center">
                  <p className="text-sm text-gray-400 italic">최근 검색 기록이 없습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
