import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import type { Election } from '../../types'
import { CheckCircle, XCircle, User} from 'lucide-react'
import PageHeader from '../../components/PageHeader'

interface Candidate {
  id: number
  user: {
    full_name: string
    registration_number: string
    faculty: string
  }
  position: number
  manifesto: string
  photo: string | null
  status: 'pending' | 'approved' | 'rejected'
  applied_at: string
}

export default function ManageCandidates() {
  const [elections, setElections] = useState<Election[]>([])
  const [selectedElection, setSelectedElection] = useState<number | null>(null)
  const [candidatesByPosition, setCandidatesByPosition] = useState<Record<number, Candidate[]>>({})
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  useEffect(() => {
    api.get('/elections/').then((res) => {
      setElections(res.data)
      if (res.data.length > 0) setSelectedElection(res.data[0].id)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!selectedElection) return
    const election = elections.find((e) => e.id === selectedElection)
    if (!election) return

    const fetchCandidates = async () => {
      const map: Record<number, Candidate[]> = {}
      await Promise.all(
        election.positions.map(async (position) => {
          const res = await api.get(`/elections/positions/${position.id}/candidates/`)
          map[position.id] = res.data
        })
      )
      setCandidatesByPosition(map)
    }
    fetchCandidates()
  }, [selectedElection, elections])

  const handleApproval = async (candidateId: number, action: 'approve' | 'reject') => {
    setActionLoading(candidateId)
    try {
      await api.post(`/elections/candidates/${candidateId}/approval/`, { action })
      // Refresh candidates
      const election = elections.find((e) => e.id === selectedElection)
      if (!election) return
      const map: Record<number, Candidate[]> = {}
      await Promise.all(
        election.positions.map(async (position) => {
          const res = await api.get(`/elections/positions/${position.id}/candidates/`)
          map[position.id] = res.data
        })
      )
      setCandidatesByPosition(map)
    } catch (err) {
      console.error(err)
    } finally {
      setActionLoading(null)
    }
  }

  const selectedElectionData = elections.find((e) => e.id === selectedElection)
  const allCandidates = Object.values(candidatesByPosition).flat()
  const pending = allCandidates.filter((c) => c.status === 'pending').length
  const approved = allCandidates.filter((c) => c.status === 'approved').length
  const rejected = allCandidates.filter((c) => c.status === 'rejected').length

  const statusBadge = (status: Candidate['status']) => {
    const config = {
      pending:  'bg-yellow-100 text-yellow-700',
      approved: 'bg-green-100 text-green-700',
      rejected: 'bg-red-100 text-red-700',
    }
    return (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${config[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar />
        <PageHeader
          title="Manage Candidates"
          subtitle="Review and manage candidate applications for each election"
          breadcrumb="Administration . Candidates"
        />
      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Election selector */}
        

        {/* Stats */}
        {!loading && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Pending Review', value: pending, classes: 'bg-yellow-50 border-yellow-200 text-yellow-700' },
              { label: 'Approved', value: approved, classes: 'bg-green-50 border-green-200 text-green-700' },
              { label: 'Rejected', value: rejected, classes: 'bg-red-50 border-red-200 text-red-700' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl border p-4 ${stat.classes}`}>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        )}
        {selectedElectionData && (
  <div className="flex items-center gap-3 mb-6">
    <h2 className="text-base font-semibold text-gray-900">{selectedElectionData.title}</h2>
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
      {
        draft:                'bg-gray-100 text-gray-600',
        applications_open:    'bg-blue-100 text-blue-700',
        applications_closed:  'bg-purple-100 text-purple-700',
        voting_open:          'bg-green-100 text-green-700',
        voting_closed:        'bg-yellow-100 text-yellow-700',
        results:              'bg-orange-100 text-orange-700',
      }[selectedElectionData.status]
    }`}>
      {{
        draft:                'Draft',
        applications_open:    'Applications Open',
        applications_closed:  'Applications Closed',
        voting_open:          'Voting Open',
        voting_closed:        'Voting Closed',
        results:              'Results Published',
      }[selectedElectionData.status]}
    </span>
    {selectedElectionData.status === 'applications_open' && (
      <span className="text-xs text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
        Applications are open — new candidates may apply
      </span>
    )}
    {selectedElectionData.status === 'voting_open' && (
      <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
        Voting is live
      </span>
    )}
  </div>
)}
        {/* Candidates by position */}
        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : !selectedElectionData ? (
          <div className="text-center py-16 text-gray-400">No elections found.</div>
        ) : (
          <div className="space-y-6">
            {selectedElectionData.positions.map((position) => {
              const candidates = candidatesByPosition[position.id] ?? []
              return (
                <div key={position.id} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{position.title}</h3>
                    <span className="text-xs text-gray-400">{candidates.length} applicant{candidates.length !== 1 ? 's' : ''}</span>
                  </div>

                  {candidates.length === 0 ? (
                    <p className="text-sm text-gray-400 py-4 text-center">No applications yet for this position.</p>
                  ) : (
                    <div className="space-y-3">
                      {candidates.map((candidate) => (
                        <div key={candidate.id} className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-gray-50">
  <div className="flex items-start gap-3 flex-1 min-w-0">
    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
      {candidate.photo ? (
        <img src={candidate.photo} className="w-12 h-12 rounded-full object-cover" />
      ) : (
        <User size={20} className="text-blue-500" />
      )}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex flex-wrap items-center gap-2 mb-1">
        <p className="font-medium text-gray-900">{candidate.user.full_name}</p>
        {statusBadge(candidate.status)}
      </div>
      <p className="text-xs text-gray-500 mb-2">
        {candidate.user.registration_number} · {candidate.user.faculty.toUpperCase()}
      </p>
      <p className="text-sm text-gray-600 line-clamp-2">{candidate.manifesto}</p>
      <p className="text-xs text-gray-400 mt-1">
        Applied {new Date(candidate.applied_at).toLocaleDateString()}
      </p>
    </div>
  </div>

  <div className="flex gap-2 sm:flex-col ml-15 sm:ml-0">
    {candidate.status === 'pending' && (
      <>
        <button
          onClick={() => handleApproval(candidate.id, 'approve')}
          disabled={actionLoading === candidate.id}
          className="flex items-center gap-1.5 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          <CheckCircle size={14} />
          Approve
        </button>
        <button
          onClick={() => handleApproval(candidate.id, 'reject')}
          disabled={actionLoading === candidate.id}
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
        >
          <XCircle size={14} />
          Reject
        </button>
      </>
    )}
    {candidate.status === 'approved' && (
      <button
        onClick={() => handleApproval(candidate.id, 'reject')}
        disabled={actionLoading === candidate.id}
        className="flex items-center gap-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
      >
        <XCircle size={14} />
        Revoke
      </button>
    )}
  </div>
</div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}