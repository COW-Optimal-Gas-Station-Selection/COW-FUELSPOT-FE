import { useNavigate } from 'react-router-dom'
import FuelspotLogo from '../../../components/FuelspotLogo'
import UserMenu from '../../../components/UserMenu'

export default function MyPageNavBar({ user }) {
  const navigate = useNavigate()

  return (
    <header className="bg-white/90 backdrop-blur-sm py-2 md:py-4 shadow-sm z-50 sticky top-0">
      <div className="max-w-[1248px] mx-auto flex flex-row items-center justify-between w-full px-3 md:px-8 gap-2 min-w-0">
        <div className="flex items-center gap-2 md:gap-3 cursor-pointer min-w-0 shrink" onClick={() => navigate('/')}>
          <FuelspotLogo className="shrink-0 h-14 md:h-28 w-auto" />
          <div className="flex flex-col transition-transform duration-200 hover:-translate-y-0.5 min-w-0">
            <h1 className="text-xl md:text-4xl font-bold text-blue-900 tracking-tight whitespace-nowrap truncate">FUELSPOT</h1>
            <p className="text-xs md:text-lg font-semibold text-blue-900 tracking-wide whitespace-nowrap truncate italic">최적의 주유소 찾기 서비스</p>
          </div>
        </div>
        <div className="mr-3 md:mr-0 shrink-0">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}
