import { Listbox, Transition } from '@headlessui/react';
import PriceItem from '../atoms/PriceItem';

const FUEL_LABELS = {
  GASOLINE: '휘발유',
  DIESEL: '경유',
  PREMIUM_GASOLINE: '고급유',
  LPG: 'LPG',
};

const PriceCard = ({ title, prices, isSido = false, selectedSido, onSidoChange, sidoList }) => {
  if (!prices) return null;

  const selectedSidoName = sidoList?.find((s) => s.id === selectedSido)?.name ?? '';

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4 animate-fadeIn">
      <div className="flex justify-between items-center gap-2 mb-3 flex-nowrap min-w-0">
        <h3 className="font-bold text-gray-800 flex items-center gap-2 shrink-0 min-w-0">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0"></span>
          <span className="truncate">{title}</span>
        </h3>
        {isSido && sidoList && (
          <Listbox value={selectedSido} onChange={onSidoChange}>
            <div className="relative shrink-0 min-w-[72px] max-w-[88px]">
              <Listbox.Button className="w-full border border-gray-300 rounded-md px-2 py-1.5 text-xs bg-white shadow-sm flex items-center justify-between gap-1 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer">
                <span className="truncate text-neutral-950 font-medium">{selectedSidoName}</span>
                <svg className="w-3.5 h-3.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </Listbox.Button>
              <Transition
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-[-10px]"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-[-10px]"
              >
                <Listbox.Options className="absolute right-0 left-0 w-full min-w-[7rem] bg-white rounded-lg border border-gray-200 shadow-xl z-100 overflow-auto max-h-[45vh] sm:max-h-60 p-1.5 mt-1.5">
                  {sidoList.map((sido) => (
                    <Listbox.Option
                      key={sido.id}
                      value={sido.id}
                      className={({ active, selected }) =>
                        `px-3 py-2.5 rounded-md cursor-pointer text-sm transition-all duration-150 whitespace-nowrap ${active ? 'bg-blue-50' : 'bg-white'} ${selected ? 'font-semibold text-blue-600 bg-blue-50' : 'text-neutral-950'} hover:bg-blue-50`
                      }
                    >
                      {sido.name}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
        )}
      </div>

      <div className="space-y-2.5">
        {Object.entries(FUEL_LABELS).map(([key, label]) => {
          const info = prices[key];
          if (!info) return null;
          return (
            <PriceItem
              key={key}
              label={label}
              average={info.average}
              weeklyChange={info.weeklyChange}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PriceCard;
