import Label from '../atoms/Label'
import ErrorMessage from '../atoms/ErrorMessage'
import PasswordInputWithToggle from '../molecules/PasswordInputWithToggle'

function PasswordInputSection({ value, onChange, error }) {
  return (
    <div className="mb-4">
      <Label htmlFor="password">비밀번호</Label>
      <PasswordInputWithToggle
        value={value}
        onChange={onChange}
      />
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default PasswordInputSection
