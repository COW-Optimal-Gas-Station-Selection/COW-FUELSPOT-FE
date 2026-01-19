import { useState } from 'react'
import Button from './Button'
import Input from './Input'
import EmailIcon from '../pages/login/atoms/EmailIcon'

function FindPasswordModal({ isOpen, onClose }) {
  const [email, setEmail] = useState('')

  if (!isOpen) return null

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
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Title */}
        <h2 className="text-xl font-bold text-neutral-950 mb-2 mt-2">
          비밀번호 찾기
        </h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-6">
          가입하신 이메일 주소를 입력하시면 비밀번호 재설정 링크를 보내드립니다.
        </p>

        {/* Email Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-neutral-950 mb-2">이메일</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <EmailIcon />
            </div>
            <Input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="mb-4">
          <Button className="w-full" onClick={() => {}}>
            재설정 링크 보내기
          </Button>
        </div>

        {/* Helper Text */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            이메일을 받지 못하셨나요?
          </p>
          <p className="text-xs text-gray-500">
            스팸 메일함을 확인해주세요.
          </p>
        </div>
      </div>
    </div>
  )
}

export default FindPasswordModal
