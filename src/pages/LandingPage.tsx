import { useNavigate } from 'react-router-dom'
import { Shield, BarChart3, Users, ChevronRight, Vote, Lock, Eye } from 'lucide-react'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
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
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-600 hover:text-[#1e3a5f] font-medium transition-colors px-3 py-1.5"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm bg-[#1e3a5f] hover:bg-[#162d4a] text-white font-medium px-4 py-1.5 rounded transition-colors"
            >
              Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-[#1e3a5f] relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-white rounded-full"
              style={{
                width: `${(i + 1) * 120}px`,
                height: `${(i + 1) * 120}px`,
                top: '50%',
                left: '60%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto px-6 py-20 relative">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-white/10 text-blue-200 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <div className="w-1.5 h-1.5 bg-[#c9a84c] rounded-full" />
              Secure · Transparent · Democratic
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
              Your Vote,<br />
              <span className="text-[#c9a84c]">Your Voice.</span>
            </h1>
            <p className="text-blue-200 text-lg mb-8 leading-relaxed">
              Digital elections for modern universities. UniVote brings transparency, security, and simplicity to student governance — from candidate applications to live results.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/register')}
                className="flex items-center gap-2 bg-[#c9a84c] hover:bg-[#b8963e] text-white font-semibold px-6 py-3 rounded transition-colors text-sm"
              >
                Get Started <ChevronRight size={16} />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3 rounded transition-colors text-sm border border-white/20"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="h-12 bg-white" style={{ clipPath: 'ellipse(55% 100% at 50% 100%)' }} />
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-2">The Process</p>
          <h2 className="text-2xl font-bold text-[#1e3a5f]">How UniVote Works</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden sm:block absolute top-8 left-1/4 right-1/4 h-px bg-gray-200" />

          {[
            {
              step: '01',
              icon: Users,
              title: 'Register & Get Verified',
              desc: 'Students register with their university credentials. The electoral commission verifies eligibility before voting begins.',
            },
            {
              step: '02',
              icon: Vote,
              title: 'Candidates Apply',
              desc: 'Verified students can apply for any open position with a manifesto. Applications are reviewed and approved by administrators.',
            },
            {
              step: '03',
              icon: BarChart3,
              title: 'Vote & View Results',
              desc: 'Cast your ballot securely during the voting window. Results are published instantly once the election closes.',
            },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#1e3a5f] rounded-full mb-4 relative z-10">
                <Icon size={24} className="text-[#c9a84c]" />
              </div>
              <p className="text-xs font-bold text-[#c9a84c] tracking-widest mb-1">{step}</p>
              <h3 className="font-bold text-[#1e3a5f] mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-[#f8f9fb] py-16">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-[#c9a84c] text-xs font-semibold uppercase tracking-widest mb-2">Why UniVote</p>
            <h2 className="text-2xl font-bold text-[#1e3a5f]">Built for Trust</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Lock,
                title: 'One Person, One Vote',
                desc: 'Cryptographic enforcement ensures every voter can only cast a single vote per position — no exceptions.',
              },
              {
                icon: Eye,
                title: 'Full Audit Trail',
                desc: 'Every action in the system is logged — from candidate approvals to vote submissions — for complete accountability.',
              },
              {
                icon: Shield,
                title: 'Verified Voters Only',
                desc: 'Only students verified by the electoral commission can participate, ensuring election integrity from the start.',
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
                <div className="w-10 h-10 bg-[#1e3a5f] rounded-lg flex items-center justify-center mb-4">
                  <Icon size={18} className="text-[#c9a84c]" />
                </div>
                <h3 className="font-bold text-[#1e3a5f] mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1e3a5f] py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to participate?</h2>
          <p className="text-blue-200 text-sm mb-8">
            Register with your student credentials and join the democratic process at your university.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-[#c9a84c] hover:bg-[#b8963e] text-white font-semibold px-8 py-3 rounded transition-colors text-sm"
          >
            Create Your Account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-[#1e3a5f] rounded flex items-center justify-center">
              <div className="w-0.5 h-3 bg-[#c9a84c] rounded-sm mr-0.5" />
              <div className="flex flex-col gap-0.5">
                <div className="w-2 h-0.5 bg-white rounded-sm" />
                <div className="w-1.5 h-0.5 bg-white rounded-sm" />
                <div className="w-2 h-0.5 bg-white rounded-sm" />
              </div>
            </div>
            <span className="text-xs font-bold text-[#1e3a5f]">UniVote</span>
          </div>
          <p className="text-xs text-gray-400">© 2026 UniVote. Built by Me Bomba. Secure student elections.</p>
        </div>
      </footer>
    </div>
  )
}