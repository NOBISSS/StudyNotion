// pages/UpdatePassword.jsx
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { FaEyeSlash } from 'react-icons/fa'
import { IoEye } from 'react-icons/io5'
import { ResetPassword } from '../services/operations/authAPI'

const UpdatePassword = () => {
  const location = useLocation()
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.auth)

  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const { password, confirmPassword } = formData

  const [showPassword, setShowPassword]           = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError]                         = useState('')

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
    const token = location.pathname.split('/').at(-1)
    dispatch(ResetPassword(password, confirmPassword, token))
  }

  // ── Password strength indicator ───────────────────────────────────────────
  const getStrength = (pwd) => {
    if (!pwd) return null
    let score = 0
    if (pwd.length >= 8)          score++
    if (/[A-Z]/.test(pwd))        score++
    if (/[0-9]/.test(pwd))        score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    if (score <= 1) return { label: 'Weak',   color: '#EF4444', width: '25%' }
    if (score === 2) return { label: 'Fair',   color: '#F59E0B', width: '50%' }
    if (score === 3) return { label: 'Good',   color: '#06B6D4', width: '75%' }
    return              { label: 'Strong', color: '#22C55E', width: '100%' }
  }
  const strength = getStrength(password)

  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#0A0F1C] px-4 py-16">
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2C333F] border-t-[#FFD60A]" />
          <p className="text-sm text-[#AFB2BF]">Resetting password...</p>
        </div>
      ) : (
        <div className="w-full max-w-[400px]">

          {/* ── Icon ── */}
          <div className="mb-6 flex justify-start">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#2C333F] bg-[#161D29]">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                stroke="#FFD60A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
          </div>

          {/* ── Heading ── */}
          <h1 className="mb-3 text-[28px] font-bold leading-tight text-[#F1F2FF]">
            Choose new password
          </h1>
          <p className="mb-8 text-[15px] leading-[1.7] text-[#AFB2BF]">
            Almost done. Enter your new password and you're all set.
          </p>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Create Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-[#F1F2FF]">
                New Password <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={password}
                  required
                  placeholder="Enter new password"
                  onChange={handleChange}
                  className="
                    w-full rounded-lg bg-[#161D29]
                    px-4 py-3 pr-11 text-[15px] text-[#F1F2FF]
                    placeholder:text-[#6B7280]
                    border border-[#2C333F]
                    outline-none transition-all duration-150
                    focus:border-[#FFD60A]
                    shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#AFB2BF]"
                  tabIndex={-1}
                >
                  {showPassword ? <FaEyeSlash size={17} /> : <IoEye size={17} />}
                </button>
              </div>

              {/* Strength bar */}
              {strength && (
                <div className="mt-1.5">
                  <div className="h-1 w-full overflow-hidden rounded-full bg-[#2C333F]">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: strength.width, background: strength.color }}
                    />
                  </div>
                  <p className="mt-1 text-[11px] font-medium" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-[#F1F2FF]">
                Confirm Password <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={confirmPassword}
                  required
                  placeholder="Confirm new password"
                  onChange={handleChange}
                  className="
                    w-full rounded-lg bg-[#161D29]
                    px-4 py-3 pr-11 text-[15px] text-[#F1F2FF]
                    placeholder:text-[#6B7280]
                    border border-[#2C333F]
                    outline-none transition-all duration-150
                    focus:border-[#FFD60A]
                    shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(p => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#AFB2BF]"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <FaEyeSlash size={17} /> : <IoEye size={17} />}
                </button>
              </div>

              {/* Match indicator */}
              {confirmPassword && (
                <p className={`mt-0.5 text-[11px] font-medium ${
                  password === confirmPassword ? 'text-[#22C55E]' : 'text-[#EF4444]'
                }`}>
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Global error */}
            {error && (
              <div className="flex items-center gap-2 rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 px-4 py-3">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="shrink-0">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <p className="text-sm text-[#EF4444]">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!password || !confirmPassword}
              className="
                mt-1 w-full rounded-lg py-3.5
                text-[15px] font-semibold text-black
                bg-[#FFD60A] hover:bg-yellow-300
                active:scale-[0.99]
                transition-all duration-150
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              Reset Password
            </button>
          </form>

          {/* ── Back to login ── */}
          <Link
            to="/login"
            className="mt-6 flex w-fit items-center gap-2 text-sm font-medium text-[#AFB2BF] transition-colors hover:text-[#F1F2FF]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to login
          </Link>
        </div>
      )}
    </div>
  )
}

export default UpdatePassword