
export default function FavoriteButton({ stationId, isFavorite, onToggle }) {
  return (
    <button
      className={
        'w-6 h-6 flex items-center justify-center rounded-full ' +
        (isFavorite ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-400')
      }
      title={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
      onClick={e => {
        e.stopPropagation()
        onToggle && onToggle(stationId)
      }}
      aria-label="즐겨찾기"
      type="button"
    >
      <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 15.27L16.18 19l-1.64-7.03L20 7.24l-7.19-.61L10 0 7.19 6.63 0 7.24l5.46 4.73L3.82 19z" />
      </svg>
    </button>
  )
}
