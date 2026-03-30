// components/core/Login.jsx
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { IoEye } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Lines from "../../assets/Lines2.png";
import Image from "../../assets/LoginGirlImage.webp";
import { login } from "../../services/operations/authAPI";
import GoogleLoginButton from "../../utils/GoogleLogin";
import { HighlightText } from "./HomePage/HighlightText";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login(email, password, navigate));
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0A0F1C] text-white">
      <div className="mx-auto flex min-h-[calc(100vh-56px)] max-w-[1200px] flex-col-reverse items-center justify-center gap-10 px-6 py-14 md:flex-row md:gap-16 md:px-12">
        {/* ══════════════════════════════════════════
            LEFT — Form
        ══════════════════════════════════════════ */}
        <div className="flex w-full flex-col md:w-1/2">
          {/* Heading */}
          <h1 className="mb-2 text-[28px] font-bold leading-tight text-[#F1F2FF] sm:text-[32px]">
            Welcome Back
          </h1>
          <p className="mb-8 text-[15px] leading-relaxed text-[#AFB2BF]">
            Build skills for today, tomorrow, and beyond.{" "}
            <HighlightText text="Education to future-proof your career" />
          </p>

          {/* ── Social login pills ── */}
          <div className="mb-6 flex gap-3">
            {/* Google */}
            <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
              <GoogleLoginButton />
            </GoogleOAuthProvider>

            {/* GitHub */}
            <button
              type="button"
              className="flex flex-1 items-center justify-center gap-2.5 rounded-lg border border-[#2C333F] bg-[#161D29] py-2.5 text-sm font-medium text-[#AFB2BF] transition-all hover:border-[#FFD60A] hover:text-white"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="mb-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-[#2C333F]" />
            <span className="text-xs text-[#6B7280]">
              or sign in with email
            </span>
            <div className="h-px flex-1 bg-[#2C333F]" />
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[#F1F2FF]"
              >
                Email Address <span className="text-[#EF4444]">*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                required
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="
                  w-full rounded-lg bg-[#161D29]
                  px-4 py-3 text-[15px] text-[#F1F2FF]
                  placeholder:text-[#6B7280]
                  border border-[#2C333F]
                  outline-none transition-all duration-150
                  focus:border-[#FFD60A]
                  shadow-[0_1px_0_0_rgba(255,255,255,0.08)]
                "
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#F1F2FF]"
                >
                  Password <span className="text-[#EF4444]">*</span>
                </label>
                <Link
                  to="/forgotpassword"
                  className="text-xs text-[#06B6D4] transition-colors hover:text-[#FFD60A] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={!email || !password}
              className="
                mt-1 w-full rounded-lg py-3.5
                text-[15px] font-semibold text-black
                bg-[#FFD60A] hover:bg-yellow-300
                active:scale-[0.99] transition-all duration-150
                disabled:cursor-not-allowed disabled:opacity-50
              "
            >
              Sign In
            </button>
          </form>

          {/* Sign up link */}
          <p className="mt-6 text-center text-sm text-[#6B7280]">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[#FFD60A] transition-colors hover:text-yellow-300"
            >
              Sign up for free
            </Link>
          </p>
        </div>

        <div className="relative flex w-full items-center justify-center md:w-1/2">
          {/* Lines background — decorative */}
          <img
            src={"https://res.cloudinary.com/dc9ukfxel/image/upload/v1774845888/LoginGirlImage_glszxk.webp"}
            alt=""
            aria-hidden="true"
            className="absolute right-0 top-4 h-[280px] w-[360px] object-cover opacity-60 sm:h-[340px] sm:w-[420px] md:h-[400px] md:w-[480px]"
          />
          {/* Main illustration */}
          <img
            src={"https://res.cloudinary.com/dc9ukfxel/image/upload/v1774845888/LoginGirlImage_glszxk.webp"}
            alt="Student learning online"
            className="relative z-10 h-[260px] w-auto sm:h-[320px] md:h-[400px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
          />

          {/* Floating stat card — bottom left */}
          <div className="absolute bottom-4 left-4 z-20 hidden rounded-xl border border-[#2C333F] bg-[#161D29]/90 px-4 py-3 backdrop-blur-sm sm:block md:bottom-8 md:left-0">
            <p className="text-[11px] uppercase tracking-widest text-[#6B7280]">
              Students enrolled
            </p>
            <p className="mt-0.5 text-xl font-bold text-[#FFD60A]">250K+</p>
          </div>

          {/* Floating stat card — top right */}
          <div className="absolute right-4 top-8 z-20 hidden rounded-xl border border-[#2C333F] bg-[#161D29]/90 px-4 py-3 backdrop-blur-sm sm:block md:right-0">
            <p className="text-[11px] uppercase tracking-widest text-[#6B7280]">
              Courses available
            </p>
            <p className="mt-0.5 text-xl font-bold text-[#FFD60A]">1,200+</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
