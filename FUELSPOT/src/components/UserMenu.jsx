import { useNavigate } from 'react-router-dom'
import { logout } from '../api/memberService'

const linkClass = 'text-blue-900 font-bold text-base md:text-xl cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 whitespace-nowrap';

export default function UserMenu({ user }) {
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex items-center gap-10 md:gap-12 ml-2">
        <span className={`${linkClass} hidden md:inline`}>Q&A</span>
        <span className={`${linkClass} hidden md:inline`}>유류비계산</span>
        <span
          role="button"
          tabIndex={0}
          onClick={() => navigate('/login')}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/login'); } }}
          className={linkClass}
        >
          로그인
        </span>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      localStorage.removeItem('user')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      window.location.reload()
    }
  }

  return (
    <div className="flex items-center gap-4 md:gap-6 ml-2">
      <span className={`${linkClass} hidden md:inline text-sm md:text-base`}>Q&A</span>
      <span className={`${linkClass} hidden md:inline text-sm md:text-base`}>유류비계산</span>
      <div 
        className="flex items-center gap-1.5 md:gap-2 cursor-pointer group shrink-0"
        onClick={() => navigate('/mypage')}
      >
        <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shrink-0">
          <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="font-bold text-sm md:text-base text-gray-700 group-hover:text-blue-600 transition-colors hidden sm:block truncate max-w-18 md:max-w-20">
          {(user.nickname || user.name)}님
        </span>
      </div>
      <span
        role="button"
        tabIndex={0}
        onClick={handleLogout}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleLogout(); } }}
        className={`${linkClass} text-sm md:text-base whitespace-nowrap`}
      >
        로그아웃
      </span>
    </div>
  )
}
