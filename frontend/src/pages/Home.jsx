import React, { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar.jsx";
import { useNavigate } from "react-router-dom";

/* ─── tiny hook: element in viewport ─── */
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

/* ─── Animated counter ─── */
function Counter({ end, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [ref, visible] = useInView(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [visible, end, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ─── Floating particle canvas ─── */
function ParticleField() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let W = canvas.width = window.innerWidth;
    let H = canvas.height = window.innerHeight;
    const particles = Array.from({ length: 60 }, () => ({
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
      // connect nearby
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
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }} />;
}

/* ═══════════════════════════════════ MAIN ═══════════════════════════════════ */
const Home = () => {
  const [heroRef, heroVisible] = useInView(0.1);
  const [statsRef, statsVisible] = useInView(0.2);
  const [featRef, featVisible] = useInView(0.1);
  const [howRef, howVisible] = useInView(0.1);
  const [testRef, testVisible] = useInView(0.1);
  const [ctaRef, ctaVisible] = useInView(0.2);

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
        }

        html { scroll-behavior: smooth; }

        body, #root { background: var(--bg); color: var(--white); font-family: 'DM Sans', sans-serif; overflow-x: hidden; }

        /* ── LAYOUT ── */
        .page { position: relative; background: var(--bg); min-height: 100vh; }

        /* ── BG GRID ── */
        .bg-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,232,150,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,232,150,0.025) 1px, transparent 1px);
          background-size: 44px 44px;
        }

        /* ── SECTION WRAPPERS ── */
        .section { position: relative; z-index: 1; padding: 100px 24px; }
        .container { max-width: 1140px; margin: 0 auto; }

        /* ── FADE-IN ANIMATION ── */
        .fade-up { opacity: 0; transform: translateY(36px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .fade-up.visible { opacity: 1; transform: translateY(0); }
        .delay-1 { transition-delay: 0.1s; }
        .delay-2 { transition-delay: 0.2s; }
        .delay-3 { transition-delay: 0.3s; }
        .delay-4 { transition-delay: 0.4s; }
        .delay-5 { transition-delay: 0.5s; }
        .delay-6 { transition-delay: 0.6s; }

        /* ── LABEL CHIP ── */
        .chip {
          display: inline-flex; align-items: center; gap: 6px;
          background: var(--teal-dim); border: 1px solid rgba(0,232,150,0.2);
          color: var(--teal); border-radius: 100px; padding: 5px 14px;
          font-size: 11px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;
          margin-bottom: 20px;
        }
        .chip-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); animation: pulse 1.8s ease-in-out infinite; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.7)} }

        /* ═══════════ HERO ═══════════ */
        .hero {
          min-height: 100vh; display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          text-align: center; padding: 140px 24px 80px; position: relative; z-index: 1;
        }

        .hero-eyebrow { margin-bottom: 28px; }

        .hero-title {
          font-family: 'Syne', sans-serif;
          font-size: clamp(44px, 7vw, 88px);
          font-weight: 800; line-height: 1.0; letter-spacing: -2px;
          color: var(--white); margin-bottom: 28px;
        }

        .hero-title .accent {
          color: var(--teal);
          position: relative;
          display: inline-block;
        }

        .hero-title .accent::after {
          content: '';
          position: absolute; left: 0; bottom: -4px;
          width: 100%; height: 3px;
          background: linear-gradient(90deg, var(--teal), transparent);
          border-radius: 2px;
        }

        .hero-sub {
          font-size: clamp(15px, 2vw, 18px); color: var(--muted);
          max-width: 540px; margin: 0 auto 44px; line-height: 1.7; font-weight: 300;
        }

        .hero-ctas { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; margin-bottom: 60px; }

        .btn-primary {
          padding: 14px 32px; background: var(--teal); color: var(--bg);
          border: none; border-radius: 10px; font-family: 'Syne', sans-serif;
          font-size: 14px; font-weight: 700; cursor: pointer; letter-spacing: 0.3px;
          box-shadow: 0 4px 24px var(--teal-glow);
          transition: all 0.25s; display: inline-flex; align-items: center; gap: 8px;
        }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 36px var(--teal-glow); background: #00ffa3; }

        .btn-ghost {
          padding: 14px 32px; background: transparent; color: var(--white);
          border: 1px solid var(--border); border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: 500;
          cursor: pointer; transition: all 0.25s;
        }
        .btn-ghost:hover { border-color: rgba(0,232,150,0.35); color: var(--teal); background: var(--teal-dim); }

        /* HERO SOCIAL PROOF */
        .hero-proof {
          display: flex; align-items: center; gap: 12px; justify-content: center;
          font-size: 13px; color: var(--muted);
        }
        .hero-avatars { display: flex; }
        .hero-avatar {
          width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--bg);
          background: linear-gradient(135deg, #00e896, #0088ff);
          margin-left: -8px; font-size: 11px; display: flex; align-items: center;
          justify-content: center; font-weight: 700; color: var(--bg);
        }
        .hero-avatar:first-child { margin-left: 0; }
        .hero-avatars-stars { color: var(--teal); font-size: 12px; }

        /* HERO MARQUEE */
        .hero-marquee-wrap {
          position: absolute; bottom: 0; left: 0; right: 0;
          overflow: hidden; padding: 20px 0;
          border-top: 1px solid var(--border);
          background: linear-gradient(to bottom, transparent, rgba(2,13,26,0.6));
          mask-image: linear-gradient(90deg, transparent, black 10%, black 90%, transparent);
        }
        .hero-marquee { display: flex; gap: 48px; animation: marquee 28s linear infinite; width: max-content; }
        .hero-marquee-item { display: flex; align-items: center; gap: 8px; color: rgba(255,255,255,0.2); font-size: 12px; font-weight: 500; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; }
        .hero-marquee-sep { color: var(--teal); opacity: 0.4; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }

        /* ═══════════ STATS ═══════════ */
        .stats-grid {
          display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2px; background: var(--border); border: 1px solid var(--border); border-radius: 20px; overflow: hidden;
        }
        .stat-card {
          background: var(--bg); padding: 40px 32px; position: relative; overflow: hidden;
          transition: background 0.3s;
        }
        .stat-card:hover { background: var(--bg2); }
        .stat-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--teal), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .stat-card:hover::before { opacity: 1; }
        .stat-num {
          font-family: 'Syne', sans-serif; font-size: 44px; font-weight: 800;
          color: var(--teal); line-height: 1; margin-bottom: 8px;
        }
        .stat-label { font-size: 13px; color: var(--muted); font-weight: 400; line-height: 1.5; }

        /* ═══════════ FEATURES ═══════════ */
        .section-header { text-align: center; margin-bottom: 64px; }
        .section-title {
          font-family: 'Syne', sans-serif; font-size: clamp(32px, 4vw, 52px);
          font-weight: 800; letter-spacing: -1.5px; line-height: 1.1; margin-bottom: 16px;
        }
        .section-sub { font-size: 16px; color: var(--muted); max-width: 480px; margin: 0 auto; line-height: 1.6; font-weight: 300; }

        .features-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; }

        .feat-card {
          background: var(--card); border: 1px solid var(--border); border-radius: 16px;
          padding: 32px; transition: all 0.3s; position: relative; overflow: hidden;
        }
        .feat-card::after {
          content: ''; position: absolute; inset: 0; border-radius: 16px;
          background: radial-gradient(circle at 80% 20%, rgba(0,232,150,0.06), transparent 60%);
          opacity: 0; transition: opacity 0.3s;
        }
        .feat-card:hover { border-color: rgba(0,232,150,0.2); transform: translateY(-4px); box-shadow: 0 16px 48px rgba(0,0,0,0.3); }
        .feat-card:hover::after { opacity: 1; }

        .feat-icon {
          width: 48px; height: 48px; border-radius: 12px;
          background: var(--teal-dim); border: 1px solid rgba(0,232,150,0.15);
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; margin-bottom: 20px;
        }
        .feat-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; margin-bottom: 10px; }
        .feat-desc { font-size: 14px; color: var(--muted); line-height: 1.65; font-weight: 300; }

        /* LARGE FEATURE CARD */
        .feat-card.large {
          grid-column: span 2;
          display: grid; grid-template-columns: 1fr 1fr; gap: 32px; align-items: center;
        }
        @media(max-width: 768px) { .feat-card.large { grid-column: span 1; grid-template-columns: 1fr; } }

        .feat-visual {
          background: rgba(0,232,150,0.04); border: 1px solid rgba(0,232,150,0.08);
          border-radius: 12px; padding: 24px; min-height: 200px;
          display: flex; align-items: center; justify-content: center;
        }

        /* Fake dashboard preview */
        .mini-dash { width: 100%; }
        .mini-dash-bar { display: flex; gap: 8px; margin-bottom: 10px; align-items: flex-end; }
        .mini-bar {
          flex: 1; border-radius: 4px 4px 0 0;
          background: linear-gradient(to top, var(--teal), rgba(0,232,150,0.3));
          animation: barPulse 2.5s ease-in-out infinite;
        }
        .mini-bar:nth-child(1){height:40px;animation-delay:0s}
        .mini-bar:nth-child(2){height:65px;animation-delay:0.2s}
        .mini-bar:nth-child(3){height:50px;animation-delay:0.4s}
        .mini-bar:nth-child(4){height:80px;animation-delay:0.6s}
        .mini-bar:nth-child(5){height:55px;animation-delay:0.8s}
        .mini-bar:nth-child(6){height:90px;animation-delay:1s}
        @keyframes barPulse { 0%,100%{opacity:1} 50%{opacity:0.5} }
        .mini-labels { display: flex; gap: 8px; }
        .mini-label { flex: 1; height: 6px; background: var(--border); border-radius: 3px; }

        /* ═══════════ HOW IT WORKS ═══════════ */
        .how-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 0; position: relative; }
        .how-grid::before {
          content: ''; position: absolute; top: 32px; left: 10%; right: 10%; height: 1px;
          background: linear-gradient(90deg, transparent, var(--teal), transparent);
          opacity: 0.2;
        }
        .how-step { text-align: center; padding: 0 24px; }
        .how-num {
          width: 64px; height: 64px; border-radius: 50%;
          border: 1px solid rgba(0,232,150,0.2);
          background: var(--teal-dim); display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: var(--teal);
          margin: 0 auto 20px; position: relative; z-index: 1;
          transition: all 0.3s;
        }
        .how-step:hover .how-num { background: var(--teal); color: var(--bg); box-shadow: 0 0 32px var(--teal-glow); }
        .how-step-title { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; margin-bottom: 10px; }
        .how-step-desc { font-size: 13px; color: var(--muted); line-height: 1.65; font-weight: 300; }

        /* ═══════════ TESTIMONIALS ═══════════ */
        .test-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px; }
        .test-card {
          background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 28px;
          transition: all 0.3s;
        }
        .test-card:hover { border-color: rgba(0,232,150,0.15); transform: translateY(-3px); }
        .test-stars { color: var(--teal); font-size: 13px; margin-bottom: 14px; }
        .test-quote { font-size: 14px; color: rgba(255,255,255,0.7); line-height: 1.7; margin-bottom: 20px; font-style: italic; font-weight: 300; }
        .test-author { display: flex; align-items: center; gap: 10px; }
        .test-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: linear-gradient(135deg, #00e896, #0055ff);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 700; color: var(--bg); flex-shrink: 0;
        }
        .test-name { font-size: 13px; font-weight: 600; }
        .test-role { font-size: 11px; color: var(--muted); }

        /* ═══════════ JOB CATEGORIES ═══════════ */
        .cats-grid { display: flex; flex-wrap: wrap; gap: 10px; justify-content: center; }
        .cat-pill {
          display: flex; align-items: center; gap: 8px;
          background: var(--card); border: 1px solid var(--border);
          border-radius: 100px; padding: 10px 20px; font-size: 13px;
          color: rgba(255,255,255,0.6); cursor: pointer; transition: all 0.25s;
        }
        .cat-pill:hover { border-color: rgba(0,232,150,0.3); color: var(--teal); background: var(--teal-dim); transform: scale(1.04); }
        .cat-count { font-size: 11px; color: var(--teal); font-weight: 600; }

        /* ═══════════ CTA ═══════════ */
        .cta-section {
          margin: 0 24px 80px; border-radius: 24px;
          background: linear-gradient(135deg, rgba(0,232,150,0.08) 0%, rgba(0,80,255,0.06) 100%);
          border: 1px solid rgba(0,232,150,0.12);
          padding: 80px 40px; text-align: center; position: relative; overflow: hidden;
        }
        .cta-section::before {
          content: ''; position: absolute; top: -80px; right: -80px;
          width: 320px; height: 320px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,232,150,0.12), transparent 70%);
        }
        .cta-section::after {
          content: ''; position: absolute; bottom: -60px; left: -60px;
          width: 240px; height: 240px; border-radius: 50%;
          background: radial-gradient(circle, rgba(0,80,255,0.1), transparent 70%);
        }
        .cta-title { font-family: 'Syne', sans-serif; font-size: clamp(28px, 4vw, 48px); font-weight: 800; letter-spacing: -1px; margin-bottom: 16px; position: relative; z-index: 1; }
        .cta-sub { font-size: 16px; color: var(--muted); margin-bottom: 36px; font-weight: 300; position: relative; z-index: 1; }
        .cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }

        /* ═══════════ FOOTER ═══════════ */
        .footer {
          border-top: 1px solid var(--border); padding: 40px 24px;
          position: relative; z-index: 1;
        }
        .footer-inner { max-width: 1140px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: gap; gap: 16px; }
        .footer-logo { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: var(--teal); }
        .footer-links { display: flex; gap: 28px; }
        .footer-link { font-size: 13px; color: var(--muted); text-decoration: none; transition: color 0.2s; }
        .footer-link:hover { color: var(--white); }
        .footer-copy { font-size: 12px; color: rgba(255,255,255,0.2); }

        /* ─── SCROLL INDICATOR ─── */
        .scroll-indicator {
          position: absolute; bottom: 80px; left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          color: var(--muted); font-size: 11px; letter-spacing: 1px; text-transform: uppercase;
          animation: scrollBob 2s ease-in-out infinite;
        }
        @keyframes scrollBob { 0%,100%{transform:translateX(-50%) translateY(0)} 50%{transform:translateX(-50%) translateY(6px)} }
        .scroll-line { width: 1px; height: 36px; background: linear-gradient(to bottom, var(--teal), transparent); }

        @media (max-width: 640px) {
          .section { padding: 64px 20px; }
          .feat-card.large { grid-column: span 1; }
          .how-grid::before { display: none; }
          .footer-inner { flex-direction: column; text-align: center; }
        }
      `}</style>

      <div className="page">
        <div className="bg-grid" />
        <ParticleField />
        <Navbar />

        {/* ═══════════════ HERO ═══════════════ */}
        <section className="hero" ref={heroRef}>
          <div className={`hero-eyebrow fade-up ${heroVisible ? "visible" : ""}`}>
            <span className="chip"><span className="chip-dot" /> Now Hiring • 12,000+ Live Roles</span>
          </div>

          <h1 className={`hero-title fade-up delay-1 ${heroVisible ? "visible" : ""}`}>
            Your next great<br />hire is one<br /><span className="accent">search away.</span>
          </h1>

          <p className={`hero-sub fade-up delay-2 ${heroVisible ? "visible" : ""}`}>
            RozgaarX connects world-class talent with the companies building tomorrow. AI-powered matching. Zero friction.
          </p>

          <div className={`hero-ctas fade-up delay-3 ${heroVisible ? "visible" : ""}`}>
            <button className="btn-primary">Find Jobs →</button>
            <button className="btn-ghost">Post a Role</button>
          </div>

          <div className={`hero-proof fade-up delay-4 ${heroVisible ? "visible" : ""}`}>
            <div className="hero-avatars">
              {["AK","BR","CL","DM"].map((i, idx) => (
                <div className="hero-avatar" key={idx} style={{ background: `hsl(${idx * 60 + 160},70%,45%)` }}>{i}</div>
              ))}
            </div>
            <div>
              <div className="hero-avatars-stars">★★★★★</div>
              <div>Trusted by <strong style={{color:"#fff"}}>50,000+</strong> professionals</div>
            </div>
          </div>

          {/* scroll indicator */}
          <div className="scroll-indicator">
            <span>Scroll</span>
            <div className="scroll-line" />
          </div>

          {/* marquee */}
          <div className="hero-marquee-wrap">
            <div className="hero-marquee">
              {[...Array(2)].map((_, i) =>
                ["Engineering","Product","Design","Marketing","Finance","Operations","Data Science","Legal","Sales","HR"].map((t, j) => (
                  <div className="hero-marquee-item" key={`${i}-${j}`}>
                    {t} <span className="hero-marquee-sep">✦</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════ STATS ═══════════════ */}
        <section className="section">
          <div className="container">
            <div className={`fade-up ${statsVisible ? "visible" : ""}`} ref={statsRef}>
              <div className="stats-grid">
                {[
                  { num: 50000, suffix: "+", label: "Professionals\nplaced this year" },
                  { num: 12000, suffix: "+", label: "Active job\nlistings today" },
                  { num: 3400,  suffix: "+", label: "Companies\nhiring now" },
                  { num: 98,    suffix: "%",  label: "Employer\nsatisfaction rate" },
                ].map((s, i) => (
                  <div className="stat-card" key={i}>
                    <div className="stat-num"><Counter end={s.num} suffix={s.suffix} /></div>
                    <div className="stat-label" style={{whiteSpace:"pre-line"}}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ FEATURES ═══════════════ */}
        <section className="section" ref={featRef}>
          <div className="container">
            <div className={`section-header fade-up ${featVisible ? "visible" : ""}`}>
              <div className="chip"><span className="chip-dot" /> Platform Features</div>
              <h2 className="section-title">Built for speed.<br />Designed for results.</h2>
              <p className="section-sub">Every tool you need to hire smarter, move faster, and build the team you deserve.</p>
            </div>

            <div className="features-grid">
              {[
                { icon: "🤖", title: "AI-Powered Matching", desc: "Our model learns your preferences and surfaces candidates you'd never find manually — ranked by fit, not just keywords.", delay: "delay-1" },
                { icon: "⚡", title: "Instant Applications", desc: "One-click apply for candidates. Instant notifications for recruiters. No delays, no black holes.", delay: "delay-2" },
                { icon: "🔍", title: "Smart Filters", desc: "Filter by role, stack, experience, location, compensation and culture signals — all in real-time.", delay: "delay-3" },
                { icon: "📊", title: "Hiring Analytics", desc: "Track pipeline velocity, source ROI, time-to-hire, and offer acceptance rates from a single dashboard.", delay: "delay-4" },
                { icon: "🔔", title: "Real-time Alerts", desc: "Get notified the moment a perfect match applies or a recruiter views your profile. Never miss a moment.", delay: "delay-5" },
              ].map((f, i) => (
                <div className={`feat-card fade-up ${f.delay} ${featVisible ? "visible" : ""}`} key={i}>
                  <div className="feat-icon">{f.icon}</div>
                  <div className="feat-title">{f.title}</div>
                  <div className="feat-desc">{f.desc}</div>
                </div>
              ))}

              {/* Large card */}
              <div className={`feat-card large fade-up delay-6 ${featVisible ? "visible" : ""}`}>
                <div>
                  <div className="feat-icon">📈</div>
                  <div className="feat-title">Live Recruitment Dashboard</div>
                  <div className="feat-desc" style={{marginBottom:20}}>
                    Track every candidate across every stage of your funnel. Visualize pipeline health, spot bottlenecks, and make data-driven decisions — all in one command centre.
                  </div>
                  <button className="btn-primary" style={{fontSize:13}}>See Dashboard →</button>
                </div>
                <div className="feat-visual">
                  <div className="mini-dash">
                    <div className="mini-dash-bar">
                      <div className="mini-bar" />
                      <div className="mini-bar" />
                      <div className="mini-bar" />
                      <div className="mini-bar" />
                      <div className="mini-bar" />
                      <div className="mini-bar" />
                    </div>
                    <div className="mini-labels">
                      {[...Array(6)].map((_,i)=><div className="mini-label" key={i}/>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ HOW IT WORKS ═══════════════ */}
        <section className="section" style={{background:"linear-gradient(to bottom, transparent, rgba(0,232,150,0.02), transparent)"}} ref={howRef}>
          <div className="container">
            <div className={`section-header fade-up ${howVisible ? "visible" : ""}`}>
              <div className="chip"><span className="chip-dot" /> How It Works</div>
              <h2 className="section-title">Up and running<br />in minutes.</h2>
            </div>
            <div className="how-grid">
              {[
                { n: "01", title: "Create your profile", desc: "Build a rich profile in under 5 minutes. Import from LinkedIn or fill in as you go." },
                { n: "02", title: "Get matched by AI", desc: "Our engine analyses 200+ signals to surface the right roles or candidates for you." },
                { n: "03", title: "Connect instantly", desc: "Message, schedule, and interview — all inside RozgaarX with zero back-and-forth." },
                { n: "04", title: "Land the offer", desc: "Negotiate, sign, and onboard — we're with you every step of the way." },
              ].map((s, i) => (
                <div className={`how-step fade-up delay-${i+1} ${howVisible ? "visible" : ""}`} key={i}>
                  <div className="how-num">{s.n}</div>
                  <div className="how-step-title">{s.title}</div>
                  <div className="how-step-desc">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ JOB CATEGORIES ═══════════════ */}
        <section className="section">
          <div className="container">
            <div className="section-header fade-up">
              <div className="chip"><span className="chip-dot" /> Browse by Category</div>
              <h2 className="section-title">Every role,<br />every industry.</h2>
            </div>
            <div className="cats-grid">
              {[
                ["💻","Engineering","4,200+"],["🎨","Design","1,800+"],["📦","Product","2,100+"],
                ["📊","Data & Analytics","1,500+"],["💰","Finance","980+"],["📣","Marketing","2,300+"],
                ["⚖️","Legal","420+"],["🏥","Healthcare","1,100+"],["🔧","Operations","870+"],["🤝","Sales","3,100+"],
              ].map(([emoji, name, count], i) => (
                <div className="cat-pill" key={i}>
                  <span>{emoji}</span>
                  <span>{name}</span>
                  <span className="cat-count">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ TESTIMONIALS ═══════════════ */}
        <section className="section" ref={testRef}>
          <div className="container">
            <div className={`section-header fade-up ${testVisible ? "visible" : ""}`}>
              <div className="chip"><span className="chip-dot" /> Testimonials</div>
              <h2 className="section-title">People love<br />RozgaarX.</h2>
            </div>
            <div className="test-grid">
              {[
                { avatar:"SK", name:"Sneha K.", role:"Senior Engineer, Bangalore", quote:"I applied to 3 roles on a Monday and had 2 interviews by Wednesday. The AI matching is genuinely scary good.", bg:"135deg, #00e896, #007bff" },
                { avatar:"RT", name:"Rohan T.", role:"Head of Talent, Zepto", quote:"We cut our time-to-hire by 40% in the first month. The candidate quality is miles ahead of anything we used before.", bg:"135deg, #ff6b6b, #ffd93d" },
                { avatar:"PM", name:"Priya M.", role:"Product Manager, Razorpay", quote:"The profile builder is slick and the job recommendations actually make sense. First time a job board felt personal.", bg:"135deg, #a78bfa, #00e896" },
                { avatar:"AJ", name:"Arjun J.", role:"Founding Engineer, Stealth", quote:"Landed my dream role through RozgaarX. The whole process — from match to offer — took 11 days.", bg:"135deg, #f97316, #ef4444" },
                { avatar:"DV", name:"Divya V.", role:"TA Lead, Meesho", quote:"Our recruiters use it daily. The dashboard is clean, the filters are powerful, and support is actually responsive.", bg:"135deg, #06b6d4, #0284c7" },
                { avatar:"NS", name:"Nikhil S.", role:"CTO, Series B Startup", quote:"We've hired 14 people through RozgaarX this year. The platform just keeps getting better every quarter.", bg:"135deg, #84cc16, #059669" },
              ].map((t, i) => (
                <div className={`test-card fade-up delay-${(i%3)+1} ${testVisible ? "visible" : ""}`} key={i}>
                  <div className="test-stars">★★★★★</div>
                  <div className="test-quote">"{t.quote}"</div>
                  <div className="test-author">
                    <div className="test-avatar" style={{background:`linear-gradient(${t.bg})`}}>{t.avatar}</div>
                    <div>
                      <div className="test-name">{t.name}</div>
                      <div className="test-role">{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ CTA ═══════════════ */}
        <div ref={ctaRef}>
          <div className={`cta-section fade-up ${ctaVisible ? "visible" : ""}`}>
            <h2 className="cta-title">Ready to find your<br /><span style={{color:"var(--teal)"}}>next opportunity?</span></h2>
            <p className="cta-sub">Join 50,000+ professionals already using RozgaarX to build their careers.</p>
            <div className="cta-btns">
              <button className="btn-primary" style={{fontSize:15, padding:"16px 40px"}}>Get Started Free →</button>
              <button className="btn-ghost" style={{padding:"16px 28px"}}>Talk to Sales</button>
            </div>
          </div>
        </div>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo">RozgaarX</div>
            <div className="footer-links">
              {["About","Careers","Blog","Privacy","Terms"].map(l => (
                <a href="#" className="footer-link" key={l}>{l}</a>
              ))}
            </div>
            <div className="footer-copy">© 2026 RozgaarX Inc.</div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Home;