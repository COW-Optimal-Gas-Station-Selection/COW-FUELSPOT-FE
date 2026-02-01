import ErrorMessage from '../atoms/ErrorMessage'
import Label from '../atoms/Label'
import RequirementItem from '../atoms/RequirementItem'
import PasswordInputWithToggle from '../molecules/PasswordInputWithToggle'

function ConfirmPasswordInputSection({ value, onChange, error, requirements, label = "비밀번호 확인" }) {
  return (
    <div className="mb-6">
      <Label htmlFor="confirmPassword">{label}</Label>
      <PasswordInputWithToggle
        id="confirmPassword"
        value={value}
        onChange={onChange}
      />
      <div className="mt-3 p-3 bg-gray-50/80 rounded-xl border border-gray-100">
        <RequirementItem isMet={requirements?.isMatch} text="비밀번호 일치" />
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default ConfirmPasswordInputSection
