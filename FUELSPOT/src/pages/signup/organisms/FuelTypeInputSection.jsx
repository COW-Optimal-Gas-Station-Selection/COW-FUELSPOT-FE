import ErrorMessage from '../atoms/ErrorMessage'
import Label from '../atoms/Label'

function FuelTypeInputSection({ value, onChange, error }) {
  const fuelTypes = [
    { value: 'GASOLINE', label: '휘발유' },
    { value: 'DIESEL', label: '경유' },
    { value: 'LPG', label: 'LPG' },
  ]

  return (
    <div className="mb-6">
      <Label htmlFor="fuelType" className="text-gray-700 font-bold mb-2 block">선호 유종</Label>
      <div className="grid grid-cols-3 gap-3 mt-1">
        {fuelTypes.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={`relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 ${
              value === type.value
                ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm transform -translate-y-0.5'
                : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200 hover:bg-gray-50'
            }`}
          >
            <span className="text-2xl mb-1">{type.emoji}</span>
            <span className="text-xs font-bold">{type.label}</span>
            {value === type.value && (
              <div className="absolute top-1 right-1">
                <div className="bg-blue-600 rounded-full p-0.5">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        ))}
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default FuelTypeInputSection
