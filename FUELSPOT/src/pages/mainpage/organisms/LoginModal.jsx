import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { login } from '../../../api/memberService'
import Button from '../../../components/Button'
import EmailInputSection from '../../login/organisms/EmailInputSection'
import LoginHeader from '../../login/organisms/LoginHeader'
import PasswordInputSection from '../../login/organisms/PasswordInputSection'

export default function LoginModal({ isOpen, onClose, onLoginSuccess, onSignupClick, onFindPasswordClick }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [emailError, setEmailError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [globalError, setGlobalError] = useState('')

    const validateEmail = (email) => {
        return email.includes('@') && email.includes('.')
    }

    const handleLogin = () => {
        setEmailError('')
        setPasswordError('')
        setGlobalError('')

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

        const loginData = { email, password }

        login(loginData)
            .then((result) => {
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

                    if (onLoginSuccess) onLoginSuccess(user)
                    onClose()
                }
            })
            .catch((error) => {
                console.error('Login error:', error)
                setGlobalError(error.message || '아이디 또는 비밀번호가 올바르지 않습니다.')
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-8 text-left align-middle shadow-xl transition-all border border-gray-100">
                                <div className="text-center mb-8">
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

                                    {globalError && (
                                        <p className="text-red-500 text-sm font-medium text-center">{globalError}</p>
                                    )}

                                    <div className="pt-2">
                                        <Button
                                            className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-[0.97] font-bold text-lg"
                                            onClick={handleLogin}
                                        >
                                            로그인
                                        </Button>
                                    </div>

                                    <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-100">
                                        <button
                                            onClick={onFindPasswordClick}
                                            className="hover:text-blue-600 transition-colors"
                                        >
                                            비밀번호 찾기
                                        </button>
                                        <button
                                            onClick={onSignupClick}
                                            className="text-blue-600 font-bold hover:text-blue-700 transition-colors"
                                        >
                                            회원가입
                                        </button>
                                    </div>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    )
}
