import { useNavigate } from 'react-router-dom'
import Button from '../../../components/Button'

export default function UserMenu({ user }) {
  const navigate = useNavigate()

  if (!user) {
    return (
      <Button className="ml-2 bg-blue-600 hover:bg-blue-700" onClick={() => navigate('/login')}>
        로그인
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-2 ml-2">
      <span className="font-semibold text-blue-700">{user.name}</span>
      <Button className="ml-1 bg-blue-600 hover:bg-blue-700" onClick={() => alert('마이페이지는 준비중입니다.')}>마이페이지</Button>
    </div>
  )
}
