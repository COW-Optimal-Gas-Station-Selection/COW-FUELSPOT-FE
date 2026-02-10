import { Listbox, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import ErrorMessage from '../atoms/ErrorMessage'
import Label from '../atoms/Label'

function FuelTypeInputSection({ value, onChange, error }) {
  const fuelTypes = [
    { value: 'GASOLINE', label: '휘발유' },
    { value: 'DIESEL', label: '경유' },
    { value: 'PREMIUM_GASOLINE', label: '고급휘발유' },
    { value: 'LPG', label: 'LPG' },
    { value: 'KEROSENE', label: '실내등유' },
  ]

  const selectedType = fuelTypes.find(t => t.value === value) || fuelTypes[0]

  return (
    <div className="mb-6">
      <Label htmlFor="fuelType" className="text-gray-700 font-bold mb-2 block">선호 유종</Label>

      <div className="mt-1 relative">
        <Listbox value={value} onChange={onChange}>
          <Listbox.Button className="relative w-full bg-white border border-gray-100 rounded-xl py-3.5 px-4 text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm hover:border-blue-200 text-sm font-bold text-gray-700 flex items-center justify-between">
            <span className="block truncate">{selectedType.label}</span>
            <span className="pointer-events-none flex items-center">
              <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                <path d="M7 8l3 3 3-3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </Listbox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-2 w-full bg-white shadow-xl max-h-60 rounded-xl py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm border border-gray-50/50">
              {fuelTypes.map((type) => (
                <Listbox.Option
                  key={type.value}
                  className={({ active }) =>
                    `${active ? 'text-blue-900 bg-blue-50/60' : 'text-gray-700'}
                          cursor-pointer select-none relative py-3.5 px-4 transition-colors duration-150`
                  }
                  value={type.value}
                >
                  {({ selected }) => (
                    <div className="flex items-center justify-between">
                      <span className={`${selected ? 'font-bold text-blue-600' : 'font-medium'} block truncate`}>
                        {type.label}
                      </span>
                      {selected && (
                        <span className="text-blue-600">
                          <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                      )}
                    </div>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </Listbox>
      </div>

      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default FuelTypeInputSection
