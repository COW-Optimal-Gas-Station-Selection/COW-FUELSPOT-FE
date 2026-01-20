function RequirementItem({ isMet, text }) {
  return (
    <div className={`flex items-center gap-2 transition-all duration-300 ${isMet ? 'text-green-600' : 'text-gray-400'}`}>
      <svg 
        className="w-4 h-4 shrink-0" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
      <span className="text-[13px] font-medium">{text}</span>
    </div>
  )
}

export default RequirementItem
