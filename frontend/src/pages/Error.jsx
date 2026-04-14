import { Link, useNavigate } from 'react-router-dom'

const Error = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col items-center justify-center bg-[#0A0F1C] px-4 py-16 text-center">

      {/* ── Animated 404 number ── */}
      <div className="relative mb-8 select-none">
        {/* Glow behind the number */}
        <div
          className="absolute inset-0 blur-[80px] opacity-20"
          style={{ background: 'radial-gradient(circle, #FFD60A 0%, transparent 70%)' }}
        />
        <h1
          className="relative text-[120px] font-extrabold leading-none tracking-tighter sm:text-[160px]"
          style={{
            background: 'linear-gradient(135deg, #FFD60A 0%, #f59e0b 50%, #FFD60A 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>
      </div>

      {/* ── Broken link illustration ── */}
      <div className="mb-8 flex items-center gap-3 text-[#2C333F]">
        <div className="h-px w-12 bg-[#2C333F] sm:w-20" />
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          {/* Break marks */}
          <line x1="12" y1="8" x2="12" y2="6" stroke="#EF4444" strokeWidth="2" />
          <line x1="12" y1="18" x2="12" y2="16" stroke="#EF4444" strokeWidth="2" />
        </svg>
        <div className="h-px w-12 bg-[#2C333F] sm:w-20" />
      </div>

      {/* ── Heading ── */}
      <h2 className="mb-3 text-2xl font-bold text-[#F1F2FF] sm:text-3xl">
        Page not found
      </h2>

      {/* ── Description ── */}
      <p className="mb-10 max-w-[400px] text-[15px] leading-relaxed text-[#6B7280]">
        Oops! The page you're looking for doesn't exist or has been moved.
        Let's get you back on track.
      </p>

      {/* ── Action buttons ── */}
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        {/* Primary — Go Home */}
        <Link
          to="/"
          className="
            flex items-center gap-2 rounded-lg
            bg-[#FFD60A] px-6 py-3
            text-sm font-semibold text-black
            transition-all duration-150
            hover:bg-yellow-300 active:scale-[0.98]
          "
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Go to Homepage
        </Link>

        {/* Secondary — Go Back */}
        <button
          onClick={() => navigate(-1)}
          className="
            flex items-center gap-2 rounded-lg
            border border-[#2C333F] bg-transparent
            px-6 py-3
            text-sm font-medium text-[#AFB2BF]
            transition-all duration-150
            hover:border-[#AFB2BF] hover:text-[#F1F2FF]
            active:scale-[0.98]
          "
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Go Back
        </button>

        {/* Tertiary — Browse Courses */}
        <Link
          to="/catalog"
          className="
            flex items-center gap-2 rounded-lg
            border border-[#2C333F] bg-transparent
            px-6 py-3
            text-sm font-medium text-[#AFB2BF]
            transition-all duration-150
            hover:border-[#FFD60A] hover:text-[#FFD60A]
            active:scale-[0.98]
          "
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          Browse Courses
        </Link>
      </div>

      {/* ── Help text ── */}
      <p className="mt-12 text-[13px] text-[#374151]">
        Think this is a mistake?{' '}
        <Link to="/contact" className="text-[#FFD60A] underline-offset-2 hover:underline">
          Contact support
        </Link>
      </p>
    </div>
  )
}

export default Error