import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { deleteAccount, getMyInfo, updateMyInfo } from '../../api/memberService'
import Button from '../../components/Button'
import FuelTypeInputSection from '../signup/organisms/FuelTypeInputSection'
import NameInputSection from '../signup/organisms/NameInputSection'
import RadiusInputSection from '../signup/organisms/RadiusInputSection'
import DeleteConfirmModal from './molecules/DeleteConfirmModal'
import ErrorModal from './molecules/ErrorModal'
import SuccessModal from './molecules/SuccessModal'
import FavoriteStationsSection from './organisms/FavoriteStationsSection'
import MyPageNavBar from './organisms/MyPageNavBar'
import PasswordChangeModal from './organisms/PasswordChangeModal'

function MyPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user')
    try {
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [nickname, setNickname] = useState(user?.nickname || user?.name || '')
  const [fuelType, setFuelType] = useState(user?.fuelType || 'GASOLINE')
  const [radius, setRadius] = useState(user?.radius || 3)
  
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [nicknameError, setNicknameError] = useState('')
  const [fuelTypeError, setFuelTypeError] = useState('')
  const [radiusError, setRadiusError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    // 내 정보 조회 API 연동
    getMyInfo()
      .then((userData) => {
        setUser(userData)
        setNickname(userData.nickname || '')
        setFuelType(userData.fuelType || 'GASOLINE')
        setRadius(userData.radius || 3)
        // 로컬 스토리지 데이터 동기화
        localStorage.setItem('user', JSON.stringify(userData))
      })
      .catch(() => {
        // 로그인 안되어 있으면 로그인 페이지로
        navigate('/login')
      })
  }, [navigate])

  const nicknameRequirements = validateNickname(nickname)
  const newPasswordRequirements = validatePassword(newPassword)
  const confirmPasswordRequirements = validateConfirmPassword(newPassword, confirmPassword)

  const handleUpdate = async () => {
    setNicknameError('')
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

    try {
      const updateData = {
        nickname: nickname,
        fuelType: fuelType,
        radius: parseInt(radius)
      }
      const updatedUser = await updateMyInfo(updateData)
      setUser(updatedUser)
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setShowSuccessModal(true)
    } catch (error) {
      setErrorMessage(error.message || '정보 수정 중 오류가 발생했습니다.')
      setShowErrorModal(true)
    }

    updateMyInfo(updateData)
      .then((data) => {
        setUser(data)
        localStorage.setItem('user', JSON.stringify(data))
        alert('회원 정보가 성공적으로 수정되었습니다.')
      })
      .catch((error) => {
        setErrorMessage(error.message || '정보 수정 중 오류가 발생했습니다.')
        setShowErrorModal(true)
      })
  }

  const handleChangePassword = () => {
    setPasswordError('')

    if (!currentPassword) {
      setPasswordError('현재 비밀번호를 입력해주세요')
      return
    }
    
    if (!newPasswordRequirements.isLengthValid || !newPasswordRequirements.isComplexValid) {
      setPasswordError('비밀번호는 8자 이상이며 영문, 숫자, 특수문자를 포함해야 합니다')
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('새 비밀번호가 일치하지 않습니다')
      return
    }

    changePassword({ currentPassword, newPassword })
      .then(() => {
        setShowPasswordModal(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        alert('비밀번호가 성공적으로 변경되었습니다.')
      })
      .catch((error) => {
        setPasswordError(error.message)
      })
  }

  const handleDeleteAccount = () => {
    deleteAccount()
    deleteAccount()
      .then(() => {
        localStorage.removeItem('user')
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        alert('회원 탈퇴가 완료되었습니다. 그동안 이용해주셔서 감사합니다.')
        navigate('/login')
      })
      .catch((error) => {
        setErrorMessage(error.message)
        setShowErrorModal(true)
      })
      .finally(() => {
        setShowDeleteConfirmModal(false)
      })
  }

  return (
    <>
      <MyPageNavBar user={user} />
      <div className="min-h-screen bg-gray-50 p-4 py-8 md:py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
                회원 정보 수정
              </h2>
              <div className="space-y-8">
                <NameInputSection
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  error={nicknameError}
                  requirements={nicknameRequirements}
                />
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
                <div className="pt-4 flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleUpdate} variant="primary" className="flex-1 h-14 text-lg font-bold">
                    정보 수정하기
                  </Button>
                  <Button onClick={() => navigate('/')} variant="error-outline" className="flex-1 h-14 text-lg font-bold">
                    취소
                  </Button>
                </div>
                <div className="pt-8 border-t border-gray-100 flex justify-center">
                  <button 
                    onClick={() => setShowDeleteConfirmModal(true)}
                    className="text-gray-400 text-sm font-medium hover:text-red-500 hover:underline transition-all"
                  >
                    회원 탈퇴하기
                  </button>
                </div>
              </div>
            </div>
            {/* Right Panel: Favorites */}
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10 border border-gray-100 h-full min-h-[600px] flex flex-col">
              <h2 className="text-xl font-bold text-gray-800 mb-8 flex items-center gap-2">
                <span className="w-1.5 h-6 bg-yellow-400 rounded-full"></span>
                즐겨찾는 주유소
              </h2>
              <div className="flex-1 overflow-y-auto custom-scrollbar min-h-0">
                <FavoriteStationsSection />
              </div>
            </div>
          </div>
        </div>
      </div>
      <SuccessModal open={showSuccessModal} onClose={handleSuccessModalClose} />
      <ErrorModal open={showErrorModal} onClose={() => setShowErrorModal(false)} errorMessage={errorMessage} />
      <DeleteConfirmModal open={showDeleteConfirmModal} onClose={() => setShowDeleteConfirmModal(false)} onDelete={handleDeleteAccount} />
    </>
  )
}

export default MyPage
