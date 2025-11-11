import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import HomePage from './pages/HomePage'
import CreateCrewmate from './pages/CreateCrewmate'
import CrewmateDetail from './pages/CrewmateDetail'
import EditCrewmate from './pages/EditCrewmate'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreateCrewmate />} />
        <Route path="/crewmate/:id" element={<CrewmateDetail />} />
        <Route path="/edit/:id" element={<EditCrewmate />} />
      </Routes>
    </Router>
  )
}

export default App
