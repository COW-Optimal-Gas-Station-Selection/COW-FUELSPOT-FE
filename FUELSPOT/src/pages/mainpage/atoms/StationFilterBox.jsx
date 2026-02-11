import { Listbox, Transition } from '@headlessui/react';

const sortOptions = [
  { value: 'optimal', label: '최적순', icon: <span className="text-blue-600"></span> },
  { value: 'distance', label: '거리순', icon: <span className="text-pink-500"></span> },
  { value: 'gasoline', label: '가격순(휘발유)', icon: <span className="text-red-500"></span> },
  { value: 'diesel', label: '가격순(경유)', icon: <span className="text-blue-500"></span> },
  { value: 'premium', label: '가격순(고급휘발유)', icon: <span className="text-yellow-500"></span> },
  { value: 'kerosene', label: '가격순(실내등유)', icon: <span className="text-orange-500"></span> },
  { value: 'lpg', label: '가격순(LPG)', icon: <span className="text-teal-500"></span> },
];

export default function StationFilterBox({ sortType, onSortChange }) {
  return (
    <div className="flex items-center gap-2">
      <Listbox value={sortType} onChange={onSortChange}>
        <div className="relative min-w-[160px] md:min-w-[240px]">
          <Listbox.Button className="w-full border border-gray-300 rounded-lg px-2 py-1.5 md:px-3 md:py-2.5 text-xs md:text-sm bg-white shadow-sm flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 cursor-pointer">
            <span className="flex items-center gap-2 min-w-0">
              <span className="whitespace-nowrap text-neutral-950 font-medium">{sortOptions.find(opt => opt.value === sortType)?.label}</span>
              <span className="w-5 flex-shrink-0 flex items-center justify-center">{sortOptions.find(opt => opt.value === sortType)?.icon}</span>
            </span>
            <svg className="ml-2 w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </Listbox.Button>
          <Transition
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-[-10px]"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-[-10px]"
          >
            <Listbox.Options className="absolute right-0 w-[180px] md:w-full min-w-max bg-white rounded-lg shadow-xl z-[100] overflow-auto max-h-[45vh] sm:max-h-60 p-1.5 mt-1.5 border border-gray-100">
              {sortOptions.map(opt => (
                <Listbox.Option
                  key={opt.value}
                  value={opt.value}
                  className={({ active, selected }) =>
                    `px-3 py-2.5 rounded-md cursor-pointer flex items-center justify-between gap-3 text-sm transition-all duration-150 ${active ? 'bg-blue-50 text-blue-700' : 'bg-white text-neutral-950'} ${selected ? 'font-bold text-blue-600 bg-blue-50' : ''}`
                  }
                >
                  <span className="whitespace-nowrap">{opt.label}</span>
                  <span className="w-5 flex-shrink-0 flex items-center justify-center">{opt.icon}</span>
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
