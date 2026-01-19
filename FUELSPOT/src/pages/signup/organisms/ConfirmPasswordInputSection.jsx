import Label from '../atoms/Label'
import ErrorMessage from '../atoms/ErrorMessage'
import PasswordInputWithToggle from '../molecules/PasswordInputWithToggle'

function ConfirmPasswordInputSection({ value, onChange, error }) {
  return (
    <div className="mb-6">
      <Label htmlFor="confirmPassword">비밀번호 확인</Label>
      <PasswordInputWithToggle
        value={value}
        onChange={onChange}
      />
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default ConfirmPasswordInputSection
