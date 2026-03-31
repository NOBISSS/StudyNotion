// pages/ForgotPassword.jsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { forgotpasswordSendOTP, getPasswordResetToken } from '../services/operations/authAPI'
import { setSignUpData } from '../slices/authSlice'

const ForgotPassword = () => {
  const [emailSent, setEmailSent] = useState(false)
  const [email, setEmail]         = useState('')
  const { loading }               = useSelector(state => state.auth)
  const dispatch                  = useDispatch()
  const navigate                 = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(forgotpasswordSendOTP(email, setEmailSent,navigate))
  }
  // useEffect(() => {
  //   if (emailSent) {
  //     dispatch(setSignUpData({ email, otpPurpose: "forgotPassword" }));
  //     navigate("/forgotpassword/verify", { state: { email } })
  //   }
  // }, [emailSent])
  return (
    <div className="flex min-h-[calc(100vh-56px)] items-center justify-center bg-[#0A0F1C] px-4 py-16">
      {loading ? (
        /* ── Loading spinner ── */
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2C333F] border-t-[#FFD60A]" />
          <p className="text-sm text-[#AFB2BF]">Processing...</p>
        </div>
      ) : (
        <div className="w-full max-w-[400px]">

          {/* ── Icon ── */}
          <div className="mb-6 flex justify-start">
            {emailSent ? (
              /* Email sent icon */
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#161D29] border border-[#2C333F]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
                  stroke="#FFD60A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
            ) : (
              /* Lock icon */
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#161D29] border border-[#2C333F]">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
                  stroke="#FFD60A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
            )}
          </div>

          {/* ── Heading ── */}
          <h1 className="mb-3 text-[28px] font-bold leading-tight text-[#F1F2FF]">
            {emailSent ? 'Check your email' : 'Reset your password'}
          </h1>

          {/* ── Description ── */}
          <p className="mb-8 text-[15px] leading-[1.7] text-[#AFB2BF]">
            {emailSent
              ? <>We have sent the reset link to <span className="font-semibold text-[#F1F2FF]">{email}</span>. Please check your inbox and follow the instructions.</>
              : "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
            }
          </p>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email field — only shown before sending */}
            {!emailSent && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-[#F1F2FF]">
                  Email Address <span className="text-[#EF4444]">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  required
                  placeholder="myemailaddress@gmail.com"
                  onChange={e => setEmail(e.target.value)}
                  className="
                    w-full rounded-lg bg-[#161D29]
                    px-4 py-3 text-[15px] text-[#F1F2FF]
                    placeholder:text-[#6B7280]
                    border border-[#2C333F]
                    outline-none
                    transition-all duration-150
                    focus:border-[#FFD60A]
                    shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                  "
                />
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              disabled={!emailSent && !email.trim()}
              className="
                w-full rounded-lg py-3.5
                text-[15px] font-semibold text-black
                transition-all duration-150
                disabled:cursor-not-allowed disabled:opacity-60
                bg-[#FFD60A] hover:bg-yellow-300
                active:scale-[0.99]
              "
            >
              {emailSent ? 'Resend Email' : 'Reset Password'}
            </button>
          </form>

          {/* ── Back to login ── */}
          <Link
            to="/login"
            className="
              mt-6 flex items-center gap-2
              text-sm font-medium text-[#AFB2BF]
              transition-colors hover:text-[#F1F2FF]
              w-fit
            "
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

export default ForgotPassword