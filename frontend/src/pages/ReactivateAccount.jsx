import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { HighlightText } from "../components/core/HomePage/HighlightText";
import { reactivateAccountSendOTP } from "../services/operations/authAPI";

function validateEmail(email) {
  if (!email) return "Email address is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Please enter a valid email address";
  return null;
}

export const ReactivateAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const emailError = touched ? validateEmail(email) : null;
  const isFormValid = !validateEmail(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!isFormValid) return;
    dispatch(reactivateAccountSendOTP(email, setEmailSent, navigate));
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0A0F1C] text-white">
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] flex-col-reverse items-center justify-center gap-10 px-6 py-14 md:flex-row md:gap-16 md:px-12">

        {/* ══════════════════════════════════════════
            LEFT — Form
        ══════════════════════════════════════════ */}
        <div className="flex w-full flex-col md:w-1/2">

          {/* Back link */}
          <Link
            to="/login"
            className="mb-6 flex w-fit items-center gap-1.5 text-sm text-[#06B6D4] transition-colors hover:text-[#FFD60A]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Login
          </Link>

          {/* Heading */}
          <h1 className="mb-2 text-[28px] font-bold leading-tight text-[#F1F2FF] sm:text-[32px]">
            Reactivate Account
          </h1>
          <p className="mb-8 text-[15px] leading-relaxed text-[#AFB2BF]">
            Enter the email linked to your account and we'll send you a{" "}
            <HighlightText text="one-time verification code" />
          </p>

          {/* ── Info banner ── */}
          <div className="mb-6 flex items-start gap-3 rounded-xl border border-[#2C333F] bg-[#161D29] px-4 py-3.5">
            <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FFD60A]/10">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="#FFD60A">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <p className="text-[13px] leading-relaxed text-[#AFB2BF]">
              Deactivated accounts are retained for{" "}
              <span className="font-medium text-[#F1F2FF]">30 days</span>. After that,
              they are permanently deleted and cannot be restored.
            </p>
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-[#F1F2FF]">
                Email Address <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  placeholder="Enter your account email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched(true)}
                  className={`
                    w-full rounded-lg bg-[#161D29]
                    px-4 py-3 pr-10 text-[15px] text-[#F1F2FF]
                    placeholder:text-[#6B7280]
                    border outline-none transition-all duration-150
                    shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                    ${emailError
                      ? "border-[#EF4444] focus:border-[#EF4444]"
                      : touched && !emailError && email
                        ? "border-[#22C55E] focus:border-[#22C55E]"
                        : "border-[#2C333F] focus:border-[#FFD60A]"
                    }
                  `}
                />
                {/* Mail icon inside input */}
                <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                </span>
              </div>

              {emailError && (
                <p className="flex items-center gap-1.5 text-xs text-[#EF4444]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!isFormValid}
              className="
                mt-1 w-full rounded-lg py-3.5
                text-[15px] font-semibold text-black
                bg-[#FFD60A] hover:bg-yellow-300
                active:scale-[0.99] transition-all duration-150
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              Send Verification Code
            </button>
          </form>

          {/* Bottom links */}
          <div className="mt-6 flex flex-col items-center gap-2 text-center text-sm text-[#6B7280]">
            <p>
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-semibold text-[#FFD60A] transition-colors hover:text-yellow-300"
              >
                Sign up for free
              </Link>
            </p>
            <p>
              Already have an active account?{" "}
              <Link
                to="/login"
                className="font-semibold text-[#06B6D4] transition-colors hover:text-[#FFD60A]"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — Illustration
        ══════════════════════════════════════════ */}
        <div className="relative flex w-full items-center justify-center md:w-1/2">

          {/* Ambient glow */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-72 w-72 rounded-full bg-[#FFD60A]/5 blur-3xl" />
          </div>

          {/* Central illustration */}
          <div className="relative z-10 flex flex-col items-center gap-8">

            {/* SVG — pulse rings + envelope rising */}
            <svg
              width="240"
              height="240"
              viewBox="0 0 240 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_20px_50px_rgba(255,214,10,0.12)]"
            >
              {/* Pulse rings */}
              <circle cx="120" cy="120" r="100" stroke="#FFD60A" strokeWidth="0.6" strokeOpacity="0.12" />
              <circle cx="120" cy="120" r="78" stroke="#FFD60A" strokeWidth="0.6" strokeOpacity="0.18" />
              <circle cx="120" cy="120" r="56" stroke="#FFD60A" strokeWidth="0.8" strokeOpacity="0.22" />

              {/* Central circle */}
              <circle cx="120" cy="120" r="44" fill="#161D29" stroke="#2C333F" strokeWidth="1.5" />

              {/* Envelope body */}
              <rect x="95" y="108" width="50" height="34" rx="4" fill="#FFD60A" />
              {/* Envelope flap */}
              <path d="M95 112 L120 128 L145 112" stroke="#0A0F1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

              {/* Arrow up — reactivate symbolism */}
              <path d="M120 78 L120 100" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" />
              <path d="M113 85 L120 78 L127 85" stroke="#06B6D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />

              {/* Decorative sparkles */}
              <circle cx="74" cy="82" r="3" fill="#FFD60A" fillOpacity="0.5" />
              <circle cx="168" cy="78" r="2" fill="#FFD60A" fillOpacity="0.4" />
              <circle cx="166" cy="162" r="3.5" fill="#06B6D4" fillOpacity="0.4" />
              <circle cx="72" cy="158" r="2" fill="#06B6D4" fillOpacity="0.3" />
              <path d="M58 110 L62 110 M60 108 L60 112" stroke="#FFD60A" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
              <path d="M178 130 L182 130 M180 128 L180 132" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.5" />
            </svg>

            {/* Step breadcrumb */}
            <div className="flex items-center gap-2">
              {[
                { label: "Email", active: true },
                { label: "OTP", active: false },
                { label: "Done", active: false },
              ].map((step, i) => (
                <div key={step.label} className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all
                      ${step.active
                        ? "bg-[#FFD60A] text-black ring-2 ring-[#FFD60A]/30"
                        : "border border-[#2C333F] bg-[#161D29] text-[#6B7280]"
                      }`}
                  >
                    {i + 1}
                  </div>
                  <span className={`text-xs font-medium ${step.active ? "text-[#FFD60A]" : "text-[#6B7280]"}`}>
                    {step.label}
                  </span>
                  {i < 2 && (
                    <div className={`h-px w-6 ${step.active ? "bg-[#FFD60A]/40" : "bg-[#2C333F]"}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat — bottom left */}
          <div className="absolute bottom-4 left-4 z-20 hidden rounded-xl border border-[#2C333F] bg-[#161D29]/90 px-4 py-3 backdrop-blur-sm sm:block md:bottom-8 md:left-0">
            <p className="text-[11px] uppercase tracking-widest text-[#6B7280]">
              Accounts restored
            </p>
            <p className="mt-0.5 text-xl font-bold text-[#FFD60A]">12K+</p>
          </div>

          {/* Floating stat — top right */}
          <div className="absolute right-4 top-8 z-20 hidden rounded-xl border border-[#2C333F] bg-[#161D29]/90 px-4 py-3 backdrop-blur-sm sm:block md:right-0">
            <p className="text-[11px] uppercase tracking-widest text-[#6B7280]">
              OTP expires in
            </p>
            <p className="mt-0.5 text-xl font-bold text-[#FFD60A]">10 min</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReactivateAccount;