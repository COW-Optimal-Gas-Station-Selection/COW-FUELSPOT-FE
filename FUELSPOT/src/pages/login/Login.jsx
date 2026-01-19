import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import FindPasswordModal from '../../components/FindPasswordModal'
import LoginHeader from './organisms/LoginHeader'
import EmailInputSection from './organisms/EmailInputSection'
import PasswordInputSection from './organisms/PasswordInputSection'
import LoginFooter from './organisms/LoginFooter'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
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

    // 로그인 성공 모달 표시
    setShowSuccessModal(true)
  }

  const handleModalClose = () => {
    setShowSuccessModal(false)
    navigate('/main')
  }

  return (
    <>
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <LoginHeader />
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
          <div className="mb-4">
            <Button className="w-full" onClick={handleLogin}>로그인</Button>
          </div>
          <LoginFooter onFindPasswordClick={() => setShowFindPasswordModal(true)} />
        </div>
      </div>
      <Modal
        isOpen={showSuccessModal}
        onClose={handleModalClose}
        type="success"
        title="로그인 성공!"
        message="환영합니다. 메인 페이지로 이동합니다."
      />
      <FindPasswordModal
        isOpen={showFindPasswordModal}
        onClose={() => setShowFindPasswordModal(false)}
      />
    </>
  )
}

export default Login
