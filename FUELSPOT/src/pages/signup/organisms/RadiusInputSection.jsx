import ErrorMessage from '../atoms/ErrorMessage'
import Label from '../atoms/Label'

function RadiusInputSection({ value, onChange, error }) {
  return (
    <div className="mb-8 font-['Arimo']">
      <div className="flex justify-between items-center mb-4">
        <Label htmlFor="radius" className="text-gray-700 font-bold">검색 반경</Label>
        <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm min-w-[50px] text-center">
          {value} km
        </span>
      </div>
      <div className="relative h-6 flex items-center group">
        <input
          id="radius"
          type="range"
          min="1"
          max="10"
          step="1"
          value={value}
          onChange={onChange}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-none transition-all duration-300"
        />
      </div>
      <div className="flex justify-between text-[11px] text-gray-400 font-semibold px-0.5 mt-2">
        <span>1km</span>
        <span className="opacity-50">5km</span>
        <span>10km</span>
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default RadiusInputSection
