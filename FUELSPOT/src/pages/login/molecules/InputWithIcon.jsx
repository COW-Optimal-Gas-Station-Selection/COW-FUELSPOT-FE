import Input from '../../../components/Input'
import EmailIcon from '../atoms/EmailIcon'

function InputWithIcon({ icon: Icon = EmailIcon, value, onChange, placeholder, type = "text", className = "" }) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <Icon />
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pl-10 ${className}`}
      />
    </div>
  )
}

export default InputWithIcon
