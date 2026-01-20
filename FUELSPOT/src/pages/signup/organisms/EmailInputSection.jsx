import EmailIcon from '../atoms/EmailIcon'
import ErrorMessage from '../atoms/ErrorMessage'
import Label from '../atoms/Label'
import RequirementItem from '../atoms/RequirementItem'
import InputWithIcon from '../molecules/InputWithIcon'

function EmailInputSection({ value, onChange, error, requirements }) {
  return (
    <div className="mb-4">
      <Label htmlFor="email">이메일</Label>
      <InputWithIcon
        icon={EmailIcon}
        id="email"
        type="email"
        placeholder="example@email.com"
        value={value}
        onChange={onChange}
      />
      <div className="mt-2.5 ml-1">
        <RequirementItem isMet={requirements.isEmailFormat} text="올바른 이메일 형식" />
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default EmailInputSection
