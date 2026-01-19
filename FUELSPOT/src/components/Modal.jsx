import Button from './Button'

function Modal({ isOpen, onClose, type = 'success', title, message }) {
  if (!isOpen) return null

  const isSuccess = type === 'success'

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button - 성공 모달이 아닐 때만 표시 */}
        {!isSuccess && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        )}

        {/* Icon */}
        <div className="flex justify-center mb-4">
          {isSuccess ? (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 16L14 20L22 12" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 10L22 22M22 10L10 22" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-bold text-neutral-950 text-center mb-2">
          {title}
        </h2>

        {/* Message */}
        <p className="text-sm text-gray-600 text-center mb-6">
          {message}
        </p>

        {/* Button */}
        {isSuccess ? (
          <Button 
            className="w-full"
            onClick={onClose}
          >
            확인
          </Button>
        ) : (
          <button
            className="w-full h-9 px-4 bg-red-500 rounded-lg text-white text-sm font-normal leading-5 hover:bg-red-600 transition-colors cursor-pointer"
            onClick={onClose}
          >
            확인
          </button>
        )}
      </div>
    </div>
  )
}

export default Modal
