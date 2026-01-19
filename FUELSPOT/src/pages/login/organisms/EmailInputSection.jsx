import Label from '../atoms/Label'
import ErrorMessage from '../atoms/ErrorMessage'
import InputWithIcon from '../molecules/InputWithIcon'
import EmailIcon from '../atoms/EmailIcon'

function EmailInputSection({ value, onChange, error }) {
  return (
    <div className="mb-4">
      <Label htmlFor="email">이메일</Label>
      <InputWithIcon
        icon={EmailIcon}
        type="email"
        placeholder="example@email.com"
        value={value}
        onChange={onChange}
      />
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default EmailInputSection
