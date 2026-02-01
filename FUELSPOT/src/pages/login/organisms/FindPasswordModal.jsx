import { useState } from 'react'
import { resetPassword, sendVerificationCode, verifyCode } from '../../../api/memberService'
import Button from '../../../components/Button'
import Input from '../../../components/Input'
import { validateConfirmPassword, validatePassword } from '../../../utils/validation'
import ConfirmPasswordInputSection from '../../signup/organisms/ConfirmPasswordInputSection'
import PasswordInputSection from '../../signup/organisms/PasswordInputSection'
import EmailIcon from '../atoms/EmailIcon'

function FindPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState('email') // email, verify, reset
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const passwordRequirements = validatePassword(newPassword)
  const confirmPasswordRequirements = validateConfirmPassword(newPassword, confirmPassword)

  if (!isOpen) return null

  const handleSendCode = async () => {
    if (!email) {
      setError('이메일을 입력해주세요.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await sendVerificationCode({ email })
      setStep('verify')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!code) {
      setError('인증 코드를 입력해주세요.')
      return
    }
    setError('')
    setIsLoading(true)
    try {
      await verifyCode({ email, code })
      setStep('reset')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      setError('비밀번호를 입력해주세요.')
      return
    }

    if (!passwordRequirements.isLengthValid || !passwordRequirements.isComplexValid) {
      setError('비밀번호 조건을 충족해주세요.')
      return
    }

    if (!confirmPasswordRequirements.isMatch) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }

    setError('')
    setIsLoading(true)
    try {
      await resetPassword({ email, code, newPassword })
      alert('비밀번호가 성공적으로 변경되었습니다.')
      handleClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setStep('email')
    setEmail('')
    setCode('')
    setNewPassword('')
    setConfirmPassword('')
    setError('')
    onClose()
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      style={{ animation: 'fadeIn 0.2s ease-out' }}
      onClick={handleClose}
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 relative"
        style={{ animation: 'slideUp 0.3s ease-out' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back/Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 18L18 6M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <h2 className="text-xl font-bold text-neutral-950 mb-2 mt-2">
          비밀번호 재설정
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">
            {error}
          </p>
        )}

        {step === 'email' && (
          <>
            <p className="text-sm text-gray-600 mb-6">
              가입하신 이메일 주소를 입력하시면 인증 코드를 보내드립니다.
            </p>
            <div className="mb-6">
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
            <Button 
              className="w-full h-12" 
              onClick={handleSendCode}
              disabled={isLoading}
            >
              {isLoading ? '발송 중...' : '인증 코드 보내기'}
            </Button>
          </>
        )}

        {step === 'verify' && (
          <>
            <p className="text-sm text-gray-600 mb-6">
              {email}로 발송된 인증 코드를 입력해주세요.
            </p>
            <div className="mb-6">
              <label className="block text-sm font-medium text-neutral-950 mb-2">인증 코드</label>
              <Input
                type="text"
                placeholder="인증 코드 6자리"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={6}
              />
            </div>
            <Button 
              className="w-full h-12" 
              onClick={handleVerifyCode}
              disabled={isLoading}
            >
              {isLoading ? '확인 중...' : '인증 확인'}
            </Button>
            <button 
              onClick={() => setStep('email')}
              className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              이메일 다시 입력하기
            </button>
          </>
        )}

        {step === 'reset' && (
          <>
            <p className="text-sm text-gray-600 mb-6">
              새로운 비밀번호를 설정해주세요. (8자 이상, 영문/숫자/특수문자 포함)
            </p>
            <div className="space-y-4 mb-6">
              <PasswordInputSection
                label="새 비밀번호"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                requirements={passwordRequirements}
              />
              <ConfirmPasswordInputSection
                label="새 비밀번호 확인"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                requirements={confirmPasswordRequirements}
              />
            </div>
            <Button 
              className="w-full h-12" 
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? '변경 중...' : '비밀번호 변경 완료'}
            </Button>
          </>
        )}

        {/* Footer Text */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            문제가 발생했나요? <span className="underline cursor-pointer">고객 지원 연락</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default FindPasswordModal
