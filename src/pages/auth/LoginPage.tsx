import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import api from '../../api/axios'
import { Shield } from 'lucide-react'

export default function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ registration_number: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await api.post('/auth/login/', form)
      setAuth(data.user, data.access, data.refresh)
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#1e3a5f] flex-col justify-between p-12 relative overflow-hidden">
        {/* Background circles */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-white rounded-full"
              style={{
                width: `${(i + 1) * 150}px`,
                height: `${(i + 1) * 150}px`,
                bottom: '-10%',
                right: '-10%',
              }}
            />
          ))}
        </div>

        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 bg-white/10 rounded flex items-center justify-center">
            <div className="w-1 h-4 bg-[#c9a84c] rounded-sm mr-0.5" />
            <div className="flex flex-col gap-0.5">
              <div className="w-3 h-0.5 bg-white rounded-sm" />
              <div className="w-2 h-0.5 bg-white rounded-sm" />
              <div className="w-2.5 h-0.5 bg-white rounded-sm" />
            </div>
          </div>
          <div>
            <p className="font-bold text-white text-sm"></p>
            <p className="text-blue-300 text-xs">Electoral System</p>
          </div>
        </Link>

        <div className="relative z-10">
          <div className="border-l-4 border-[#c9a84c] pl-5 mb-8">
            <h2 className="text-3xl font-bold text-white leading-snug">
              Your Vote,<br />Your Voice.
            </h2>
            <p className="text-blue-200 text-sm mt-2">
              Digital elections for modern universities.
            </p>
          </div>

          <div className="space-y-4">
            {[
              'Verified student participation only',
              'One person, one vote — always enforced',
              'Full audit trail for every action',
            ].map((point) => (
              <div key={point} className="flex items-center gap-3">
                <div className="w-5 h-5 bg-[#c9a84c] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-blue-100 text-sm">{point}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 relative z-10">
          <Shield size={14} className="text-blue-400" />
          <p className="text-blue-400 text-xs">Secured & encrypted</p>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center min-h-screen p-6 bg-[#f8f9fb]">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#1e3a5f] rounded flex items-center justify-center">
              <div className="w-1 h-3 bg-[#c9a84c] rounded-sm mr-0.5" />
              <div className="flex flex-col gap-0.5">
                <div className="w-2.5 h-0.5 bg-white rounded-sm" />
                <div className="w-2 h-0.5 bg-white rounded-sm" />
                <div className="w-2 h-0.5 bg-white rounded-sm" />
              </div>
            </div>
            <span className="font-bold text-[#1e3a5f] text-sm">UniVote</span>
          </Link>

          <h1 className="text-2xl font-bold text-[#1e3a5f] mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to access your electoral portal</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded px-4 py-3 text-sm mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Registration Number
              </label>
              <input
                type="text"
                placeholder="e.g. SCT211-0001/2023"
                value={form.registration_number}
                onChange={(e) => setForm({ ...form, registration_number: e.target.value })}
                className="w-full border border-gray-300 bg-white rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full border border-gray-300 bg-white rounded px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-50 text-white font-semibold rounded py-2.5 text-sm transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            No account yet?{' '}
            <Link to="/register" className="text-[#1e3a5f] font-semibold hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}