import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/memberService'
import Button from '../../components/Button'
import FindPasswordModal from '../../components/FindPasswordModal'
import Modal from '../../components/Modal'
import GasFillingGame from './components/GasFillingGame'
import EmailInputSection from './organisms/EmailInputSection'
import LoginFooter from './organisms/LoginFooter'
import LoginHeader from './organisms/LoginHeader'
import PasswordInputSection from './organisms/PasswordInputSection'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showFindPasswordModal, setShowFindPasswordModal] = useState(false)

  const validateEmail = (email) => {
    return email.includes('@') && email.includes('.')
  }

  const handleLogin = () => {
    setEmailError('')
    setPasswordError('')

    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요')
      return
    }

    if (!validateEmail(email)) {
      setEmailError('올바른 이메일 형식이 아닙니다')
      return
    }

    if (!password.trim()) {
      setPasswordError('비밀번호를 입력해주세요')
      return
    }

    const loginData = {
      email,
      password
    }

    login(loginData)
      .then((data) => {
        if (data.isSuccess) {
          // 토큰 저장
          localStorage.setItem('accessToken', data.accessToken)
          // 사용자 정보 저장 (MainPageLayout 호환성을 위해 user 객체로도 저장)
          const user = {
            id: data.memberId,
            name: data.nickname,
            fuelType: data.fuelType,
            radius: data.radius
          }
          localStorage.setItem('user', JSON.stringify(user))
          setShowSuccessModal(true)
        } else {
          setErrorMessage(data.message || '아이디 또는 비밀번호가 올바르지 않습니다.')
          setShowErrorModal(true)
        }
      })
      .catch((error) => {
        console.error('Login error:', error)
        setErrorMessage(error.message)
        setShowErrorModal(true)
      })
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    navigate('/')
  }

  const handleErrorModalClose = () => {
    setShowErrorModal(false)
  }

  return (
    <>
      <div className="h-screen bg-gray-50 flex flex-col snap-y snap-mandatory overflow-y-auto scroll-smooth">
        {/* Section 1: Login Form (White & Centered) */}
        <div className="min-h-screen flex-shrink-0 flex items-center justify-center p-4 relative z-10 bg-white snap-start">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-10 border border-gray-100">
            <div className="mb-10 text-center">
              <LoginHeader />
            </div>
            
            <div className="space-y-6">
              <EmailInputSection
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
              />
              
              <PasswordInputSection
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
              />

              <div className="pt-6">
                <Button 
                  className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.97] font-bold text-lg" 
                  onClick={handleLogin}
                >
                  로그인
                </Button>
              </div>
              
              <div className="pt-4 border-t border-gray-100">
                <LoginFooter onFindPasswordClick={() => setShowFindPasswordModal(true)} />
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="mt-10 flex flex-col items-center gap-2 animate-bounce opacity-40">
              <span className="text-[10px] font-bold tracking-widest text-gray-400">SCROLL FOR MINI GAME</span>
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Section 2: Interactive Gas Filling Game */}
        <div className="min-h-screen flex-shrink-0 relative z-0 snap-start">
          <GasFillingGame />
        </div>

        {/* Game Instruction Overlay (Only visible when scrolled) */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/30 text-[10px] font-bold tracking-[0.3em] pointer-events-none mix-blend-difference hidden lg:block">
          FUELSPOT INTERACTIVE EXPERIENCE
        </div>
      </div>
      <Modal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        type="success"
        title="로그인 성공!"
        message="환영합니다. 메인 페이지로 이동합니다."
      />
      <Modal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        type="error"
        title="로그인 실패"
        message={errorMessage}
      />
      <FindPasswordModal
        isOpen={showFindPasswordModal}
        onClose={() => setShowFindPasswordModal(false)}
      />
    </>
  )
}

export default Login
