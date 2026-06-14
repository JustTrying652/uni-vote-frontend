import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import DashboardPage from './pages/voter/DashboardPage'
import ElectionPage from './pages/voter/ElectionPage'
import BallotPage from './pages/voter/BallotPage'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageElections from './pages/admin/ManageElections'
import ManageCandidates from './pages/admin/ManageCandidates'
import ProtectedRoute from './components/ProtectedRoute'
import ManageUsers from './pages/admin/ManageUsers'
import ApplyPage from './pages/voter/ApplyPage'
import LandingPage from './pages/LandingPage'
import TurnoutPage from './pages/admin/TurnoutPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/elections/:id" element={<ProtectedRoute><ElectionPage /></ProtectedRoute>} />
        <Route path="/elections/:id/ballot" element={<ProtectedRoute><BallotPage /></ProtectedRoute>} />
        <Route path="/elections/:id/apply" element={<ProtectedRoute><ApplyPage /></ProtectedRoute>} />


        <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/elections" element={<ProtectedRoute adminOnly><ManageElections /></ProtectedRoute>} />
        <Route path="/admin/candidates" element={<ProtectedRoute adminOnly><ManageCandidates /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute adminOnly><ManageUsers /></ProtectedRoute>} />
        <Route path="/admin/turnout" element={<ProtectedRoute adminOnly><TurnoutPage /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}