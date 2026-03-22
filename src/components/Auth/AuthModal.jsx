import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

// ── Google icon ───────────────────────────────────────────────────────────────
const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

// ── Eye icon ──────────────────────────────────────────────────────────────────
const EyeIcon = ({ open }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    {open ? (
      <>
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
      </>
    ) : (
      <>
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
        <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
      </>
    )}
  </svg>
);

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// ── Password strength ─────────────────────────────────────────────────────────
function getStrength(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  return score;
}

const STRENGTH_LABEL = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLOR = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"];

function PasswordStrength({ password }) {
  const score = getStrength(password);
  if (!password) return null;
  return (
    <div className="mt-1.5">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full transition-colors duration-300"
            style={{ backgroundColor: i <= score ? STRENGTH_COLOR[score] : "#e5e7eb" }}
          />
        ))}
      </div>
      <p className="text-[11px] font-light" style={{ color: STRENGTH_COLOR[score] }}>
        {STRENGTH_LABEL[score]}
      </p>
    </div>
  );
}

// ── Input field ───────────────────────────────────────────────────────────────
function Input({ label, type = "text", value, onChange, error, placeholder, rightEl }) {
  return (
    <div className="flex flex-col gap-1">
      <div
        className="flex items-center border rounded px-4 py-3 gap-2 transition-colors duration-200"
        style={{ borderColor: error ? "#ef4444" : "#808080" }}
      >
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="flex-1 text-[13px] text-[#1a1a1a] bg-transparent outline-none
                     placeholder-gray-400 font-light"
        />
        {rightEl}
      </div>
      {error && (
        <p className="text-[11px] text-red-500 font-light">{error}</p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN FORM
// ─────────────────────────────────────────────────────────────────────────────

function LoginForm() {
  const { openSignup, openForgot, closeAuth } = useAuth();
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [errors,      setErrors]      = useState({});
  const [apiError,    setApiError]    = useState("");
  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);

  const validate = () => {
    const e = {};
    if (!email)                        e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password)                     e.password = "Password is required";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    setApiError("");
    if (Object.keys(e).length) return;

    setLoading(true);
    // TODO: replace with real API call
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);

    // Simulate wrong credentials
    setApiError("Invalid email or password. Please try again.");
    // On success: setSuccess(true); then closeAuth();
  };

  return (
    <div className="flex flex-col gap-4">
      {apiError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded text-[12px] text-red-600 font-light">
          {apiError}
        </div>
      )}

      <Input
        placeholder="Please enter your Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <div>
        <Input
          placeholder="Please enter your Password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          rightEl={
            <button onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <EyeIcon open={showPw} />
            </button>
          }
        />
        <div className="flex justify-end mt-1.5">
          <button
            onClick={openForgot}
            className="text-[12px] text-gray-400 hover:text-[#1a1a1a] transition-colors font-light"
          >
            Forgot Password ?
          </button>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3.5 bg-[#1a1a1a] hover:bg-[#333333] active:bg-[#000000] rounded
                   text-white text-[14px] font-medium tracking-wide transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <p className="text-center text-[13px] text-gray-500 font-light">
        Don't have an account?{" "}
        <button onClick={openSignup} className="text-[#1c3ccb] font-medium hover:underline underline-offset-2">
          Sign Up
        </button>
      </p>

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[12px] text-gray-400 font-light">Or, Login With</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        className="w-full flex items-center justify-center gap-2.5 py-3 border border-gray-300
                   hover:bg-gray-100 active:bg-gray-200 transition-colors rounded text-[13px]
                   text-gray-700 font-light"
      >
        <GoogleIcon />
        Google
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SIGN UP FORM
// ─────────────────────────────────────────────────────────────────────────────

function SignupForm() {
  const { openLogin, closeAuth } = useAuth();
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [confirm,     setConfirm]     = useState("");
  const [showPw,      setShowPw]      = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors,      setErrors]      = useState({});
  const [apiError,    setApiError]    = useState("");
  const [loading,     setLoading]     = useState(false);

  const validate = () => {
    const e = {};
    if (!email)                           e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email    = "Enter a valid email";
    if (!password)                        e.password = "Password is required";
    else if (password.length < 8)         e.password = "At least 8 characters required";
    if (!confirm)                         e.confirm  = "Please confirm your password";
    else if (confirm !== password)        e.confirm  = "Passwords do not match";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    setApiError("");
    if (Object.keys(e).length) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    // TODO: replace with real API call
    // On success: closeAuth();
  };

  return (
    <div className="flex flex-col gap-4">
      {apiError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded text-[12px] text-red-600 font-light">
          {apiError}
        </div>
      )}

      <Input
        placeholder="Please enter your Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <div>
        <Input
          placeholder="Please enter your Password"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          rightEl={
            <button onClick={() => setShowPw(!showPw)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
              <EyeIcon open={showPw} />
            </button>
          }
        />
        <PasswordStrength password={password} />
      </div>

      <Input
        placeholder="Please enter your Password again"
        type={showConfirm ? "text" : "password"}
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        error={errors.confirm}
        rightEl={
          <button onClick={() => setShowConfirm(!showConfirm)} className="text-gray-400 hover:text-gray-600 flex-shrink-0">
            <EyeIcon open={showConfirm} />
          </button>
        }
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3.5 bg-[#1a1a1a] hover:bg-[#333333] active:bg-[#000000] rounded
                   text-white text-[14px] font-medium tracking-wide transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {loading ? "Creating account..." : "Sign up"}
      </button>

      <p className="text-center text-[13px] text-gray-500 font-light">
        Do you have an account?{" "}
        <button onClick={openLogin} className="text-[#1c3ccb] font-medium hover:underline underline-offset-2">
          Login
        </button>
      </p>

      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-[12px] text-gray-400 font-light">Or, Login With</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <button
        className="w-full flex items-center justify-center gap-2.5 py-3 border border-gray-300
                   hover:bg-gray-100 active:bg-gray-300 transition-colors rounded text-[13px]
                   text-gray-700 font-light"
      >
        <GoogleIcon />
        Google
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FORGOT PASSWORD FORM
// ─────────────────────────────────────────────────────────────────────────────

function ForgotForm() {
  const { openLogin } = useAuth();
  const [email,   setEmail]   = useState("");
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);
  const [sent,    setSent]    = useState(false);

  const validate = () => {
    const e = {};
    if (!email)                           e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
            stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <div>
          <p className="text-[15px] font-medium text-[#1a1a1a] mb-1">Email Sent!</p>
          <p className="text-[13px] text-gray-500 font-light max-w-xs">
            We sent a password reset link to <span className="text-[#1a1a1a] font-medium">{email}</span>.
            Check your inbox.
          </p>
        </div>
        <button
          onClick={openLogin}
          className="mt-2 text-[13px] text-gray-500 hover:text-[#1a1a1a] transition-colors
                     underline underline-offset-2 font-light"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[13px] text-gray-500 font-light leading-relaxed">
        Enter your email address and we'll send you a link to reset your password.
      </p>

      <Input
        placeholder="Please enter your Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errors.email}
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-3.5 bg-[#1a1a1a] hover:bg-[#333333] active:bg-[#000000] rounded
                   text-white text-[14px] font-medium tracking-wide transition-colors
                   disabled:opacity-60 disabled:cursor-not-allowed mt-1"
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>

      <button
        onClick={openLogin}
        className="text-center text-[13px] text-gray-400 hover:text-[#1a1a1a]
                   transition-colors font-light"
      >
        ← Back to Login
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL — wraps all three forms
// ─────────────────────────────────────────────────────────────────────────────

const TITLES = {
  login:  "Login",
  signup: "Sign up",
  forgot: "Forgot Password",
};

export default function AuthModal() {
  const { mode, closeAuth } = useAuth();
  const isOpen = !!mode;

  return (
    <>
      {/* Backdrop — starts BELOW navbar (top: 57px covers nav height)
          Gray tint so modal outline is clearly visible */}
      <div
        onClick={closeAuth}
        className="fixed left-0 right-0 bottom-0 transition-all duration-300"
        style={{
          top:                  "57px",   // header top row + nav row height
          zIndex:               54,
          pointerEvents:        isOpen ? "auto" : "none",
          opacity:              isOpen ? 1 : 0,
          backdropFilter:       isOpen ? "blur(4px)" : "none",
          WebkitBackdropFilter: isOpen ? "blur(4px)" : "none",
          backgroundColor:      "rgba(160,160,160,0.35)",  // gray tint
        }}
      />

      {/* Modal panel — also starts below navbar */}
      <div
        className="fixed left-0 right-0 bottom-0 flex items-center justify-center px-4"
        style={{
          top:           "57px",
          zIndex:        55,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        <div
          className="bg-white w-full max-w-[420px] rounded shadow-xl
                     transition-all duration-300"
          style={{
            opacity:   isOpen ? 1 : 0,
            transform: isOpen ? "scale(1) translateY(0)" : "scale(0.96) translateY(12px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4 ">
            <div className="w-6" />
            <h2 className="text-[16px] font-semibold text-[#1a1a1a] tracking-wide">
              {TITLES[mode] || ""}
            </h2>
            <button
              onClick={closeAuth}
              className="text-gray-400 hover:text-[#1a1a1a] transition-colors
                         hover:bg-gray-100 p-1 rounded"
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6">
            {mode === "login"  && <LoginForm />}
            {mode === "signup" && <SignupForm />}
            {mode === "forgot" && <ForgotForm />}
          </div>
        </div>
      </div>
    </>
  );
}