import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogOut, Vote, LayoutDashboard, Settings, Users, BarChart3 } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#1e3a5f] rounded flex items-center justify-center flex-shrink-0">
              <div className="w-1 h-4 bg-[#c9a84c] rounded-sm mr-0.5" />
              <div className="flex flex-col gap-0.5">
                <div className="w-3 h-0.5 bg-white rounded-sm" />
                <div className="w-2 h-0.5 bg-white rounded-sm" />
                <div className="w-2.5 h-0.5 bg-white rounded-sm" />
              </div>
            </div>
            <div>
              <span className="font-bold text-[#1e3a5f] text-sm tracking-wide">UniVote</span>
              <span className="hidden sm:block text-xs text-gray-400 leading-none">Electoral System</span>
            </div>
          </Link>

          {/* Nav links */}
          <div className="flex items-center gap-0.5 overflow-x-auto">
            {user?.role === 'admin' ? (
              <>
                {[
                  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
                  { to: '/admin/elections', label: 'Elections', icon: Vote },
                  { to: '/admin/candidates', label: 'Candidates', icon: Settings },
                  { to: '/admin/users', label: 'Users', icon: Users },
                  { to: '/admin/turnout', label: 'Turnout', icon: BarChart3 },
                ].map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center gap-1 px-2 py-1.5 rounded text-sm text-gray-600 hover:text-[#1e3a5f] hover:bg-blue-50 transition-colors whitespace-nowrap"
                  >
                    <Icon size={13} />
                    <span className="hidden md:inline">{label}</span>
                  </Link>
                ))}
              </>
            ) : (
              <Link
                to="/dashboard"
                className="flex items-center gap-1.5 px-2 py-1.5 rounded text-sm text-gray-600 hover:text-[#1e3a5f] hover:bg-blue-50 transition-colors"
              >
                <LayoutDashboard size={14} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
            )}
          </div>

          {/* User info */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-gray-800">{user?.full_name}</p>
              <p className="text-xs text-gray-400">{user?.registration_number}</p>
            </div>
            <div className="w-8 h-8 bg-[#1e3a5f] rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-semibold text-xs">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}