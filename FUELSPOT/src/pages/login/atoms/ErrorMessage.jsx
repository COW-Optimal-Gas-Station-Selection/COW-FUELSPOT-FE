function ErrorMessage({ children }) {
  if (!children) return null
  
  return (
    <p className="text-red-500 text-sm mt-1">{children}</p>
  )
}

export default ErrorMessage
