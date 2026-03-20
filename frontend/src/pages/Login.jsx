import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext.jsx";
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { loginUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("candidate");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginUser(formData.email, formData.password);
      console.log("Login successful");
      navigate("/");
    } catch (err) {
      setError("Login failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .login-root {
          min-height: 100vh;
          background: #020d1a;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 24px 16px;
        }

        /* Grid background */
        .login-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,232,150,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,232,150,0.025) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
        }

        /* Top-left glow orb */
        .login-root::after {
          content: '';
          position: fixed;
          width: 700px; height: 700px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,232,150,0.07) 0%, transparent 70%);
          top: -250px; left: -200px;
          pointer-events: none;
        }

        /* Bottom-right orb */
        .login-orb2 {
          position: fixed;
          width: 500px; height: 500px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,80,255,0.06) 0%, transparent 70%);
          bottom: -180px; right: -160px;
          pointer-events: none;
          z-index: 0;
        }

        /* ── Logo ── */
        .login-logo {
          display: flex; flex-direction: column; align-items: center;
          margin-bottom: 28px; position: relative; z-index: 1;
          animation: fadeSlideDown 0.6s ease both;
        }
        .login-logo-row {
          display: flex; align-items: center; gap: 9px; margin-bottom: 4px;
        }
        .login-logo-icon {
          width: 34px; height: 34px; background: #00e896; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .login-logo-name {
          font-family: 'Syne', sans-serif; font-size: 23px; font-weight: 800;
          color: #00e896; letter-spacing: -0.5px;
        }
        .login-logo-sub {
          font-size: 10px; letter-spacing: 3px; text-transform: uppercase;
          color: rgba(255,255,255,0.25); font-weight: 500;
        }

        /* ── Card ── */
        .login-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(24px);
          border-radius: 22px;
          padding: 36px 32px;
          width: 100%; max-width: 420px;
          position: relative; z-index: 1;
          box-shadow: 0 0 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
          animation: fadeSlideUp 0.6s ease 0.1s both;
        }

        /* ── Role toggle ── */
        .login-toggle {
          display: flex; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px; padding: 4px; margin-bottom: 28px;
        }
        .login-toggle-btn {
          flex: 1; padding: 10px; border: none; background: transparent;
          border-radius: 9px; font-family: 'DM Sans', sans-serif;
          font-size: 13px; font-weight: 500; cursor: pointer;
          transition: all 0.22s; color: rgba(255,255,255,0.35);
        }
        .login-toggle-btn.active {
          background: #00e896; color: #020d1a; font-weight: 600;
          box-shadow: 0 2px 14px rgba(0,232,150,0.35);
        }

        /* ── Heading ── */
        .login-heading {
          font-family: 'Syne', sans-serif; font-size: 25px; font-weight: 700;
          color: #fff; margin-bottom: 5px; letter-spacing: -0.5px;
        }
        .login-sub {
          font-size: 13px; color: rgba(255,255,255,0.35); margin-bottom: 24px;
        }
        .login-sub span { color: #00e896; cursor: pointer; font-weight: 500; }
        .login-sub span:hover { text-decoration: underline; }

        /* ── Social buttons ── */
        .login-socials {
          display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 20px;
        }
        .login-social-btn {
          display: flex; align-items: center; justify-content: center; gap: 8px;
          padding: 10px 12px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: rgba(255,255,255,0.65);
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .login-social-btn:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.14);
          color: #fff;
        }
        .login-social-btn svg { width: 16px; height: 16px; flex-shrink: 0; }

        /* ── Divider ── */
        .login-divider {
          display: flex; align-items: center; gap: 12px; margin-bottom: 20px;
        }
        .login-divider-line { flex: 1; height: 1px; background: rgba(255,255,255,0.07); }
        .login-divider-text {
          font-size: 11px; color: rgba(255,255,255,0.22);
          letter-spacing: 1px; text-transform: uppercase;
        }

        /* ── Error ── */
        .login-error {
          background: rgba(255,60,60,0.08);
          border: 1px solid rgba(255,60,60,0.18);
          border-radius: 9px; padding: 10px 14px;
          font-size: 13px; color: #ff7070; margin-bottom: 16px;
        }

        /* ── Input field ── */
        .login-field { margin-bottom: 12px; }
        .login-field-label {
          font-size: 11px; font-weight: 600; letter-spacing: 0.8px;
          text-transform: uppercase; color: rgba(255,255,255,0.3);
          margin-bottom: 6px; display: flex; justify-content: space-between;
          align-items: center;
        }
        .login-forgot {
          color: #00e896; cursor: pointer; font-size: 11px;
          font-weight: 500; letter-spacing: 0; text-transform: none;
          transition: opacity 0.2s;
        }
        .login-forgot:hover { opacity: 0.75; }

        .login-input-wrap {
          display: flex; align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px; padding: 12px 14px;
          transition: border-color 0.2s, background 0.2s;
        }
        .login-input-wrap:focus-within {
          border-color: rgba(0,232,150,0.4);
          background: rgba(0,232,150,0.03);
          box-shadow: 0 0 0 3px rgba(0,232,150,0.06);
        }
        .login-input-icon { color: rgba(255,255,255,0.22); margin-right: 10px; flex-shrink: 0; }
        .login-input-wrap input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #fff; font-family: 'DM Sans', sans-serif; font-size: 14px;
        }
        .login-input-wrap input::placeholder { color: rgba(255,255,255,0.18); }
        .login-eye-btn {
          background: transparent; border: none;
          color: rgba(255,255,255,0.28); cursor: pointer;
          display: flex; transition: color 0.2s; padding: 0;
        }
        .login-eye-btn:hover { color: rgba(255,255,255,0.6); }

        /* ── Submit ── */
        .login-submit {
          width: 100%; margin-top: 8px; padding: 13px;
          background: #00e896; color: #020d1a;
          border: none; border-radius: 10px;
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700;
          cursor: pointer; transition: all 0.22s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 22px rgba(0,232,150,0.28);
          letter-spacing: 0.2px;
        }
        .login-submit:hover:not(:disabled) {
          background: #00ffa3;
          box-shadow: 0 6px 32px rgba(0,232,150,0.45);
          transform: translateY(-1px);
        }
        .login-submit:disabled { opacity: 0.65; cursor: not-allowed; }

        .login-spinner {
          width: 18px; height: 18px;
          border: 2px solid rgba(2,13,26,0.3);
          border-top-color: #020d1a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        .login-arrow { display: inline-block; transition: transform 0.2s; }
        .login-submit:hover:not(:disabled) .login-arrow { transform: translateX(4px); }

        /* ── Footer badges ── */
        .login-footer {
          display: flex; justify-content: center; gap: 20px;
          margin-top: 20px; position: relative; z-index: 1;
          animation: fadeSlideUp 0.6s ease 0.3s both;
        }
        .login-badge {
          display: flex; align-items: center; gap: 5px;
          font-size: 11px; color: rgba(255,255,255,0.18); letter-spacing: 0.5px;
        }

        /* ── Keyframes ── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideDown {
          from { opacity: 0; transform: translateY(-12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="login-root">
        <div className="login-orb2" />

        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-row">
            <div className="login-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="2" width="16" height="20" rx="2" fill="#020d1a" />
                <path d="M8 7h8M8 12h8M8 17h5" stroke="#020d1a" strokeWidth="2" strokeLinecap="round" />
                <rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="#020d1a" />
                <path d="M8 7h8M8 12h8M8 17h5" stroke="#020d1a" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="login-logo-name">RozgaarX</span>
          </div>
          <div className="login-logo-sub">Start your career</div>
        </div>

        {/* Card */}
        <div className="login-card">

          {/* Role toggle */}
          <div className="login-toggle">
            <button
              type="button"
              className={`login-toggle-btn ${role === "candidate" ? "active" : ""}`}
              onClick={() => setRole("candidate")}
            >
              I am a Candidate
            </button>
            <button
              type="button"
              className={`login-toggle-btn ${role === "recruiter" ? "active" : ""}`}
              onClick={() => setRole("recruiter")}
            >
              I am a Recruiter
            </button>
          </div>

          <h2 className="login-heading">Welcome back</h2>
          <p className="login-sub">
            Access your professional dashboard.{" "}
            New here? <span onClick={() => navigate("/register")}>Create an account</span>
          </p>

          {/* Social logins */}
          <div className="login-socials">
            <button type="button" className="login-social-btn">
              <svg viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="login-social-btn">
              <svg viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <circle cx="4" cy="4" r="2"/><rect x="2" y="9" width="4" height="12"/>
              </svg>
              LinkedIn
            </button>
          </div>

          <div className="login-divider">
            <div className="login-divider-line" />
            <span className="login-divider-text">or email</span>
            <div className="login-divider-line" />
          </div>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-field">
              <div className="login-field-label">Email Address</div>
              <div className="login-input-wrap">
                <Mail size={16} className="login-input-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="name@company.com"
                  required
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="login-field-label">
                Password
                <span className="login-forgot">Forgot?</span>
              </div>
              <div className="login-input-wrap">
                <Lock size={16} className="login-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <span className="login-spinner" />
              ) : (
                <>
                  Sign In to Recruitly
                  <span className="login-arrow">→</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Trust badges */}
        <div className="login-footer">
          <div className="login-badge">
            <ShieldCheck size={12} />
            Enterprise Grade
          </div>
          <div className="login-badge">
            <Zap size={12} />
            SSL Encrypted
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;