import { useNavigate } from 'react-router-dom'
import FuelspotLogo from '../../../components/FuelspotLogo'
import UserMenu from '../../../components/UserMenu'

export default function MyPageNavBar({ user }) {
  const navigate = useNavigate()

  return (
    <header className="bg-white py-6 shadow-sm z-10 sticky top-0">
      <div className="max-w-[1248px] mx-auto flex flex-row items-center w-full px-4 md:px-8">
        <FuelspotLogo 
          className="flex-shrink-0 cursor-pointer" 
          onClick={() => navigate('/')} 
        />
        <div className="flex flex-1 items-center justify-end ml-6">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  )
}
