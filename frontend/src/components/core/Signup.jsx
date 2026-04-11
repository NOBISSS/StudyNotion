import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { IoEye } from 'react-icons/io5'
import { FaEyeSlash } from 'react-icons/fa'
import { sendOtp } from '../../services/operations/authAPI'
import { setSignUpData } from '../../slices/authSlice'
import { HighlightText } from './HomePage/HighlightText'
import Image from '../../assets/LoginGirlImage.webp'
import Lines from '../../assets/Lines2.png'

const TABS = ['student', 'instructor']

export const Signup = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [currentTab, setCurrentTab] = useState('Student')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    accountType: 'Student',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const { accountType, firstName, lastName, email, password, confirmPassword } = formData

  const handleTabClick = (tab) => {
    setCurrentTab(tab)
    setFormData(prev => ({ ...prev, accountType: tab }))
  }

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    dispatch(setSignUpData({ accountType, firstName, lastName, email, password, confirmPassword, otpPurpose: "signup" }))
    dispatch(sendOtp(formData, navigate))
  }

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0A0F1C] text-white">
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] flex-col-reverse items-center justify-center gap-10 px-6 py-12 md:flex-row md:gap-16 md:px-12">
        <div className="flex w-full flex-col md:w-1/2">
          {/* Heading */}
          <h1 className="mb-2 text-[26px] font-bold leading-tight text-[#F1F2FF] sm:text-[30px]">
            Join the millions learning to code with StudyNotion for free
          </h1>
          <p className="mb-6 text-[14px] leading-relaxed text-[#AFB2BF]">
            Build skills for today, tomorrow, and beyond.{' '}
            <HighlightText text="Education to future-proof your career" />
          </p>
          {/* ── Student / Instructor tab ── */}
          <div className="mb-6 flex w-fit rounded-full bg-[#161D29] p-1 shadow-[0_0.5px_0_0_rgba(255,255,255,0.15)]">
            {TABS.map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabClick(tab)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition-all duration-200 capitalize ${currentTab === tab
                    ? 'bg-[#0A0F1C] text-white shadow-sm'
                    : 'text-[#6B7280] hover:text-[#AFB2BF]'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <label htmlFor="firstName" className="text-sm font-medium text-[#F1F2FF]">
                  First Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  required
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={handleChange}
                  className="
                    w-full rounded-lg bg-[#161D29]
                    px-4 py-3 text-[14px] text-[#F1F2FF]
                    placeholder:text-[#6B7280]
                    border border-[#2C333F]
                    outline-none transition-all duration-150
                    focus:border-[#FFD60A]
                    shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                  "
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label htmlFor="lastName" className="text-sm font-medium text-[#F1F2FF]">
                  Last Name <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  required
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={handleChange}
                  className="
                    w-full rounded-lg bg-[#161D29]
                    px-4 py-3 text-[14px] text-[#F1F2FF]
                    placeholder:text-[#6B7280]
                    border border-[#2C333F]
                    outline-none transition-all duration-150
                    focus:border-[#FFD60A]
                    shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                  "
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#F1F2FF]">
                Email Address <span className="text-[#EF4444]">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={handleChange}
                className="
                  w-full rounded-lg bg-[#161D29]
                  px-4 py-3 text-[14px] text-[#F1F2FF]
                  placeholder:text-[#6B7280]
                  border border-[#2C333F]
                  outline-none transition-all duration-150
                  focus:border-[#FFD60A]
                  shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                "
              />
            </div>
            <div className="flex gap-4">
              {/* Create Password */}
              <div className="flex flex-1 flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-[#F1F2FF]">
                  Password <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    placeholder="Create password"
                    value={password}
                    onChange={handleChange}
                    className="
                      w-full rounded-lg bg-[#161D29]
                      px-4 py-3 pr-10 text-[14px] text-[#F1F2FF]
                      placeholder:text-[#6B7280]
                      border border-[#2C333F]
                      outline-none transition-all duration-150
                      focus:border-[#FFD60A]
                      shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                    "
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#AFB2BF]"
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <IoEye size={15} />}
                  </button>
                </div>
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-[#F1F2FF]">
                  Confirm Password <span className="text-[#EF4444]">*</span>
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    required
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={handleChange}
                    className="
                      w-full rounded-lg bg-[#161D29]
                      px-4 py-3 pr-10 text-[14px] text-[#F1F2FF]
                      placeholder:text-[#6B7280]
                      border border-[#2C333F]
                      outline-none transition-all duration-150
                      focus:border-[#FFD60A]
                      shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                    "
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowConfirmPassword(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#AFB2BF]"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={15} /> : <IoEye size={15} />}
                  </button>
                </div>
                {confirmPassword && (
                  <p className={`mt-0.5 text-[11px] font-medium ${password === confirmPassword ? 'text-[#22C55E]' : 'text-[#EF4444]'
                    }`}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke="#EF4444" strokeWidth="2" strokeLinecap="round" className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={!firstName || !lastName || !email || !password || !confirmPassword}
              className="
                mt-1 w-full rounded-lg py-3.5
                text-[15px] font-semibold text-black
                bg-[#FFD60A] hover:bg-yellow-300
                active:scale-[0.99] transition-all duration-150
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              Create Account
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-[#6B7280]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#FFD60A] transition-colors hover:text-yellow-300">
              Sign in
            </Link>
          </p>
        </div>
        <div className="relative flex w-full items-center justify-center md:w-1/2">
          <img
            src={Lines}
            alt=""
            aria-hidden="true"
            className="absolute right-0 top-4 h-[280px] w-[360px] object-cover opacity-60 sm:h-[340px] sm:w-[420px] md:h-[400px] md:w-[480px]"
          />
          <img
            src={Image}
            alt="Student learning online"
            className="relative z-10 h-[240px] w-auto sm:h-[300px] md:h-[380px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          />
          <div className="absolute bottom-4 left-4 z-20 hidden rounded-xl border border-[#2C333F] bg-[#161D29]/90 px-4 py-3 backdrop-blur-sm sm:block md:bottom-8 md:left-0">
            <p className="text-[11px] uppercase tracking-widest text-[#6B7280]">Students enrolled</p>
            <p className="mt-0.5 text-xl font-bold text-[#FFD60A]">250K+</p>
          </div>
          <div className="absolute right-4 top-8 z-20 hidden rounded-xl border border-[#2C333F] bg-[#161D29]/90 px-4 py-3 backdrop-blur-sm sm:block md:right-0">
            <p className="text-[11px] uppercase tracking-widest text-[#6B7280]">Courses available</p>
            <p className="mt-0.5 text-xl font-bold text-[#FFD60A]">1,200+</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup