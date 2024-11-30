import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import './App.css'
import SignUp from './pages/SignUp';
import ProtectedRoute from "./ProtectedRoute";

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp/>}/>
        <Route path="/dashboard" element={
             <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
