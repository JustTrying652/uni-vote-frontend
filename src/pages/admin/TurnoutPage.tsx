import { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import type { Election } from '../../types'
import PageHeader from '../../components/PageHeader'
import { ChevronDown } from 'lucide-react'

const facultyLabel: Record<string, string> = {
  engineering: 'Engineering',
  business: 'Business',
  science: 'Science',
  arts: 'Arts & Humanities',
  health: 'Health Sciences',
  ict: 'ICT',
}

export default function TurnoutPage() {
  const [elections, setElections] = useState<Election[]>([])
  const [selectedElectionId, setSelectedElectionId] = useState<number | null>(null)
  const [turnout, setTurnout] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [turnoutLoading, setTurnoutLoading] = useState(false)

  useEffect(() => {
    api.get('/elections/').then((res) => {
      const eligible = res.data.filter((e: Election) =>
        ['voting_open', 'voting_closed', 'results'].includes(e.status)
      )
      setElections(eligible)
      if (eligible.length > 0) {
        setSelectedElectionId(eligible[0].id)
      }
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!selectedElectionId) return
    setTurnoutLoading(true)
    setTurnout(null)
    api.get(`/elections/${selectedElectionId}/turnout/`).then((res) => {
      setTurnout(res.data)
    }).finally(() => setTurnoutLoading(false))
  }, [selectedElectionId])

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      <Navbar />
      <PageHeader
        title="Voter Turnout"
        subtitle="Participation breakdown by faculty and year of study"
        breadcrumb="Administration · Turnout"
      />
      <div className="max-w-5xl mx-auto px-6 py-8">

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : elections.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-12 text-center text-gray-400">
            <p className="text-sm">No elections in voting or results phase yet.</p>
          </div>
        ) : (
          <>
            {/* Election selector */}
            <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-4 mb-6 flex items-center gap-4">
              <label className="text-sm font-medium text-gray-700 whitespace-nowrap">Election</label>
              <div className="relative flex-1 max-w-sm">
                <select
                  value={selectedElectionId ?? ''}
                  onChange={(e) => setSelectedElectionId(Number(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#1e3a5f] bg-white"
                >
                  {elections.map((e) => (
                    <option key={e.id} value={e.id}>{e.title} · {e.academic_year}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {turnoutLoading ? (
              <div className="text-center py-16 text-gray-400">Loading turnout data...</div>
            ) : turnout ? (
              <div className="space-y-6">

                {/* Summary cards */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: 'Voters Participated', value: turnout.total_voters, color: 'text-[#1e3a5f]' },
                    { label: 'Eligible Voters', value: turnout.total_registered, color: 'text-gray-700' },
                    { label: 'Turnout Rate', value: `${turnout.turnout_percentage}%`, color: 'text-[#c9a84c]' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 text-center">
                      <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                      <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Overall progress bar */}
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900">Overall Participation</h3>
                    <span className="text-sm font-bold text-[#1e3a5f]">{turnout.turnout_percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-3">
                    <div
                      className="bg-[#1e3a5f] h-3 rounded-full transition-all duration-700"
                      style={{ width: `${turnout.turnout_percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>0</span>
                    <span>{turnout.total_registered} eligible</span>
                  </div>
                </div>

                {/* Breakdowns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  {/* Faculty */}
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#1e3a5f] rounded-full" />
                      By Faculty
                    </h3>
                    {turnout.faculty_breakdown.length === 0 ? (
                      <p className="text-sm text-gray-400">No votes recorded yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {turnout.faculty_breakdown.map((item: any) => {
                          const percentage = turnout.total_voters > 0
                            ? Math.round((item.count / turnout.total_voters) * 100)
                            : 0
                          return (
                            <div key={item.faculty}>
                              <div className="flex items-center justify-between text-sm mb-1.5">
                                <span className="text-gray-700 font-medium">
                                  {facultyLabel[item.faculty] ?? item.faculty}
                                </span>
                                <span className="text-gray-500 text-xs">{item.count} votes · {percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className="bg-[#1e3a5f] h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>

                  {/* Year */}
                  <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                    <h3 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                      <div className="w-1 h-4 bg-[#c9a84c] rounded-full" />
                      By Year of Study
                    </h3>
                    {turnout.year_breakdown.length === 0 ? (
                      <p className="text-sm text-gray-400">No votes recorded yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {turnout.year_breakdown.map((item: any) => {
                          const percentage = turnout.total_voters > 0
                            ? Math.round((item.count / turnout.total_voters) * 100)
                            : 0
                          return (
                            <div key={item.year_of_study}>
                              <div className="flex items-center justify-between text-sm mb-1.5">
                                <span className="text-gray-700 font-medium">Year {item.year_of_study}</span>
                                <span className="text-gray-500 text-xs">{item.count} votes · {percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-100 rounded-full h-2">
                                <div
                                  className="bg-[#c9a84c] h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}