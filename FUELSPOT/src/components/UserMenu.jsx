import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../api/memberService';

const linkClass = 'text-blue-900 font-bold text-base md:text-xl cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 whitespace-nowrap';

export default function UserMenu({ user, onLoginClick }) {
  const navigate = useNavigate()

  if (!user) {
    return (
      <div className="flex items-center gap-10 md:gap-12 ml-2">
        <span className={`${linkClass} hidden md:inline`}>Q&A</span>
        <span className={`${linkClass} hidden md:inline`}>유류비계산</span>
        <span
          role="button"
          tabIndex={0}
          onClick={onLoginClick}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onLoginClick(); } }}
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

      <Menu as="div" className="relative inline-block text-left">
        <div>
          <MenuButton className="flex items-center gap-1.5 md:gap-2 cursor-pointer group shrink-0 outline-none">
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-200 shrink-0">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <span className="font-bold text-sm md:text-base text-gray-700 group-hover:text-blue-600 transition-colors hidden sm:block truncate max-w-18 md:max-w-20">
              {(user.nickname || user.name)}님
            </span>
            <svg className="w-3 h-3 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </MenuButton>
        </div>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 mt-2 w-40 origin-top-right divide-y divide-gray-100 rounded-xl bg-white shadow-lg ring-1 ring-black/5 focus:outline-none z-[100]">
            <div className="px-1 py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={() => navigate('/mypage')}
                    className={`${active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors`}
                  >
                    마이페이지
                  </button>
                )}
              </MenuItem>
            </div>
            <div className="px-1 py-1">
              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={handleLogout}
                    className={`${active ? 'bg-red-50 text-red-600' : 'text-gray-700'
                      } group flex w-full items-center rounded-lg px-3 py-2 text-sm font-semibold transition-colors`}
                  >
                    로그아웃
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  )
}

