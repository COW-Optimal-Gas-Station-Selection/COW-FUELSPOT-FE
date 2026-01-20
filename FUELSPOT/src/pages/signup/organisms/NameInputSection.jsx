import ErrorMessage from '../atoms/ErrorMessage'
import Label from '../atoms/Label'
import RequirementItem from '../atoms/RequirementItem'
import UserIcon from '../atoms/UserIcon'
import InputWithIcon from '../molecules/InputWithIcon'

function NameInputSection({ value, onChange, error, requirements }) {
  return (
    <div className="mb-4">
      <Label htmlFor="name">닉네임</Label>
      <InputWithIcon
        icon={UserIcon}
        id="name"
        type="text"
        placeholder="닉네임을 입력하세요"
        value={value}
        onChange={onChange}
      />
      <div className="mt-2.5 ml-1">
        <RequirementItem isMet={requirements.isLengthValid} text="2~10자 이내" />
      </div>
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default NameInputSection
