import { useLocation, useNavigate } from 'react-router-dom'
import Button from './Button'

export default function UserMenu({ user }) {
  const navigate = useNavigate()
  const location = useLocation()

  if (!user) {
    return (
      <Button className="ml-2 bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/login')}>
        로그인
      </Button>
    )
  }

  const isMyPage = location.pathname === '/mypage'

  return (
    <div className="flex items-center gap-4 ml-2">
      <div 
        className="flex items-center gap-2 cursor-pointer group"
        onClick={() => navigate('/mypage')}
      >
        <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="font-bold text-gray-700 group-hover:text-blue-600 transition-colors hidden sm:block">
          {user.nickname}님
        </span>
      </div>
      {isMyPage && (
        <Button 
          variant="error-outline"
          className="h-9 px-3 text-xs font-bold border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200" 
          onClick={() => {
            localStorage.removeItem('user')
            localStorage.removeItem('accessToken')
            window.location.reload()
          }}
        >
          로그아웃
        </Button>
      )}
    </div>
  )
}
