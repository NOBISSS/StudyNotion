import { useState } from "react";
import { FaEyeSlash, FaCheckCircle } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotpasswordResetPassword } from "../services/operations/authAPI";
import { HighlightText } from "../components/core/HomePage/HighlightText";

function validatePassword(password) {
  if (!password) return "Password is required";
  if (password.length < 8) return "Password length shouldn't be less than 8";
  if (!/[A-Z]/.test(password))
    return "Password should include at least 1 uppercase character";
  if (!/[a-z]/.test(password))
    return "Password should include at least 1 lowercase character";
  if (!/[0-9]/.test(password))
    return "Password should include at least 1 number character";
  if (!/[^A-Za-z0-9]/.test(password))
    return "Password should include at least 1 special character";
  return null;
}

/* Strength meter helper */
function getStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0–5
}

const strengthMeta = [
  { label: "Too weak", color: "#EF4444" },
  { label: "Weak", color: "#F97316" },
  { label: "Fair", color: "#EAB308" },
  { label: "Good", color: "#84CC16" },
  { label: "Strong", color: "#22C55E" },
  { label: "Very strong", color: "#10B981" },
];

const requirements = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /[0-9]/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

/* ─────────────────────────────────────────
   Component
───────────────────────────────────────── */
export const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ── Auth guard: OTP must have been verified ──
  const isOTPVerified = useSelector((state) => state.auth.isOTPVerified);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
  });

  // ── Derived validation ──
  const passwordError = touched.password ? validatePassword(password) : null;
  const confirmPasswordError =
    touched.confirmPassword && confirmPassword
      ? password !== confirmPassword
        ? "Passwords do not match"
        : null
      : touched.confirmPassword && !confirmPassword
        ? "Confirm password is required"
        : null;

  const strength = getStrength(password);
  const isFormValid =
    !validatePassword(password) &&
    password === confirmPassword &&
    confirmPassword;

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ password: true, confirmPassword: true });
    if (!isFormValid) return;
    dispatch(
      forgotpasswordResetPassword(navigate, { password, confirmPassword }),
    );
  };

  // ── If OTP not verified, show a locked state ──
  if (!isOTPVerified) {
    return (
      <div className="min-h-[calc(100vh-56px)] bg-[#0A0F1C] text-white flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-6 text-center max-w-sm">
          {/* Lock icon */}
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#2C333F] bg-[#161D29]">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFD60A"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <div>
            <h2 className="text-xl font-bold text-[#F1F2FF]">
              Verification Required
            </h2>
            <p className="mt-2 text-sm text-[#AFB2BF]">
              You need to verify your OTP before resetting your password.
            </p>
          </div>

          <Link
            to="/forgotpassword"
            className="inline-flex items-center gap-2 rounded-lg bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-yellow-300 active:scale-[0.99]"
          >
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

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
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Back to Login
          </Link>

          {/* Heading */}
          <h1 className="mb-2 text-[28px] font-bold leading-tight text-[#F1F2FF] sm:text-[32px]">
            Reset Password
          </h1>
          <p className="mb-8 text-[15px] leading-relaxed text-[#AFB2BF]">
            Choose a strong password to{" "}
            <HighlightText text="secure your account" />
          </p>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* ── New Password ── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-sm font-medium text-[#F1F2FF]"
              >
                New Password <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  className={`
                    w-full rounded-lg bg-[#161D29]
                    px-4 py-3 pr-11 text-[15px] text-[#F1F2FF]
                    placeholder:text-[#6B7280]
                    border outline-none transition-all duration-150
                    shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                    ${passwordError
                      ? "border-[#EF4444] focus:border-[#EF4444]"
                      : touched.password && !passwordError && password
                        ? "border-[#22C55E] focus:border-[#22C55E]"
                        : "border-[#2C333F] focus:border-[#FFD60A]"
                    }
                  `}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#AFB2BF]"
                >
                  {showPassword ? (
                    <FaEyeSlash size={17} />
                  ) : (
                    <IoEye size={17} />
                  )}
                </button>
              </div>

              {/* Error */}
              {passwordError && (
                <p className="flex items-center gap-1.5 text-xs text-[#EF4444]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  {passwordError}
                </p>
              )}

              {/* Strength bar — shown once user starts typing */}
              {password.length > 0 && (
                <div className="mt-1 flex flex-col gap-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="h-1 flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor:
                            i <= strength
                              ? (strengthMeta[strength - 1]?.color ?? "#2C333F")
                              : "#2C333F",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-xs"
                    style={{
                      color: strengthMeta[strength - 1]?.color ?? "#6B7280",
                    }}
                  >
                    {strength > 0 ? strengthMeta[strength - 1].label : ""}
                  </span>
                </div>
              )}

              {/* Requirements checklist */}
              {password.length > 0 && (
                <ul className="mt-2 flex flex-col gap-1">
                  {requirements.map((req) => {
                    const passed = req.test(password);
                    return (
                      <li
                        key={req.label}
                        className="flex items-center gap-2 text-xs"
                        style={{ color: passed ? "#22C55E" : "#6B7280" }}
                      >
                        {passed ? (
                          <FaCheckCircle size={11} />
                        ) : (
                          <span className="inline-block h-2.5 w-2.5 rounded-full border border-[#6B7280]" />
                        )}
                        {req.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* ── Confirm Password ── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-[#F1F2FF]"
              >
                Confirm Password <span className="text-[#EF4444]">*</span>
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  required
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, confirmPassword: true }))
                  }
                  className={`
                    w-full rounded-lg bg-[#161D29]
                    px-4 py-3 pr-11 text-[15px] text-[#F1F2FF]
                    placeholder:text-[#6B7280]
                    border outline-none transition-all duration-150
                    shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                    ${confirmPasswordError
                      ? "border-[#EF4444] focus:border-[#EF4444]"
                      : touched.confirmPassword &&
                        !confirmPasswordError &&
                        confirmPassword
                        ? "border-[#22C55E] focus:border-[#22C55E]"
                        : "border-[#2C333F] focus:border-[#FFD60A]"
                    }
                  `}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B7280] transition-colors hover:text-[#AFB2BF]"
                >
                  {showConfirm ? <FaEyeSlash size={17} /> : <IoEye size={17} />}
                </button>
              </div>

              {confirmPasswordError && (
                <p className="flex items-center gap-1.5 text-xs text-[#EF4444]">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  {confirmPasswordError}
                </p>
              )}

              {/* Match indicator */}
              {touched.confirmPassword &&
                confirmPassword &&
                !confirmPasswordError && (
                  <p className="flex items-center gap-1.5 text-xs text-[#22C55E]">
                    <FaCheckCircle size={11} />
                    Passwords match
                  </p>
                )}
            </div>

            {/* ── Submit ── */}
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
              Reset Password
            </button>
          </form>

          {/* Sign in link */}
          <p className="mt-6 text-center text-sm text-[#6B7280]">
            Remembered your password?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#FFD60A] transition-colors hover:text-yellow-300"
            >
              Sign in
            </Link>
          </p>
        </div>

        {/* ══════════════════════════════════════════
            RIGHT — Illustration
        ══════════════════════════════════════════ */}
        <div className="relative flex w-full items-center justify-center md:w-1/2">
          {/* Decorative glow */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-64 w-64 rounded-full bg-[#FFD60A]/5 blur-3xl" />
          </div>

          {/* Shield / lock illustration */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Big shield SVG */}
            <svg
              width="220"
              height="240"
              viewBox="0 0 220 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="drop-shadow-[0_20px_50px_rgba(255,214,10,0.15)]"
            >
              {/* Shield body */}
              <path
                d="M110 8 L200 40 L200 110 C200 162 158 205 110 228 C62 205 20 162 20 110 L20 40 Z"
                fill="#161D29"
                stroke="#2C333F"
                strokeWidth="1.5"
              />
              {/* Shield inner glow ring */}
              <path
                d="M110 22 L188 50 L188 110 C188 156 150 196 110 216 C70 196 32 156 32 110 L32 50 Z"
                fill="none"
                stroke="#FFD60A"
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
              {/* Lock body */}
              <rect
                x="82"
                y="118"
                width="56"
                height="46"
                rx="8"
                fill="#FFD60A"
              />
              {/* Lock shackle */}
              <path
                d="M92 118 L92 103 C92 89 128 89 128 103 L128 118"
                stroke="#FFD60A"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
              />
              {/* Lock keyhole */}
              <circle cx="110" cy="138" r="7" fill="#161D29" />
              <rect
                x="107"
                y="140"
                width="6"
                height="12"
                rx="3"
                fill="#161D29"
              />
              {/* Decorative dots */}
              <circle cx="50" cy="80" r="3" fill="#FFD60A" fillOpacity="0.4" />
              <circle cx="170" cy="70" r="2" fill="#FFD60A" fillOpacity="0.3" />
              <circle
                cx="165"
                cy="160"
                r="4"
                fill="#06B6D4"
                fillOpacity="0.4"
              />
              <circle
                cx="45"
                cy="150"
                r="2.5"
                fill="#06B6D4"
                fillOpacity="0.3"
              />
            </svg>

            {/* Step indicators */}
            <div className="flex items-center gap-2">
              {["Email", "OTP", "Reset"].map((step, i) => (
                <div key={step} className="flex items-center gap-2">
                  <div
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold
                    ${i < 2
                        ? "bg-[#22C55E] text-white"
                        : "bg-[#FFD60A] text-black"
                      }`}
                  >
                    {i < 2 ? <FaCheckCircle size={13} /> : i + 1}
                  </div>
                  <span
                    className={`text-xs font-medium ${i === 2 ? "text-[#FFD60A]" : "text-[#22C55E]"}`}
                  >
                    {step}
                  </span>
                  {i < 2 && <div className="h-px w-6 bg-[#22C55E]" />}
                </div>
              ))}
            </div>
          </div>

          {/* Floating stat card — bottom left */}
          <div className="absolute bottom-4 left-4 z-20 hidden rounded-xl border border-[#2C333F] bg-[#161D29]/90 px-4 py-3 backdrop-blur-sm sm:block md:bottom-8 md:left-0">
            <p className="text-[11px] uppercase tracking-widest text-[#6B7280]">
              Accounts protected
            </p>
            <p className="mt-0.5 text-xl font-bold text-[#FFD60A]">250K+</p>
          </div>

          {/* Floating stat card — top right */}
          <div className="absolute right-4 top-8 z-20 hidden rounded-xl border border-[#2C333F] bg-[#161D29]/90 px-4 py-3 backdrop-blur-sm sm:block md:right-0">
            <p className="text-[11px] uppercase tracking-widest text-[#6B7280]">
              256-bit encryption
            </p>
            <p className="mt-0.5 text-xl font-bold text-[#FFD60A]">AES</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
