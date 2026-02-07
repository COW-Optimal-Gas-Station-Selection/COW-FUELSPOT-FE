import Button from '../../../components/Button';

/** 내 위치(중심 맞추기)용 십자 타겟 아이콘 - 마커와 구분 */
const CrosshairIcon = ({ className = '' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
);

const LocationButton = ({ className = '', ...props }) => (
  <Button
    className={`w-full h-[40px] md:h-[44px] bg-blue-900 text-white rounded-lg md:rounded-[10px] text-xs md:text-base font-semibold flex items-center justify-center gap-1 md:gap-2 px-2 md:px-3 hover:bg-blue-800 transition-colors ${className}`}
    {...props}
  >
    <CrosshairIcon className="w-4 h-4 md:w-6 md:h-6 text-white shrink-0" />
    <span className="whitespace-nowrap truncate">내위치</span>
  </Button>
);

export default LocationButton;
