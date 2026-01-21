import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Login from './pages/login/Login'
import MainPage from './pages/mainpage/MainPage'
import MyPage from './pages/mypage/MyPage'
import Signup from './pages/signup/Signup'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
    </Router>
  )
}

export default App
