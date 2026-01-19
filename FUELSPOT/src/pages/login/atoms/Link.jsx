function Link({ children, href = "#", className = "" }) {
  return (
    <a href={href} className={`text-sm text-gray-600 hover:text-gray-900 ${className}`}>
      {children}
    </a>
  )
}

export default Link
