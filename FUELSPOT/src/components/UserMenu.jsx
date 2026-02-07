import { useNavigate } from 'react-router-dom'
import { logout } from '../api/memberService'

const linkClass = 'text-blue-900 font-bold text-sm md:text-lg cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 whitespace-nowrap';

export default function UserMenu({ user }) {
  const navigate = useNavigate()

  if (!user) {
    return (
      <span
        role="button"
        tabIndex={0}
        onClick={() => navigate('/login')}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate('/login'); } }}
        className={`ml-2 ${linkClass}`}
      >
        로그인
      </span>
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
    <div className="flex items-center gap-4 ml-2">
      <div 
        className="flex items-center gap-3 cursor-pointer group"
        onClick={() => navigate('/mypage')}
      >
        <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <span className="font-bold text-base text-gray-700 group-hover:text-blue-600 transition-colors hidden sm:block">
          {(user.nickname || user.name)}님
        </span>
      </div>
      <span
        role="button"
        tabIndex={0}
        onClick={handleLogout}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleLogout(); } }}
        className={linkClass}
      >
        로그아웃
      </span>
    </div>
  )
}
