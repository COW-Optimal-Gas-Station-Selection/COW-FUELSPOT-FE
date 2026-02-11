import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signup } from '../../api/memberService'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import {
  validateConfirmPassword,
  validateEmail,
  validateNickname,
  validatePassword
} from '../../utils/validation'
import CarInputSection from './organisms/CarInputSection'
import ConfirmPasswordInputSection from './organisms/ConfirmPasswordInputSection'
import EmailInputSection from './organisms/EmailInputSection'
import FuelTypeInputSection from './organisms/FuelTypeInputSection'
import NameInputSection from './organisms/NameInputSection'
import PasswordInputSection from './organisms/PasswordInputSection'
import RadiusInputSection from './organisms/RadiusInputSection'
import SignupFooter from './organisms/SignupFooter'
import SignupHeader from './organisms/SignupHeader'

function Signup() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fuelType, setFuelType] = useState('GASOLINE')
  const [radius, setRadius] = useState(3)
  const [brand, setBrand] = useState('')
  const [selectedCar, setSelectedCar] = useState(null)

  const [nicknameError, setNicknameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [fuelTypeError, setFuelTypeError] = useState('')
  const [radiusError, setRadiusError] = useState('')

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const nicknameRequirements = validateNickname(nickname)
  const emailRequirements = validateEmail(email)
  const passwordRequirements = validatePassword(password)
  const confirmPasswordRequirements = validateConfirmPassword(password, confirmPassword)

  const handleSignup = () => {
    setNicknameError('')
    setEmailError('')
    setPasswordError('')
    setConfirmPasswordError('')
    setFuelTypeError('')
    setRadiusError('')

    if (!nickname.trim()) {
      setNicknameError('닉네임을 입력해주세요')
      return
    }

    if (nickname.length < 2 || nickname.length > 10) {
      setNicknameError('닉네임은 2자 이상 10자 이하이어야 합니다')
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

    if (password.length < 8 || password.length > 20) {
      setPasswordError('비밀번호는 8자 이상 20자 이하로 입력해주세요')
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

    if (!fuelType) {
      setFuelTypeError('선호 유종을 선택해주세요')
      return
    }

    if (!radius || radius < 1) {
      setRadiusError('반경은 최소 1km 이상이어야 합니다')
      return
    }

    const signupData = {
      email,
      password,
      checkPassword: confirmPassword,
      nickname,
      fuelType,
      radius: parseInt(radius),
      brand: brand,
      carName: selectedCar?.modelName
    }

    signup(signupData)
      .then(() => {
        setShowSuccessModal(true)
      })
      .catch((error) => {
        console.error('Signup error:', error)
        setErrorMessage(error.message || '회원가입 중 오류가 발생했습니다.')
        setShowErrorModal(true)
      })
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    navigate('/')
  }

  const handleErrorModalClose = () => {
    setShowErrorModal(false)
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-white/50 backdrop-blur-sm">
          <SignupHeader />

          <div className="space-y-6">
            <section>
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-gray-300"></span> 계정 정보
              </h3>
              <NameInputSection
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                error={nicknameError}
                requirements={nicknameRequirements}
              />
              <EmailInputSection
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={emailError}
                requirements={emailRequirements}
              />
              <PasswordInputSection
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                requirements={passwordRequirements}
              />
              <ConfirmPasswordInputSection
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={confirmPasswordError}
                requirements={confirmPasswordRequirements}
              />
            </section>

            <section className="pt-2">
              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-gray-300"></span> 서비스 설정
              </h3>
              <FuelTypeInputSection
                value={fuelType}
                onChange={(val) => setFuelType(val)}
                error={fuelTypeError}
              />
              <RadiusInputSection
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
                error={radiusError}
              />

              <h3 className="text-[11px] font-black text-gray-400 uppercase tracking-widest mb-4 mt-6 flex items-center gap-2">
                <span className="w-4 h-[1px] bg-gray-300"></span> 자동차 정보
              </h3>
              <CarInputSection
                brand={brand}
                model={selectedCar}
                onBrandChange={(val) => setBrand(val)}
                onModelChange={(car) => {
                  setSelectedCar(car)
                  if (car?.fuelType) {
                    setFuelType(car.fuelType)
                  }
                }}
              />
            </section>
          </div>

          <div className="mt-10">
            <Button
              className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all duration-300 active:scale-95 text-base font-bold"
              onClick={handleSignup}
            >
              회원가입 완료
            </Button>
          </div>

          <div className="mt-8">
            <SignupFooter />
          </div>
        </div>
      </div>
      <Modal
        isOpen={showSuccessModal}
        onClose={handleSuccessModalClose}
        type="success"
        title="회원가입 성공!"
        message="회원가입이 완료되었습니다. 메인 페이지로 이동합니다."
      />
      <Modal
        isOpen={showErrorModal}
        onClose={handleErrorModalClose}
        type="error"
        title="회원가입 실패"
        message={errorMessage}
      />
    </>
  )
}

export default Signup
