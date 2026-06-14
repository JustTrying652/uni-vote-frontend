import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import type { Election } from '../../types'
import { ChevronLeft, CheckCircle } from 'lucide-react'
import PageHeader from '../../components/PageHeader'

export default function ApplyPage() {
  
  const { id } = useParams()
  const navigate = useNavigate()
  const [election, setElection] = useState<Election | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [manifesto, setManifesto] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [myApplications, setMyApplications] = useState<number[]>([]) // position ids already applied
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const hasAppliedInElection = myApplications.length > 0
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/elections/${id}/`)
        setElection(res.data)
        // fetch my existing applications
        const appsRes = await api.get(`/elections/my-applications/?election_id=${id}`)
        setMyApplications(appsRes.data.position_ids)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  if (!selectedPosition) return
  setError('')
  setSubmitting(true)
  try {
    const formData = new FormData()
    formData.append('position', String(selectedPosition))
    formData.append('manifesto', manifesto)
    if (photo) formData.append('photo', photo)

    await api.post('/elections/candidates/apply/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    setSuccess(true)
  } catch (err: any) {
    const data = err.response?.data
    setError(
      data?.non_field_errors?.[0] ||
      data?.position?.[0] ||
      data?.manifesto?.[0] ||
      'Failed to submit application.'
    )
  } finally {
    setSubmitting(false)
  }
}
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Photo must be under 2MB.')
      return
    }
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-lg mx-auto px-6 py-16 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted</h2>
          <p className="text-gray-500 mb-8">
            Your candidacy application is pending admin approval. You'll be able to vote once approved.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <PageHeader
        title="Apply as Candidate"
        subtitle={`${election?.title} · ${election?.academic_year}`}
        breadcrumb="Voter Portal . Candidacy"
      />
      <div className="max-w-2xl mx-auto px-6 py-8">

        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-6"
        >
          <ChevronLeft size={16} /> Back to Dashboard
        </button>

        

        {loading ? (
          <div className="text-center py-16 text-gray-400">Loading...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Position selector */}
            {hasAppliedInElection && (
  <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2 mb-4">
    <CheckCircle size={16} />
    You have already submitted an application for this election. Only one position per election is allowed.
  </div>
)}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-semibold text-gray-900 mb-4">Select a Position</h2>
              <div className="space-y-3">
                {election?.positions.map((position) => {
                  const alreadyApplied = myApplications.includes(position.id)
                  return (
                    <button
  key={position.id}
  type="button"
  disabled={hasAppliedInElection && !myApplications.includes(position.id)}
  onClick={() => !hasAppliedInElection ? setSelectedPosition(position.id) : null}
  className={`w-full text-left rounded-xl border-2 p-4 transition-all ${
    myApplications.includes(position.id)
      ? 'border-green-200 bg-green-50 cursor-default'
      : hasAppliedInElection
      ? 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-50'
      : selectedPosition === position.id
      ? 'border-blue-500 bg-blue-50'
      : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
  }`}
>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{position.title}</p>
                          {position.description && (
                            <p className="text-sm text-gray-500 mt-0.5">{position.description}</p>
                          )}
                        </div>
                        {alreadyApplied ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2.5 py-1 rounded-full font-medium">
                            Applied
                          </span>
                        ) : (
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                            selectedPosition === position.id ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
                          }`}>
                            {selectedPosition === position.id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Manifesto */}
            {selectedPosition && (
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h2 className="font-semibold text-gray-900 mb-1">Your Manifesto</h2>
                <p className="text-sm text-gray-500 mb-4">
                  Tell students what you stand for and what you'll deliver if elected.
                </p>
                <textarea
                  value={manifesto}
                  onChange={(e) => setManifesto(e.target.value)}
                  rows={6}
                  placeholder="Write your manifesto here..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  required
                  minLength={50}
                />
                <p className="text-xs text-gray-400 mt-1">{manifesto.length} characters · minimum 50</p>
              </div>
            )}
            {selectedPosition && (
  <div className="bg-white rounded-2xl border border-gray-100 p-6">
    <h2 className="font-semibold text-gray-900 mb-1">Campaign Photo</h2>
    <p className="text-sm text-gray-500 mb-4">
      Upload a clear photo of yourself. This will appear on the ballot. Max 2MB.
    </p>

    <div className="flex items-center gap-6">
      {/* Preview */}
      <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
        {photoPreview ? (
          <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <svg className="w-8 h-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        )}
      </div>

      <div className="flex-1">
        <label className="cursor-pointer">
          <div className="border-2 border-dashed border-gray-300 hover:border-[#1e3a5f] rounded-lg px-4 py-3 text-center transition-colors">
            <p className="text-sm font-medium text-gray-700">
              {photo ? photo.name : 'Click to upload photo'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">PNG, JPG up to 2MB</p>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </label>
        {photo && (
          <button
            type="button"
            onClick={() => { setPhoto(null); setPhotoPreview(null) }}
            className="text-xs text-red-500 hover:text-red-600 mt-2 transition-colors"
          >
            Remove photo
          </button>
        )}
      </div>
    </div>
  </div>
)}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {selectedPosition && (
              <button
                type="submit"
                disabled={submitting || manifesto.length < 50}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white font-semibold rounded-lg py-3 text-sm transition-colors"
              >
                {submitting ? 'Submitting...' : 'Submit Application'}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}