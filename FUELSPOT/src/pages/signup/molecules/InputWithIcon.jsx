import Input from '../../../components/Input'
import UserIcon from '../atoms/UserIcon'

function InputWithIcon({ icon: Icon = UserIcon, value, onChange, placeholder, type = "text", className = "", ...props }) {
  return (
    <div className="relative group">
      <div className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200">
        <Icon className="w-5 h-5" />
      </div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`pl-11 h-11 bg-gray-50/50 border-gray-200 focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all duration-200 ${className}`}
        {...props}
      />
    </div>
  )
}

export default InputWithIcon
