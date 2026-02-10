import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { signup } from '../../../api/memberService'
import Button from '../../../components/Button'
import {
    validateConfirmPassword,
    validateEmail,
    validateNickname,
    validatePassword
} from '../../../utils/validation'
import ConfirmPasswordInputSection from '../../signup/organisms/ConfirmPasswordInputSection'
import EmailInputSection from '../../signup/organisms/EmailInputSection'
import FuelTypeInputSection from '../../signup/organisms/FuelTypeInputSection'
import NameInputSection from '../../signup/organisms/NameInputSection'
import PasswordInputSection from '../../signup/organisms/PasswordInputSection'
import RadiusInputSection from '../../signup/organisms/RadiusInputSection'
import SignupHeader from '../../signup/organisms/SignupHeader'

export default function SignupModal({ isOpen, onClose, onSignupSuccess, onLoginClick }) {
    const [nickname, setNickname] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [fuelType, setFuelType] = useState('GASOLINE')
    const [radius, setRadius] = useState(3)

    const [nicknameError, setNicknameError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')
    const [fuelTypeError, setFuelTypeError] = useState('')
    const [radiusError, setRadiusError] = useState('')
    const [globalError, setGlobalError] = useState('')

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
        setGlobalError('')

        if (!nickname.trim()) { setNicknameError('닉네임을 입력해주세요'); return }
        if (nickname.length < 2 || nickname.length > 10) { setNicknameError('닉네임은 2자 이상 10자 이하이어야 합니다'); return }
        if (!email.trim()) { setEmailError('이메일을 입력해주세요'); return }
        if (!validateEmail(email)) { setEmailError('올바른 이메일 형식이 아닙니다'); return }
        if (!password.trim()) { setPasswordError('비밀번호를 입력해주세요'); return }
        if (password.length < 8 || password.length > 20) { setPasswordError('비밀번호는 8자 이상 20자 이하로 입력해주세요'); return }
        if (!confirmPassword.trim()) { setConfirmPasswordError('비밀번호를 다시 입력해주세요'); return }
        if (password !== confirmPassword) {
            setConfirmPasswordError('비밀번호가 일치하지 않습니다')
            setGlobalError('비밀번호가 일치하지 않습니다.')
            return
        }
        if (!fuelType) { setFuelTypeError('선호 유종을 선택해주세요'); return }
        if (!radius || radius < 1) { setRadiusError('반경은 최소 1km 이상이어야 합니다'); return }

        const signupData = {
            email,
            password,
            checkPassword: confirmPassword,
            nickname,
            fuelType,
            radius: parseInt(radius)
        }

        signup(signupData)
            .then(() => {
                alert('회원가입이 완료되었습니다. 로그인해주세요.')
                if (onSignupSuccess) onSignupSuccess()
                onClose()
            })
            .catch((error) => {
                console.error('Signup error:', error)
                setGlobalError(error.message || '회원가입 중 오류가 발생했습니다.')
            })
    }

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-[100]" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 md:p-8 text-left align-middle shadow-xl transition-all border border-gray-100">
                                <div className="mb-6">
                                    <SignupHeader />
                                </div>

                                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1 -mr-2 custom-scrollbar">
                                    <div className="space-y-4 pt-1">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            계정 정보
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
                                    </div>

                                    <div className="space-y-4 pt-4 border-t border-gray-50">
                                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                            서비스 설정
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
                                    </div>
                                </div>

                                {globalError && (
                                    <p className="text-red-500 text-sm font-medium text-center mt-4">{globalError}</p>
                                )}

                                <div className="mt-6">
                                    <Button
                                        className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all duration-300 active:scale-95 text-base font-bold"
                                        onClick={handleSignup}
                                    >
                                        회원가입 완료
                                    </Button>
                                </div>

                                <div className="mt-4 text-center text-sm text-gray-500">
                                    이미 계정이 있으신가요? <button onClick={onLoginClick} className="text-blue-600 font-bold hover:underline">로그인</button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
