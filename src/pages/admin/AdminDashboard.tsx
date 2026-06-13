import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import type { Election } from '../../types'
import { Vote, Users, CheckCircle, BarChart3, ChevronRight } from 'lucide-react'
import PageHeader from '../../components/PageHeader'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [elections, setElections] = useState<Election[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/elections/').then((res) => {
      setElections(res.data)
    }).finally(() => setLoading(false))
  }, [])

  const stats = {
    total: elections.length,
    active: elections.filter((e) => e.status === 'voting_open').length,
    closed: elections.filter((e) => e.status === 'voting_closed').length,
    results: elections.filter((e) => e.status === 'results').length,
  }

  const statusConfig: Record<string, { label: string; classes: string }> = {
    draft:                { label: 'Draft',                classes: 'bg-gray-100 text-gray-600' },
    applications_open:    { label: 'Applications Open',    classes: 'bg-blue-100 text-blue-700' },
    applications_closed:  { label: 'Applications Closed',  classes: 'bg-purple-100 text-purple-700' },
    voting_open:          { label: 'Voting Open',          classes: 'bg-green-100 text-green-700' },
    voting_closed:        { label: 'Voting Closed',        classes: 'bg-yellow-100 text-yellow-700' },
    results:              { label: 'Results Published',    classes: 'bg-orange-100 text-orange-700' },
    // legacy statuses
    open:                 { label: 'Open',                 classes: 'bg-green-100 text-green-700' },
    closed:               { label: 'Closed',               classes: 'bg-yellow-100 text-yellow-700' },
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar />
      <PageHeader
        title="Admin Dashboard"
        subtitle="Manage elections, candidates, and users"
        breadcrumb="Admin"
      />
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Elections', value: stats.total, icon: Vote, color: 'bg-blue-100 text-blue-600' },
            { label: 'Active Now', value: stats.active, icon: CheckCircle, color: 'bg-green-100 text-green-600' },
            { label: 'Closed', value: stats.closed, icon: Users, color: 'bg-yellow-100 text-yellow-600' },
            { label: 'Results Out', value: stats.results, icon: BarChart3, color: 'bg-purple-100 text-purple-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg border border-gray-100  shadow-sm p-5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <button
  onClick={() => navigate('/admin/elections')}
  className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white rounded-lg p-5 text-left transition-colors"
>
  <Vote size={22} className="mb-3 text-[#c9a84c]" />
  <p className="font-semibold text-sm">Manage Elections</p>
  <p className="text-blue-200 text-xs mt-1">Create elections, add positions, open and close voting</p>
</button>
<button
  onClick={() => navigate('/admin/candidates')}
  className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-lg p-5 text-left transition-colors"
>
  <Users size={22} className="mb-3 text-[#1e3a5f]" />
  <p className="font-semibold text-sm text-gray-900">Manage Candidates</p>
  <p className="text-gray-500 text-xs mt-1">Review and approve candidate applications</p>
</button>
<button
  onClick={() => navigate('/admin/users')}
  className="bg-white hover:bg-gray-50 border border-gray-200 shadow-sm rounded-lg p-5 text-left transition-colors"
>
  <Users size={22} className="mb-3 text-[#1e3a5f]" />
  <p className="font-semibold text-sm text-gray-900">Manage Users</p>
  <p className="text-gray-500 text-xs mt-1">Verify students and manage voter eligibility</p>
</button>
        </div>

        {/* Elections list */}
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Elections</h2>
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : elections.length === 0 ? (
          <div className="text-center py-16 text-gray-400">No elections yet. Create one to get started.</div>
        ) : (
          <div className="grid gap-3">
            {elections.map((election) => (
              <div key={election.id} className="bg-white rounded-lg border border-gray-100 shadow-sm p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-gray-900">{election.title}</h3>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusConfig[election.status].classes}`}>
                      {statusConfig[election.status].label}
                    </span>
                  </div>
                  <div className="flex gap-4 text-xs text-gray-400">
                    <span>{election.positions.length} positions</span>
                    <span>{election.total_voters} voters</span>
                    <span>{election.academic_year}</span>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/admin/elections')}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}