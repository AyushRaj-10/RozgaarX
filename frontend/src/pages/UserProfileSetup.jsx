import React, { useState, useEffect, useRef, useContext } from "react";
import { userContext } from "../context/UserContext.jsx";
import { useNavigate } from "react-router-dom";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.5,
      a: Math.random() * 0.4 + 0.05,
    }));
    let raf;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,232,150,${p.a})`;
        ctx.fill();
      });
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(0,232,150,${0.06 * (1 - d / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

const STEPS = [
  { id: "role", label: "Your Role" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "preferences", label: "Preferences" },
];

const SKILL_OPTIONS = [
  "React", "Node.js", "Python", "TypeScript", "AWS", "Docker",
  "PostgreSQL", "MongoDB", "GraphQL", "Figma", "Go", "Rust",
  "Kubernetes", "Machine Learning", "iOS", "Android",
];

const ROLE_OPTIONS = [
  ["💻", "Software Engineer"],
  ["🎨", "UI/UX Designer"],
  ["📦", "Product Manager"],
  ["📊", "Data Scientist"],
  ["📣", "Marketing"],
  ["💰", "Finance"],
  ["⚙️", "DevOps / Infra"],
  ["🤝", "Sales"],
];

const UserProfileSetup = () => {
  const { updateUserProfile, createUserData } = useContext(userContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [done, setDone] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    skills: [],
    experienceYears: "",
    currentCompany: "",
    bio: "",
    location: "",
    workType: "",
    salaryMin: "",
    salaryMax: "",
    openToRoles: [],
  });

  const [heroRef, heroVisible] = useInView(0.1);

  const toggleSkill = (skill) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const toggleOpenRole = (role) => {
    setFormData(prev => ({
      ...prev,
      openToRoles: prev.openToRoles.includes(role)
        ? prev.openToRoles.filter(r => r !== role)
        : [...prev.openToRoles, role],
    }));
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(s => s + 1);
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const handleSubmit = async () => {
  setSaving(true);

  const authId = localStorage.getItem("authId");

  const payload = {
    auth_id : authId,
    role: formData.role,
    skills: formData.skills,
    experience_years: formData.experienceYears,  
    current_company: formData.currentCompany,
    bio: formData.bio,
    location: formData.location,
    work_type: formData.workType,
    salary_min: formData.salaryMin ? Number(formData.salaryMin) : null,
    salary_max: formData.salaryMax ? Number(formData.salaryMax) : null,
    open_to_roles: formData.openToRoles,
    notice_period: formData.noticePeriod,
    linkedin: formData.linkedin,
    portfolio: formData.portfolio
  };

  await createUserData(payload);

  setSaving(false);
  setDone(true);
  setTimeout(() => navigate("/dashboard"), 2000);
};

  const progress = ((step) / (STEPS.length - 1)) * 100;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #020d1a;
          --bg2: #041626;
          --teal: #00e896;
          --teal-dim: rgba(0,232,150,0.12);
          --teal-glow: rgba(0,232,150,0.3);
          --white: #ffffff;
          --muted: rgba(255,255,255,0.45);
          --border: rgba(255,255,255,0.07);
          --card: rgba(255,255,255,0.03);
          --input-bg: rgba(255,255,255,0.04);
          --input-border: rgba(255,255,255,0.1);
          --input-focus: rgba(0,232,150,0.4);
        }

        html { scroll-behavior: smooth; }
        body, #root {
          background: var(--bg); color: var(--white);
          font-family: 'DM Sans', sans-serif; overflow-x: hidden; min-height: 100vh;
        }

        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,232,150,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,232,150,0.025) 1px, transparent 1px);
          background-size: 44px 44px;
        }

        /* ── PAGE LAYOUT ── */
        .setup-page {
          position: relative; z-index: 1; min-height: 100vh;
          display: flex; flex-direction: column; align-items: center;
          padding: 0 24px 80px;
        }

        /* ── TOPBAR ── */
        .topbar {
          width: 100%; max-width: 860px;
          display: flex; align-items: center; justify-content: space-between;
          padding: 28px 0 0;
        }
        .logo {
          font-family: 'Syne', sans-serif; font-size: 20px;
          font-weight: 800; color: var(--teal);
          letter-spacing: -0.5px;
        }
        .topbar-step {
          font-size: 12px; color: var(--muted); font-weight: 500;
          letter-spacing: 0.5px;
        }

        /* ── FADE IN ── */
        .fade-up { opacity: 0; transform: translateY(28px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.08s; }
        .delay-2 { transition-delay: 0.16s; }
        .delay-3 { transition-delay: 0.24s; }

        /* ── CHIP ── */
        .chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--teal-dim); border: 1px solid rgba(0,232,150,0.2);
          color: var(--teal); border-radius: 100px; padding: 5px 14px;
          font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
        }
        .chip-dot {
          width: 6px; height: 6px; border-radius: 50%; background: var(--teal);
          animation: pulse 1.8s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

        /* ── HERO HEADER ── */
        .setup-hero {
          text-align: center; padding: 56px 0 0; max-width: 560px; margin: 0 auto;
        }
        .setup-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(32px, 5vw, 52px);
          font-weight: 800; line-height: 1.05; letter-spacing: -1.5px;
          margin: 16px 0 14px;
        }
        .setup-title .accent {
          color: var(--teal); position: relative; display: inline-block;
        }
        .setup-title .accent::after {
          content: ''; position: absolute; left: 0; bottom: -3px;
          width: 100%; height: 2px;
          background: linear-gradient(90deg, var(--teal), transparent);
          border-radius: 2px;
        }
        .setup-sub {
          font-size: 15px; color: var(--muted); line-height: 1.65;
          font-weight: 300; margin-bottom: 40px;
        }

        /* ── STEPPER ── */
        .stepper {
          display: flex; align-items: center; gap: 0;
          max-width: 560px; width: 100%; margin: 0 auto 48px;
        }
        .stepper-item {
          display: flex; flex-direction: column; align-items: center;
          flex: 1; position: relative;
        }
        .stepper-item:not(:last-child)::after {
          content: ''; position: absolute; top: 15px; left: 50%; width: 100%;
          height: 1px;
          background: linear-gradient(90deg, var(--teal), rgba(255,255,255,0.08));
          transition: background 0.4s;
        }
        .stepper-item.done:not(:last-child)::after,
        .stepper-item.active:not(:last-child)::after {
          background: linear-gradient(90deg, var(--teal), rgba(0,232,150,0.15));
        }
        .stepper-dot {
          width: 30px; height: 30px; border-radius: 50%;
          border: 1.5px solid rgba(255,255,255,0.12);
          background: var(--bg2);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 11px; font-weight: 700;
          color: var(--muted); position: relative; z-index: 1;
          transition: all 0.3s;
        }
        .stepper-item.active .stepper-dot {
          border-color: var(--teal); color: var(--teal);
          background: var(--teal-dim); box-shadow: 0 0 16px var(--teal-glow);
        }
        .stepper-item.done .stepper-dot {
          border-color: var(--teal); background: var(--teal);
          color: var(--bg);
        }
        .stepper-label {
          font-size: 10px; color: var(--muted); margin-top: 6px;
          text-align: center; letter-spacing: 0.3px;
          transition: color 0.3s;
        }
        .stepper-item.active .stepper-label { color: var(--teal); font-weight: 600; }
        .stepper-item.done .stepper-label { color: rgba(0,232,150,0.6); }

        /* ── CARD ── */
        .setup-card {
          width: 100%; max-width: 680px;
          background: var(--card);
          border: 1px solid var(--border);
          border-radius: 20px; padding: 44px 48px;
          position: relative; overflow: hidden;
          animation: cardSlide 0.45s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes cardSlide {
          from { opacity: 0; transform: translateY(20px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .setup-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,232,150,0.3), transparent);
        }

        .card-step-label {
          font-size: 11px; font-weight: 600; letter-spacing: 1.5px;
          text-transform: uppercase; color: var(--teal);
          margin-bottom: 6px;
        }
        .card-title {
          font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
          margin-bottom: 6px; letter-spacing: -0.5px;
        }
        .card-desc {
          font-size: 13px; color: var(--muted); margin-bottom: 32px;
          font-weight: 300; line-height: 1.6;
        }

        /* ── FORM ELEMENTS ── */
        .field { margin-bottom: 20px; }
        .field label {
          display: block; font-size: 12px; font-weight: 600;
          letter-spacing: 0.5px; color: rgba(255,255,255,0.6);
          text-transform: uppercase; margin-bottom: 8px;
        }
        .field input, .field textarea, .field select {
          width: 100%; background: var(--input-bg);
          border: 1px solid var(--input-border);
          border-radius: 10px; padding: 13px 16px;
          color: var(--white); font-family: 'DM Sans', sans-serif;
          font-size: 14px; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          -webkit-appearance: none; appearance: none;
        }
        .field input::placeholder, .field textarea::placeholder { color: rgba(255,255,255,0.2); }
        .field input:focus, .field textarea:focus, .field select:focus {
          border-color: rgba(0,232,150,0.5);
          box-shadow: 0 0 0 3px rgba(0,232,150,0.08);
        }
        .field textarea { resize: vertical; min-height: 96px; }
        .field select { cursor: pointer; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='rgba(255,255,255,0.4)' d='M6 8L1 3h10z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; padding-right: 40px; }
        .field select option { background: #041626; }

        .field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        @media(max-width: 540px) { .field-row { grid-template-columns: 1fr; } }

        /* ── ROLE GRID ── */
        .role-grid {
          display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 10px; margin-bottom: 4px;
        }
        .role-pill {
          display: flex; align-items: center; gap: 10px;
          background: var(--input-bg); border: 1px solid var(--input-border);
          border-radius: 10px; padding: 12px 14px;
          cursor: pointer; transition: all 0.2s; user-select: none;
          font-size: 13px; color: rgba(255,255,255,0.65);
        }
        .role-pill:hover { border-color: rgba(0,232,150,0.25); color: var(--white); }
        .role-pill.selected {
          border-color: var(--teal); background: var(--teal-dim); color: var(--teal);
        }
        .role-pill-emoji { font-size: 18px; }

        /* ── SKILL CHIPS ── */
        .skill-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 8px; }
        .skill-chip {
          padding: 7px 14px; border-radius: 100px;
          background: var(--input-bg); border: 1px solid var(--input-border);
          font-size: 12px; color: rgba(255,255,255,0.6);
          cursor: pointer; transition: all 0.2s; user-select: none;
        }
        .skill-chip:hover { border-color: rgba(0,232,150,0.3); color: var(--white); }
        .skill-chip.selected {
          background: var(--teal-dim); border-color: rgba(0,232,150,0.5);
          color: var(--teal); font-weight: 600;
        }
        .skill-count { font-size: 11px; color: var(--muted); margin-top: 6px; }

        /* ── WORK TYPE TOGGLE ── */
        .toggle-group { display: flex; gap: 8px; flex-wrap: wrap; }
        .toggle-btn {
          flex: 1; min-width: 100px;
          padding: 11px 16px; border-radius: 10px;
          background: var(--input-bg); border: 1px solid var(--input-border);
          color: rgba(255,255,255,0.55); font-size: 13px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s; text-align: center;
        }
        .toggle-btn:hover { border-color: rgba(0,232,150,0.2); color: var(--white); }
        .toggle-btn.active {
          background: var(--teal-dim); border-color: rgba(0,232,150,0.5);
          color: var(--teal); font-weight: 600;
        }

        /* ── SALARY RANGE ── */
        .salary-display {
          text-align: center; font-family: 'Syne', sans-serif;
          font-size: 22px; font-weight: 800; color: var(--teal);
          margin: 8px 0 16px;
        }
        .salary-sub { font-size: 12px; color: var(--muted); }
        .range-track { position: relative; height: 4px; background: var(--border); border-radius: 2px; margin: 20px 0 12px; }
        .range-fill {
          position: absolute; height: 100%; background: var(--teal); border-radius: 2px;
          transition: left 0.1s, right 0.1s;
        }
        .range-input {
          position: absolute; top: -8px; width: 100%;
          -webkit-appearance: none; appearance: none;
          background: transparent; pointer-events: none;
          outline: none;
        }
        .range-input::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 20px; height: 20px; border-radius: 50%;
          background: var(--teal); border: 2px solid var(--bg);
          cursor: pointer; pointer-events: all;
          box-shadow: 0 0 8px var(--teal-glow);
          transition: transform 0.2s;
        }
        .range-input::-webkit-slider-thumb:hover { transform: scale(1.2); }

        /* ── NAVIGATION ── */
        .card-nav {
          display: flex; align-items: center; justify-content: space-between;
          margin-top: 36px; padding-top: 28px;
          border-top: 1px solid var(--border);
        }
        .btn-back {
          padding: 12px 24px; background: transparent; color: var(--muted);
          border: 1px solid var(--border); border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.2s;
        }
        .btn-back:hover { color: var(--white); border-color: rgba(255,255,255,0.2); }
        .btn-next {
          padding: 13px 32px; background: var(--teal); color: var(--bg);
          border: none; border-radius: 10px;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.25s;
          box-shadow: 0 4px 20px var(--teal-glow);
          display: flex; align-items: center; gap: 8px;
        }
        .btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 32px var(--teal-glow); background: #00ffa3; }
        .btn-next:disabled { opacity: 0.4; cursor: not-allowed; }
        .btn-next.loading { opacity: 0.7; }

        /* ── DIVIDER ── */
        .divider { height: 1px; background: var(--border); margin: 24px 0; }

        /* ── SUCCESS ── */
        .success-state {
          text-align: center; padding: 32px 0;
          animation: cardSlide 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        .success-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: var(--teal-dim); border: 2px solid rgba(0,232,150,0.3);
          display: flex; align-items: center; justify-content: center;
          font-size: 32px; margin: 0 auto 24px;
          animation: successPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
        }
        @keyframes successPop {
          from { transform: scale(0); }
          to   { transform: scale(1); }
        }
        .success-title {
          font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 800;
          margin-bottom: 10px; letter-spacing: -0.5px;
        }
        .success-sub { font-size: 14px; color: var(--muted); line-height: 1.6; }
        .success-redirect { font-size: 12px; color: rgba(0,232,150,0.5); margin-top: 20px; }

        /* ── PROGRESS BAR ── */
        .progress-bar-wrap {
          width: 100%; max-width: 680px;
          height: 2px; background: var(--border); border-radius: 1px;
          margin: 0 auto 28px; overflow: hidden;
        }
        .progress-bar-fill {
          height: 100%; background: var(--teal); border-radius: 1px;
          transition: width 0.5s cubic-bezier(0.22,1,0.36,1);
          box-shadow: 0 0 8px var(--teal-glow);
        }

        @media(max-width: 600px) {
          .setup-card { padding: 28px 20px; }
          .setup-hero { padding-top: 36px; }
        }
      `}</style>

      <div style={{ position: "relative", background: "var(--bg)", minHeight: "100vh" }}>
        <div className="bg-grid" />
        <ParticleField />

        <div className="setup-page">
          {/* Topbar */}
          <div className="topbar">
            <div className="logo">RozgaarX</div>
            <div className="topbar-step">Step {step + 1} of {STEPS.length}</div>
          </div>

          {/* Hero header */}
          <div className="setup-hero" ref={heroRef}>
            <div className={`fade-up ${heroVisible ? "visible" : ""}`}>
              <span className="chip"><span className="chip-dot" /> Profile Setup</span>
            </div>
            <h1 className={`setup-title fade-up delay-1 ${heroVisible ? "visible" : ""}`}>
              Tell us about<br /><span className="accent">yourself.</span>
            </h1>
            <p className={`setup-sub fade-up delay-2 ${heroVisible ? "visible" : ""}`}>
              A rich profile means better matches. Takes about 3 minutes.
            </p>
          </div>

          {/* Stepper */}
          <div className={`stepper fade-up delay-3 ${heroVisible ? "visible" : ""}`}>
            {STEPS.map((s, i) => (
              <div
                key={s.id}
                className={`stepper-item ${i < step ? "done" : ""} ${i === step ? "active" : ""}`}
              >
                <div className="stepper-dot">
                  {i < step ? "✓" : i + 1}
                </div>
                <div className="stepper-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
          </div>

          {/* Card */}
          {done ? (
            <div className="setup-card" style={{ maxWidth: 680, width: "100%" }}>
              <div className="success-state">
                <div className="success-icon">🎉</div>
                <div className="success-title">Profile complete!</div>
                <p className="success-sub">
                  We're matching you with the best roles right now.<br />
                  You'll love what we found.
                </p>
                <div className="success-redirect">Redirecting to your dashboard…</div>
              </div>
            </div>
          ) : (
            <div className="setup-card" key={step}>

              {/* ── STEP 0: Role ── */}
              {step === 0 && (
                <>
                  <div className="card-step-label">Step 1 — Role</div>
                  <div className="card-title">What best describes you?</div>
                  <p className="card-desc">We'll tailor your experience based on your primary role.</p>
                  <div className="role-grid">
                    {ROLE_OPTIONS.map(([emoji, role]) => (
                      <div
                        key={role}
                        className={`role-pill ${formData.role === role ? "selected" : ""}`}
                        onClick={() => setFormData(p => ({ ...p, role }))}
                      >
                        <span className="role-pill-emoji">{emoji}</span>
                        <span>{role}</span>
                      </div>
                    ))}
                  </div>
                  <div className="divider" />
                  <div className="field">
                    <label>Current / Most Recent Company</label>
                    <input
                      type="text"
                      placeholder="e.g. Google, Razorpay, Stealth Startup…"
                      value={formData.currentCompany}
                      onChange={e => setFormData(p => ({ ...p, currentCompany: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <label>Location</label>
                    <input
                      type="text"
                      placeholder="e.g. Bangalore, Remote, Mumbai…"
                      value={formData.location}
                      onChange={e => setFormData(p => ({ ...p, location: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {/* ── STEP 1: Skills ── */}
              {step === 1 && (
                <>
                  <div className="card-step-label">Step 2 — Skills</div>
                  <div className="card-title">What's in your toolkit?</div>
                  <p className="card-desc">Pick everything that applies. This powers your AI matching score.</p>
                  <div className="skill-wrap">
                    {SKILL_OPTIONS.map(skill => (
                      <div
                        key={skill}
                        className={`skill-chip ${formData.skills.includes(skill) ? "selected" : ""}`}
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                      </div>
                    ))}
                  </div>
                  <div className="skill-count">
                    {formData.skills.length} selected
                  </div>
                  <div className="divider" />
                  <div className="field">
                    <label>Short Bio</label>
                    <textarea
                      placeholder="Tell us a bit about yourself — what you've built, what excites you, what you're looking for next…"
                      value={formData.bio}
                      onChange={e => setFormData(p => ({ ...p, bio: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {/* ── STEP 2: Experience ── */}
              {step === 2 && (
                <>
                  <div className="card-step-label">Step 3 — Experience</div>
                  <div className="card-title">How long have you been at it?</div>
                  <p className="card-desc">This helps us surface roles with the right seniority level for you.</p>
                  <div className="field">
                    <label>Years of Experience</label>
                    <select
                      value={formData.experienceYears}
                      onChange={e => setFormData(p => ({ ...p, experienceYears: e.target.value }))}
                    >
                      <option value="">Select range…</option>
                      <option value="0-1">Less than 1 year</option>
                      <option value="1-2">1 – 2 years</option>
                      <option value="2-4">2 – 4 years</option>
                      <option value="4-7">4 – 7 years</option>
                      <option value="7-10">7 – 10 years</option>
                      <option value="10+">10+ years</option>
                    </select>
                  </div>
                  <div className="field">
                    <label>Work Preference</label>
                    <div className="toggle-group">
                      {["Remote", "Hybrid", "On-site", "Open to all"].map(t => (
                        <button
                          key={t}
                          className={`toggle-btn ${formData.workType === t ? "active" : ""}`}
                          onClick={() => setFormData(p => ({ ...p, workType: t }))}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="divider" />
                  <div className="field">
                    <label>Open to Roles</label>
                    <div className="skill-wrap">
                      {["Full-time", "Contract", "Part-time", "Internship", "Freelance"].map(r => (
                        <div
                          key={r}
                          className={`skill-chip ${formData.openToRoles.includes(r) ? "selected" : ""}`}
                          onClick={() => toggleOpenRole(r)}
                        >
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── STEP 3: Preferences / Salary ── */}
              {step === 3 && (
                <>
                  <div className="card-step-label">Step 4 — Preferences</div>
                  <div className="card-title">What are you worth?</div>
                  <p className="card-desc">Set your expected salary range. This stays private from employers until you apply.</p>

                  <div className="salary-display">
                    ₹{Number(formData.salaryMin || 8).toLocaleString()}L
                    <span style={{ color: "var(--muted)", fontSize: 18, fontWeight: 400, margin: "0 8px" }}>–</span>
                    ₹{Number(formData.salaryMax || 24).toLocaleString()}L
                    <div className="salary-sub">per annum · CTC</div>
                  </div>

                  <div className="field-row" style={{ marginBottom: 0 }}>
                    <div className="field">
                      <label>Min (LPA)</label>
                      <input
                        type="number"
                        min="1" max="100"
                        placeholder="e.g. 8"
                        value={formData.salaryMin}
                        onChange={e => setFormData(p => ({ ...p, salaryMin: e.target.value }))}
                      />
                    </div>
                    <div className="field">
                      <label>Max (LPA)</label>
                      <input
                        type="number"
                        min="1" max="200"
                        placeholder="e.g. 24"
                        value={formData.salaryMax}
                        onChange={e => setFormData(p => ({ ...p, salaryMax: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="divider" />

                  <div className="field">
                    <label>Notice Period</label>
                    <select
                      value={formData.noticePeriod || ""}
                      onChange={e => setFormData(p => ({ ...p, noticePeriod: e.target.value }))}
                    >
                      <option value="">Select…</option>
                      <option value="immediate">Immediately available</option>
                      <option value="15">15 days</option>
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                    </select>
                  </div>

                  <div className="field">
                    <label>LinkedIn Profile (optional)</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/yourname"
                      value={formData.linkedin || ""}
                      onChange={e => setFormData(p => ({ ...p, linkedin: e.target.value }))}
                    />
                  </div>
                  <div className="field">
                    <label>Portfolio / GitHub (optional)</label>
                    <input
                      type="url"
                      placeholder="https://github.com/yourhandle"
                      value={formData.portfolio || ""}
                      onChange={e => setFormData(p => ({ ...p, portfolio: e.target.value }))}
                    />
                  </div>
                </>
              )}

              {/* Nav */}
              <div className="card-nav">
                <button className="btn-back" onClick={handleBack} disabled={step === 0}>
                  ← Back
                </button>
                {step < STEPS.length - 1 ? (
                  <button className="btn-next" onClick={handleNext}>
                    Continue →
                  </button>
                ) : (
                  <button
                    className={`btn-next ${saving ? "loading" : ""}`}
                    onClick={handleSubmit}
                    disabled={saving}
                  >
                    {saving ? "Saving…" : "Complete Profile ✓"}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default UserProfileSetup;