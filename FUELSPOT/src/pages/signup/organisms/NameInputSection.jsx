import Label from '../atoms/Label'
import ErrorMessage from '../atoms/ErrorMessage'
import InputWithIcon from '../molecules/InputWithIcon'
import UserIcon from '../atoms/UserIcon'

function NameInputSection({ value, onChange, error }) {
  return (
    <div className="mb-4">
      <Label htmlFor="name">이름</Label>
      <InputWithIcon
        icon={UserIcon}
        type="text"
        placeholder="홍길동"
        value={value}
        onChange={onChange}
      />
      <ErrorMessage>{error}</ErrorMessage>
    </div>
  )
}

export default NameInputSection
