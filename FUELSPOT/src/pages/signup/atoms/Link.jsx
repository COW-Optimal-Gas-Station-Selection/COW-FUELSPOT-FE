import { Link as RouterLink } from 'react-router-dom'

function Link({ children, to, className = "" }) {
  return (
    <RouterLink to={to} className={`text-sm text-gray-600 hover:text-gray-900 ${className}`}>
      {children}
    </RouterLink>
  )
}

export default Link
