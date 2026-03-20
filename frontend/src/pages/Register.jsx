import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { Eye, EyeOff, Mail, Lock, User, ShieldCheck, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const { createUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createUser(formData);
      console.log("User registered successfully");
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
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

        /* Background grid */
        .reg-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,255,180,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,180,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* Glow orb */
        .reg-root::after {
          content: '';
          position: fixed;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(0,230,150,0.08) 0%, transparent 70%);
          top: -200px;
          left: -150px;
          pointer-events: none;
        }

        /* Logo */
        .reg-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
          position: relative;
          z-index: 1;
        }

        .reg-logo-mark {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .reg-logo-icon {
          width: 32px;
          height: 32px;
          background: #00e896;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .reg-logo-name {
          font-family: 'Syne', sans-serif;
          font-size: 22px;
          font-weight: 800;
          color: #00e896;
          letter-spacing: -0.5px;
        }

        .reg-logo-sub {
          font-size: 10px;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          font-weight: 500;
        }

        /* Card */
        .reg-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          max-width: 420px;
          position: relative;
          z-index: 1;
          box-shadow: 0 0 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
        }

        /* Role toggle */
        .reg-toggle {
          display: flex;
          background: rgba(255,255,255,0.05);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 28px;
          border: 1px solid rgba(255,255,255,0.06);
        }

        .reg-toggle-btn {
          flex: 1;
          padding: 10px;
          border: none;
          background: transparent;
          border-radius: 9px;
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          color: rgba(255,255,255,0.4);
        }

        .reg-toggle-btn.active {
          background: #00e896;
          color: #020d1a;
          font-weight: 600;
          box-shadow: 0 2px 12px rgba(0,232,150,0.35);
        }

        /* Heading */
        .reg-heading {
          font-family: 'Syne', sans-serif;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
          letter-spacing: -0.5px;
        }

        .reg-sub {
          font-size: 13px;
          color: rgba(255,255,255,0.35);
          margin-bottom: 24px;
        }

        .reg-sub span {
          color: #00e896;
          cursor: pointer;
          font-weight: 500;
        }

        /* Social buttons */
        .reg-socials {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
          margin-bottom: 20px;
        }

        .reg-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          color: rgba(255,255,255,0.7);
          font-family: 'DM Sans', sans-serif;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .reg-social-btn:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.14);
          color: #fff;
        }

        .reg-social-btn svg {
          width: 16px;
          height: 16px;
        }

        /* Divider */
        .reg-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .reg-divider-line {
          flex: 1;
          height: 1px;
          background: rgba(255,255,255,0.07);
        }

        .reg-divider-text {
          font-size: 11px;
          color: rgba(255,255,255,0.25);
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        /* Error */
        .reg-error {
          background: rgba(255,60,60,0.1);
          border: 1px solid rgba(255,60,60,0.2);
          border-radius: 8px;
          padding: 10px 12px;
          font-size: 13px;
          color: #ff6b6b;
          margin-bottom: 16px;
        }

        /* Input group */
        .reg-field {
          margin-bottom: 12px;
        }

        .reg-input-wrap {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 10px;
          padding: 12px 14px;
          transition: border-color 0.2s, background 0.2s;
        }

        .reg-input-wrap:focus-within {
          border-color: rgba(0,232,150,0.4);
          background: rgba(0,232,150,0.03);
        }

        .reg-input-icon {
          color: rgba(255,255,255,0.25);
          margin-right: 10px;
          flex-shrink: 0;
        }

        .reg-input-wrap input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 14px;
        }

        .reg-input-wrap input::placeholder {
          color: rgba(255,255,255,0.2);
        }

        .reg-eye-btn {
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.3);
          cursor: pointer;
          padding: 0;
          display: flex;
          transition: color 0.2s;
        }

        .reg-eye-btn:hover { color: rgba(255,255,255,0.6); }

        /* Terms */
        .reg-terms {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
          margin-top: 4px;
        }

        .reg-terms input[type="checkbox"] {
          width: 15px;
          height: 15px;
          accent-color: #00e896;
          cursor: pointer;
        }

        .reg-terms label {
          font-size: 12px;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
        }

        .reg-terms label span {
          color: #00e896;
        }

        /* Submit */
        .reg-submit {
          width: 100%;
          padding: 13px;
          background: #00e896;
          color: #020d1a;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.2px;
          box-shadow: 0 4px 20px rgba(0,232,150,0.3);
        }

        .reg-submit:hover:not(:disabled) {
          background: #00ffa3;
          box-shadow: 0 6px 28px rgba(0,232,150,0.45);
          transform: translateY(-1px);
        }

        .reg-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .reg-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(2,13,26,0.3);
          border-top-color: #020d1a;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        /* Footer trust badges */
        .reg-footer {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 20px;
          position: relative;
          z-index: 1;
        }

        .reg-badge {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 11px;
          color: rgba(255,255,255,0.2);
          letter-spacing: 0.5px;
        }

        /* Arrow icon */
        .reg-arrow {
          display: inline-block;
          transition: transform 0.2s;
        }
        .reg-submit:hover:not(:disabled) .reg-arrow {
          transform: translateX(3px);
        }
      `}</style>

      <div className="reg-root">
        {/* Logo */}
        <div className="reg-logo">
          <div className="reg-logo-mark">
            <div className="reg-logo-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" fill="#020d1a"/>
                <path d="M9 7h6M9 12h6M9 17h4" stroke="#020d1a" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="reg-logo-name">RozgaarX</span>
          </div>
          <div className="reg-logo-sub">Start you Career</div>
        </div>

        {/* Card */}
        <div className="reg-card">

          {/* Role Toggle */}
          <div className="reg-toggle">
            <button
              type="button"
              className={`reg-toggle-btn ${formData.role === "user" ? "active" : ""}`}
              onClick={() => setFormData((p) => ({ ...p, role: "user" }))}
            >
              I am a Candidate
            </button>
            <button
              type="button"
              className={`reg-toggle-btn ${formData.role === "recruiter" ? "active" : ""}`}
              onClick={() => setFormData((p) => ({ ...p, role: "recruiter" }))}
            >
              I am a Recruiter
            </button>
          </div>

          <h2 className="reg-heading">Create an account</h2>
          <p className="reg-sub">
            Already have an account? <span>Sign in</span>
          </p>

          {/* Social logins */}
          <div className="reg-socials">
            <button type="button" className="reg-social-btn">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button type="button" className="reg-social-btn">
              <svg viewBox="0 0 24 24" fill="#0A66C2">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2" fill="#0A66C2"/>
              </svg>
              LinkedIn
            </button>
          </div>

          <div className="reg-divider">
            <div className="reg-divider-line"/>
            <span className="reg-divider-text">or email</span>
            <div className="reg-divider-line"/>
          </div>

          {error && <div className="reg-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Username */}
            <div className="reg-field">
              <div className="reg-input-wrap">
                <User size={16} className="reg-input-icon" />
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Email */}
            <div className="reg-field">
              <div className="reg-input-wrap">
                <Mail size={16} className="reg-input-icon" />
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
            <div className="reg-field">
              <div className="reg-input-wrap">
                <Lock size={16} className="reg-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="reg-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="reg-terms">
              <input type="checkbox" id="terms" name="terms" required />
              <label htmlFor="terms">
                I agree to the <span>Terms of Service</span>
              </label>
            </div>

            {/* Submit */}
            <button type="submit" className="reg-submit" disabled={loading}>
              {loading ? (
                <span className="reg-spinner" />
              ) : (
                <>
                  Create Account
                  <span className="reg-arrow">→</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Trust badges */}
        <div className="reg-footer">
          <div className="reg-badge">
            <ShieldCheck size={12} />
            Enterprise Grade
          </div>
          <div className="reg-badge">
            <Zap size={12} />
            SSL Encrypted
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;