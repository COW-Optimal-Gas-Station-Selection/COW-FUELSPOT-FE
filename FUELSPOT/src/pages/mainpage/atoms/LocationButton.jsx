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
    className={`w-full h-[44px] bg-[#1e2939] text-white rounded-[10px] text-base font-medium flex items-center justify-center gap-2 px-3 hover:bg-slate-700 transition-colors ${className}`}
    {...props}
  >
    <CrosshairIcon className="w-5 h-5 md:w-6 md:h-6 text-white" />
    <span className="text-[15px] md:text-base">내위치</span>
  </Button>
);

export default LocationButton;
