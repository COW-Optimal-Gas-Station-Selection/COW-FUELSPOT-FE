import { Link } from 'react-router-dom'
import Separator from '../atoms/Separator'

function LoginFooter() {
  return (
    <>
      <div className="text-center mb-6">
        <a href="#" className="text-sm text-gray-600 hover:text-gray-900">비밀번호를 잊으셨나요?</a>
      </div>
      <Separator />
      <div className="text-center">
        <span className="text-sm text-gray-600">계정이 없으신가요? </span>
        <Link to="/signup" className="text-sm text-gray-900 font-medium hover:underline">회원가입</Link>
      </div>
    </>
  )
}

export default LoginFooter
