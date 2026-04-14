import axios from "axios";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { endPoints } from "../services/apis";
import { setToken } from "../slices/authSlice";
import { setUser } from "../slices/profileSlice";

/* ─────────────────────────────────────────
   Status constants
───────────────────────────────────────── */
const STATUS = {
  VERIFYING: "verifying",
  SUCCESS: "success",
  ERROR: "error",
  INVALID: "invalid", // CSRF mismatch
};

/* ─────────────────────────────────────────
   Animated GitHub mark (inline SVG)
───────────────────────────────────────── */
function GitHubMark({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

/* ─────────────────────────────────────────
   Spinner
───────────────────────────────────────── */
function Spinner() {
  return (
    <div className="relative h-16 w-16">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-2 border-[#2C333F]" />
      {/* Spinning arc */}
      <div className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#FFD60A]" />
      {/* GitHub icon center */}
      <div className="absolute inset-0 flex items-center justify-center">
        <GitHubMark className="h-6 w-6 text-[#AFB2BF]" />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Main component
───────────────────────────────────────── */
export const GitHubCallback = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState(STATUS.VERIFYING);
  const [errorMsg, setErrorMsg] = useState("");
  const hasFired = useRef(false); // prevent double-fire in StrictMode

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const code = searchParams.get("code");
  const state = searchParams.get("state");

  useEffect(() => {
    if (hasFired.current) return;
    hasFired.current = true;

    async function handleGitHubRedirect() {
      // ── 1. Missing params ──
      if (!code || !state) {
        setStatus(STATUS.ERROR);
        setErrorMsg("Missing authorization code or state from GitHub.");
        navigate("/login");
        return;
      }
      // ── 2. CSRF check ──
      const storedCSRF = localStorage.getItem("latestCSRFToken");
      if (state !== storedCSRF) {
        // state MATCHES stored token → possible CSRF attack
        localStorage.removeItem("latestCSRFToken");
        setStatus(STATUS.INVALID);
        toast.error("Security check failed. Please try signing in again.");
        navigate("/login");
        return;
      }

      // state doesn't match → legitimate callback, clear token and proceed
      localStorage.removeItem("latestCSRFToken");

      // ── 3. Send code to backend ──
      try {
        const res = await axios.get(endPoints.GITHUB_AUTH_API + code, { withCredentials: true });
        if (!res.data.success) {
          throw new Error(res.data.message || "GitHub authentication failed.");
        }

        // Persist token / user in Redux (adjust to your slice shape)
        dispatch(setToken(res.data.data.accessToken));
        const userImage = res.data?.data?.user?.additionalDetails.profilePicture
          ? res.data.data.user.additionalDetails.profilePicture
          : `https://api.dicebear.com/5.x/initals/svg?seed=${res.data.data.user?.firstName} ${res.data.data.user?.lastName}`;
        dispatch(setUser({ ...res.data.data.user, image: userImage }));
        localStorage.setItem(
          "accessToken",
          JSON.stringify(res.data.data.accessToken),
        );
        localStorage.setItem("user", JSON.stringify(res.data.data.user));

        setStatus(STATUS.SUCCESS);

        // Redirect after short success pause so user sees the confirmation
        setTimeout(() => navigate("/dashboard/my-profile"), 1800);
      } catch (err) {
        console.error("GitHub callback error:", err);
        setStatus(STATUS.ERROR);
        setErrorMsg(
          err?.response?.data?.message ||
          err?.message ||
          "Something went wrong. Please try again.",
        );
      }
    }

    handleGitHubRedirect();
  }, [code, state, dispatch, navigate]);

  /* ════════════════════════════════════════
     RENDER
  ════════════════════════════════════════ */
  return (
    <div className="min-h-[calc(100vh-56px)] bg-[#0A0F1C] text-white flex items-center justify-center px-6">
      <div className="flex w-full max-w-md flex-col items-center gap-8 text-center">
        {/* ── VERIFYING ── */}
        {status === STATUS.VERIFYING && (
          <>
            <Spinner />

            <div>
              <h2 className="text-2xl font-bold text-[#F1F2FF]">
                Signing you in
              </h2>
              <p className="mt-2 text-sm text-[#AFB2BF]">
                Verifying your GitHub account. This only takes a moment…
              </p>
            </div>

            {/* Animated progress dots */}
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="h-2 w-2 rounded-full bg-[#FFD60A] opacity-0"
                  style={{
                    animation: `pulse-dot 1.2s ease-in-out ${i * 0.3}s infinite`,
                  }}
                />
              ))}
            </div>

            <style>{`
              @keyframes pulse-dot {
                0%, 80%, 100% { opacity: 0.15; transform: scale(0.8); }
                40%            { opacity: 1;    transform: scale(1);   }
              }
            `}</style>
          </>
        )}

        {/* ── SUCCESS ── */}
        {status === STATUS.SUCCESS && (
          <>
            {/* Animated checkmark ring */}
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-2 border-[#22C55E] opacity-30" />
              <div
                className="absolute inset-0 rounded-full border-2 border-[#22C55E]"
                style={{
                  animation: "scale-in 0.4s ease-out forwards",
                  transformOrigin: "center",
                }}
              />
              <svg
                width="36"
                height="36"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#22C55E"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ animation: "fade-in 0.3s ease-out 0.2s both" }}
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#F1F2FF]">You're in!</h2>
              <p className="mt-2 text-sm text-[#AFB2BF]">
                GitHub authentication successful. Redirecting to your dashboard…
              </p>
            </div>

            {/* Progress bar */}
            <div className="h-1 w-48 overflow-hidden rounded-full bg-[#2C333F]">
              <div
                className="h-full rounded-full bg-[#FFD60A]"
                style={{ animation: "progress-bar 1.8s linear forwards" }}
              />
            </div>

            <style>{`
              @keyframes scale-in  { from { transform: scale(0.6); opacity:0 } to { transform:scale(1); opacity:1 } }
              @keyframes fade-in   { from { opacity:0 } to { opacity:1 } }
              @keyframes progress-bar { from { width:0% } to { width:100% } }
            `}</style>
          </>
        )}

        {/* ── CSRF / INVALID ── */}
        {status === STATUS.INVALID && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#F97316]/40 bg-[#F97316]/10">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#F97316"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#F1F2FF]">
                Security Check Failed
              </h2>
              <p className="mt-2 text-sm text-[#AFB2BF]">
                We detected a potential CSRF issue with this request. For your
                safety, the sign-in was blocked. Please try again.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-[#FFD60A] px-6 py-3 text-sm font-semibold text-black transition-all hover:bg-yellow-300 active:scale-[0.99]"
            >
              Back to Login
            </Link>
          </>
        )}

        {/* ── ERROR ── */}
        {status === STATUS.ERROR && (
          <>
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#EF4444]/40 bg-[#EF4444]/10">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#EF4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#F1F2FF]">
                Authentication Failed
              </h2>
              <p className="mt-2 text-sm text-[#AFB2BF]">{errorMsg}</p>
            </div>

            {/* Error detail card */}
            <div className="w-full rounded-lg border border-[#EF4444]/20 bg-[#EF4444]/5 px-4 py-3 text-left">
              <p className="text-xs text-[#EF4444]/80">
                If this keeps happening, try clearing your browser cookies and
                attempting GitHub sign-in again. You can also sign in with email
                instead.
              </p>
            </div>

            <div className="flex w-full gap-3">
              <Link
                to="/login"
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#2C333F] bg-[#161D29] py-3 text-sm font-medium text-[#AFB2BF] transition-all hover:border-[#FFD60A] hover:text-white"
              >
                Back to Login
              </Link>
              <button
                onClick={() => window.location.reload()}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#FFD60A] py-3 text-sm font-semibold text-black transition-all hover:bg-yellow-300 active:scale-[0.99]"
              >
                Try Again
              </button>
            </div>
          </>
        )}

        {/* ── Bottom brand note (all states) ── */}
        <p className="text-xs text-[#6B7280]">
          Secured by{" "}
          <span className="font-medium text-[#AFB2BF]">StudyNotion</span>
          {" · "}
          <Link
            to="/privacy"
            className="hover:text-[#FFD60A] transition-colors"
          >
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default GitHubCallback;
