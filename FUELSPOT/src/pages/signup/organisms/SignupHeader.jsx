import FuelspotLogo from '../../../components/FuelspotLogo'

function SignupHeader() {
  return (
    <div className="text-center mb-10">
      <div className="flex justify-center mb-6">
        <FuelspotLogo className="h-24" />
      </div>
      <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-2">시작하기</h1>
      <p className="text-sm text-gray-500 font-medium">FUELSPOT의 새로운 멤버가 되어보세요</p>
    </div>
  )
}

export default SignupHeader
