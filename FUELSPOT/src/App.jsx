import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import Signup from './pages/signup/Signup'
import Main from './main/page/Main'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/main" element={<Main />} />
      </Routes>
    </Router>
  )
}

export default App
