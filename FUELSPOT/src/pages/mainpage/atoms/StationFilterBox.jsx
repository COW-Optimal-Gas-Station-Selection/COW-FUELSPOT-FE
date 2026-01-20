import { Listbox } from '@headlessui/react';

const sortOptions = [
  { value: 'distance', label: '거리순', icon: <span className="text-pink-500"></span> },
  { value: 'gasoline', label: '가격순(휘발유)', icon: <span className="text-red-500"></span> },
  { value: 'diesel', label: '가격순(경유)', icon: <span className="text-blue-500"></span> },
  { value: 'premium', label: '가격순(고급휘발유)', icon: <span className="text-yellow-500"></span> },
];

export default function StationFilterBox({ sortType, onSortChange }) {
  return (
    <div className="flex items-center gap-2">
      <Listbox value={sortType} onChange={onSortChange}>
        <div className="relative min-w-[180px]">
          <Listbox.Button className="w-full border rounded px-3 py-2 text-sm bg-white shadow-sm flex items-center justify-between focus:ring-2 focus:ring-blue-200 focus:outline-none">
            <span className="flex items-center gap-2 min-w-0">
              <span className="truncate max-w-[110px]">{sortOptions.find(opt => opt.value === sortType)?.label}</span>
              <span className="w-5 flex-shrink-0 flex items-center justify-center">{sortOptions.find(opt => opt.value === sortType)?.icon}</span>
            </span>
            <svg className="ml-2 w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
          </Listbox.Button>
          <Listbox.Options className="absolute left-0 mt-1 w-full bg-white rounded shadow-lg border z-50 overflow-auto max-h-60 p-1">
            {sortOptions.map(opt => (
              <Listbox.Option
                key={opt.value}
                value={opt.value}
                className={({ active, selected }) =>
                  `px-3 py-2 rounded cursor-pointer flex items-center gap-2 text-sm transition-colors ${active ? 'bg-blue-50' : ''} ${selected ? 'font-bold text-blue-600 bg-blue-100' : ''}`
                }
              >
                <span className="truncate max-w-[120px]">{opt.label}</span>
                <span className="w-5 flex-shrink-0 flex items-center justify-center">{opt.icon}</span>
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
}
