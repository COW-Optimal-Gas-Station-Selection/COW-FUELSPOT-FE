import { useState } from 'react'
import Input from '../../../components/Input'
import LockIcon from '../atoms/LockIcon'
import EyeIcon from '../atoms/EyeIcon'
import EyeOffIcon from '../atoms/EyeOffIcon'

function PasswordInputWithToggle({ value, onChange, className = "" }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
        <LockIcon />
      </div>
      <Input
        type={showPassword ? "text" : "password"}
        placeholder="••••••••"
        value={value}
        onChange={onChange}
        className={`pl-10 pr-10 ${className}`}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
      </button>
    </div>
  )
}

export default PasswordInputWithToggle
