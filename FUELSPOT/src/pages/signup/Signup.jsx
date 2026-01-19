import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import SignupHeader from './organisms/SignupHeader'
import NameInputSection from './organisms/NameInputSection'
import EmailInputSection from './organisms/EmailInputSection'
import PasswordInputSection from './organisms/PasswordInputSection'
import ConfirmPasswordInputSection from './organisms/ConfirmPasswordInputSection'
import SignupFooter from './organisms/SignupFooter'

function Signup() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const validateEmail = (email) => {
    return email.includes('@') && email.includes('.')
  }

  const handleSignup = () => {
    setNameError('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')

    if (!name.trim()) {
      setNameError('이름을 입력해주세요')
      return
    }

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

    if (!confirmPassword.trim()) {
      setConfirmPasswordError('비밀번호를 다시 입력해주세요')
      return
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError('비밀번호가 일치하지 않습니다')
      setErrorMessage('비밀번호가 일치하지 않습니다.')
      setShowErrorModal(true)
      return
    }

    // 모든 검증 통과 시 성공 모달 표시
    setShowSuccessModal(true)
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    navigate('/login')
  }

  const handleErrorModalClose = () => {
    setShowErrorModal(false)
  }

  return (
    <>
      <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <SignupHeader />
          <NameInputSection
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={nameError}
          />
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
          <ConfirmPasswordInputSection
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={confirmPasswordError}
          />
          <div className="mb-4">
            <Button className="w-full" onClick={handleSignup}>회원가입</Button>
          </div>
          <SignupFooter />
        </div>
      </div>
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        type="success"
        title="회원가입 성공!"
        message="회원가입이 완료되었습니다. 로그인 페이지로 이동합니다."
      />
      <Modal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        type="error"
        title="비밀번호 불일치"
        message={errorMessage}
      />
    </>
  )
}

export default Signup
