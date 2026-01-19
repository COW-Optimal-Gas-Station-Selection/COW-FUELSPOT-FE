import Link from '../atoms/Link'
import Separator from '../atoms/Separator'

function SignupFooter() {
  return (
    <>
      <Separator />
      <div className="text-center">
        <span className="text-sm text-gray-600">이미 계정이 있으신가요? </span>
        <Link to="/login" className="text-gray-900 font-medium hover:underline">로그인</Link>
      </div>
    </>
  )
}

export default SignupFooter
