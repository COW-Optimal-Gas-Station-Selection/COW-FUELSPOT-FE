import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../../api/memberService'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import EmailInputSection from './organisms/EmailInputSection'
import FindPasswordModal from './organisms/FindPasswordModal'
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
      .then((result) => {
        // Interceptor now returns result directly on success
        if (result) {
          localStorage.setItem('accessToken', result.tokenDto.accessToken)
          localStorage.setItem('refreshToken', result.tokenDto.refreshToken)

          const user = {
            id: result.memberId,
            nickname: result.nickname,
            fuelType: result.fuelType,
            radius: result.radius
          }
          localStorage.setItem('user', JSON.stringify(user))
          setShowSuccessModal(true)
        }
      })
      .catch((error) => {
        console.error('Login error:', error)
        setErrorMessage(error.message || '아이디 또는 비밀번호가 올바르지 않습니다.')
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
