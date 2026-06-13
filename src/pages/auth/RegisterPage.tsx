import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../../api/axios'
import { Shield, CheckCircle } from 'lucide-react'

const FACULTIES = [
  { value: 'engineering', label: 'Engineering' },
  { value: 'business', label: 'Business' },
  { value: 'science', label: 'Science' },
  { value: 'arts', label: 'Arts & Humanities' },
  { value: 'health', label: 'Health Sciences' },
  { value: 'ict', label: 'ICT' },
]

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    registration_number: '', email: '', first_name: '', last_name: '',
    faculty: '', course: '', year_of_study: '1', password: '', password2: '',
  })
  const [error, setError] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError({})
    setLoading(true)
    try {
      await api.post('/auth/register/', { ...form, year_of_study: parseInt(form.year_of_study) })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data || {})
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center p-6">
        <div className="bg-white rounded-lg border border-gray-100 shadow-sm w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-[#1e3a5f] mb-2">Registration Successful</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your account has been created and is pending verification by the electoral commission before you can vote.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white px-6 py-2.5 rounded text-sm font-medium transition-colors"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex">

      {/* Left panel */}
      <div className="hidden lg:flex lg:w-2/5 bg-[#1e3a5f] flex-col justify-between p-12 relative overflow-hidden">
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
            <p className="font-bold text-white text-sm">UniVote</p>
            <p className="text-blue-300 text-xs">Electoral System</p>
          </div>
        </Link>

        <div className="relative z-10">
          <div className="border-l-4 border-[#c9a84c] pl-5 mb-8">
            <h2 className="text-3xl font-bold text-white leading-snug">
              Join the<br />democratic<br />process.
            </h2>
            <p className="text-blue-200 text-sm mt-2">
              Register once. Vote whenever elections are open.
            </p>
          </div>
          <div className="space-y-3">
            {[
              'Takes less than 2 minutes',
              'Your data is secure and private',
              'Verified by your electoral commission',
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
      <div className="w-full lg:w-3/5 flex items-center justify-center p-8 bg-[#f8f9fb]">
        <div className="w-full max-w-lg">

          <Link to="/" className="flex items-center gap-2 mb-6 lg:hidden">
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

          <h1 className="text-2xl font-bold text-[#1e3a5f] mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">Register to participate in student elections</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">First Name</label>
                <input type="text" value={form.first_name} onChange={(e) => set('first_name', e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" required />
                {error.first_name && <p className="text-red-500 text-xs mt-1">{error.first_name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Last Name</label>
                <input type="text" value={form.last_name} onChange={(e) => set('last_name', e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" required />
                {error.last_name && <p className="text-red-500 text-xs mt-1">{error.last_name}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Registration Number</label>
              <input type="text" placeholder="e.g. SCT211-0001/2023" value={form.registration_number}
                onChange={(e) => set('registration_number', e.target.value)}
                className="w-full border border-gray-300 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" required />
              {error.registration_number && <p className="text-red-500 text-xs mt-1">{error.registration_number}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)}
                className="w-full border border-gray-300 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" required />
              {error.email && <p className="text-red-500 text-xs mt-1">{error.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Faculty</label>
                <select value={form.faculty} onChange={(e) => set('faculty', e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" required>
                  <option value="">Select faculty</option>
                  {FACULTIES.map((f) => <option key={f.value} value={f.value}>{f.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Year of Study</label>
                <select value={form.year_of_study} onChange={(e) => set('year_of_study', e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]">
                  {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Course</label>
              <input type="text" placeholder="e.g. Computer Science" value={form.course}
                onChange={(e) => set('course', e.target.value)}
                className="w-full border border-gray-300 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Password</label>
                <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" required />
                {error.password && <p className="text-red-500 text-xs mt-1">{error.password}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Confirm Password</label>
                <input type="password" value={form.password2} onChange={(e) => set('password2', e.target.value)}
                  className="w-full border border-gray-300 bg-white rounded px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]" required />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-[#1e3a5f] hover:bg-[#162d4a] disabled:opacity-50 text-white font-semibold rounded py-2.5 text-sm transition-colors mt-2">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-[#1e3a5f] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}