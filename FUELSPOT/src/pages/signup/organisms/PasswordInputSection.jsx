import ErrorMessage from '../atoms/ErrorMessage'
import Label from '../atoms/Label'
import RequirementItem from '../atoms/RequirementItem'
import PasswordInputWithToggle from '../molecules/PasswordInputWithToggle'

function PasswordInputSection({ value, onChange, error, requirements }) {
  return (
    <div className="mb-4">
      <Label htmlFor="password">비밀번호</Label>
      <PasswordInputWithToggle
        id="password"
        value={value}
        onChange={onChange}
      />
      <div className="mt-3 p-4 bg-gray-50/80 rounded-xl space-y-2 border border-gray-100">
        <RequirementItem isMet={requirements.isLengthValid} text="최소 8자" />
        <RequirementItem isMet={requirements.isComplexValid} text="영문, 숫자, 특수문자 3가지 조합" />
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default PasswordInputSection
