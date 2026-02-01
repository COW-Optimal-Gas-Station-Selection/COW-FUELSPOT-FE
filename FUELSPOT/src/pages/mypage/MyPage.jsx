import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { changePassword, deleteAccount, getMyInfo, updateMyInfo } from '../../api/memberService'
import Button from '../../components/Button'
import Modal from '../../components/Modal'
import { validateConfirmPassword, validateNickname, validatePassword } from '../../utils/validation'
import MyPageTitle from './atoms/MyPageTitle'
import DeleteAccountModal from './organisms/DeleteAccountModal'
import EditProfileSection from './organisms/EditProfileSection'
import FavoriteStationsSection from './organisms/FavoriteStationsSection'
import MyPageNavBar from './organisms/MyPageNavBar'
import PasswordChangeModal from './organisms/PasswordChangeModal'

function MyPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [nickname, setNickname] = useState('')
  const [fuelType, setFuelType] = useState('GASOLINE')
  const [radius, setRadius] = useState(3)
  
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

    getMyInfo()
      .then((data) => {
        setUser(data)
        setNickname(data.nickname || '')
        setFuelType(data.fuelType || 'GASOLINE')
        setRadius(data.radius || 3)
        localStorage.setItem('user', JSON.stringify(data))
      })
      .catch((error) => {
        console.error('Failed to fetch user info:', error)
        const userStr = localStorage.getItem('user')
        if (userStr) {
          const userData = JSON.parse(userStr)
          setUser(userData)
          setNickname(userData.nickname || userData.name || '')
          setFuelType(userData.fuelType || 'GASOLINE')
          setRadius(userData.radius || 3)
        } else {
          navigate('/login')
        }
      })
  }, [navigate])

  const nicknameRequirements = validateNickname(nickname)
  const newPasswordRequirements = validatePassword(newPassword)
  const confirmPasswordRequirements = validateConfirmPassword(newPassword, confirmPassword)

  const handleUpdate = () => {
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

    const updateData = {
      nickname: nickname,
      fuelType: fuelType,
      radius: parseInt(radius)
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
            <EditProfileSection 
              nickname={nickname}
              setNickname={setNickname}
              nicknameError={nicknameError}
              nicknameRequirements={nicknameRequirements}
              fuelType={fuelType}
              setFuelType={setFuelType}
              fuelTypeError={fuelTypeError}
              radius={radius}
              setRadius={setRadius}
              radiusError={radiusError}
              handleUpdate={handleUpdate}
              setShowPasswordModal={setShowPasswordModal}
              setShowDeleteConfirmModal={setShowDeleteConfirmModal}
              navigate={navigate}
            />

            {/* Right Panel: Favorites */}
            <div className="bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 md:p-10 border border-gray-100 h-full min-h-[600px] flex flex-col">
              <MyPageTitle title="즐겨찾는 주유소" color="yellow-400" />
              <div className="flex-1">
                <FavoriteStationsSection />
              </div>
            </div>
          </div>
        </div>
      </div>

      <PasswordChangeModal 
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false)
          setPasswordError('')
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
        }}
        currentPassword={currentPassword}
        setCurrentPassword={setCurrentPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        passwordError={passwordError}
        newPasswordRequirements={newPasswordRequirements}
        confirmPasswordRequirements={confirmPasswordRequirements}
        handleChangePassword={handleChangePassword}
      />

      <DeleteAccountModal 
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        handleDeleteAccount={handleDeleteAccount}
      />

      {showErrorModal && (
        <Modal 
          onClose={() => setShowErrorModal(false)}
          title="오류 발생"
        >
          <div className="text-center">
            <p className="text-red-500 mb-6">{errorMessage}</p>
            <Button onClick={() => setShowErrorModal(false)} variant="primary" className="w-full">
              확인
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}

export default MyPage
