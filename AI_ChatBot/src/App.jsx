import { Routes, Route } from 'react-router-dom' 
import './App.css'
import StartPage from './pages/StartPage'
import NavBar from './components/NavBar'
import ChatRoom from './pages/ChatRoom'
import FAQ from './pages/FAQ'
import AdminPage from './pages/AdminPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<StartPage/>}/>
        <Route path="/chat" element={<ChatRoom/>}/>
        <Route path="/faq" element={<FAQ/>}/>
        <Route path="/admin" element={<AdminPage/>}/>
      </Routes>
    </>
  )
}

export default App
