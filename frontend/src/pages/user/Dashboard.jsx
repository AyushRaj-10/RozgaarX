import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext.jsx";
import { ApplicationContext } from "../../context/ApplicationContext.jsx";
import { JobContext } from "../../context/JobContext.jsx";
import { userContext } from "../../context/UserContext.jsx";
import {
  Briefcase, Search, BookMarked, User, Bell, LogOut,
  Plus, Users, BarChart2, FileText, Settings, ChevronRight,
  TrendingUp, Eye, Zap, MapPin, Star, MessageSquare, Send, Award, CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

/* ─── Helpers ─────────────────────────────────────────────────────── */
export const STATUS_STYLES = {
  applied:     { bg: "rgba(79,158,255,0.12)",  color: "#4f9eff",  label: "Applied"     },
  review:      { bg: "rgba(245,166,35,0.12)",  color: "#f5a623",  label: "In Review"   },
  shortlisted: { bg: "rgba(0,232,150,0.12)",   color: "#00e896",  label: "Shortlisted" },
  shortlist:   { bg: "rgba(0,232,150,0.12)",   color: "#00e896",  label: "Shortlisted" },
  rejected:    { bg: "rgba(255,80,80,0.12)",   color: "#ff7070",  label: "Rejected"    },
  active:      { bg: "rgba(0,232,150,0.12)",   color: "#00e896",  label: "Active"      },
  paused:      { bg: "rgba(245,166,35,0.12)",  color: "#f5a623",  label: "Paused"      },
  pending:     { bg: "rgba(79,158,255,0.12)",  color: "#4f9eff",  label: "Pending"     },
  hired:       { bg: "rgba(0,232,150,0.12)",   color: "#00e896",  label: "Hired"       },
};

export const LOGO_COLORS = ["#635BFF","#2EECC9","#E94235","#F5A623","#5F259F","#FC8019","#BE3FA5","#4f9eff","#00e896","#b66dff"];

export const Avatar = ({ letter = "?", color = "#4f9eff", size = 38 }) => (
  <div style={{
    width: size, height: size, borderRadius: 10,
    background: `${color}22`, border: `1px solid ${color}44`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.42, fontWeight: 700, color,
    flexShrink: 0, fontFamily: "'Syne', sans-serif",
  }}>
    {letter}
  </div>
);

export const SHARED_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  .db-root {
    min-height: 100vh; background: #020d1a;
    display: flex; font-family: 'DM Sans', sans-serif; color: #fff; position: relative;
  }
  .db-root::before {
    content: ''; position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(0,232,150,0.018) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,232,150,0.018) 1px, transparent 1px);
    background-size: 44px 44px; pointer-events: none; z-index: 0;
  }
  .db-sidebar {
    width: 240px; flex-shrink: 0;
    background: rgba(255,255,255,0.02);
    border-right: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column;
    position: sticky; top: 0; height: 100vh;
    z-index: 10; padding: 24px 0;
    animation: fadeSlideLeft 0.5s ease both;
  }
  .db-sidebar-logo { padding: 0 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 16px; }
  .db-sidebar-logo-row { display: flex; align-items: center; gap: 9px; cursor: pointer; }
  .db-sidebar-logo-icon { width: 32px; height: 32px; background: #00e896; border-radius: 8px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .db-sidebar-logo-name { font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 800; color: #00e896; letter-spacing: -0.5px; }
  .db-sidebar-role-badge { margin-top: 8px; display: inline-block; padding: 3px 9px; border-radius: 20px; font-size: 10px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase; background: rgba(0,232,150,0.1); color: #00e896; border: 1px solid rgba(0,232,150,0.2); }
  .db-nav { flex: 1; padding: 0 12px; display: flex; flex-direction: column; gap: 2px; }
  .db-nav-item { display: flex; align-items: center; gap: 11px; padding: 10px 12px; border-radius: 10px; cursor: pointer; font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.38); transition: all 0.18s; border: 1px solid transparent; user-select: none; }
  .db-nav-item:hover { background: rgba(255,255,255,0.04); color: rgba(255,255,255,0.7); }
  .db-nav-item.active { background: rgba(0,232,150,0.08); border-color: rgba(0,232,150,0.15); color: #00e896; font-weight: 600; }
  .db-nav-item svg { opacity: 0.5; transition: opacity 0.18s; flex-shrink: 0; }
  .db-nav-item.active svg, .db-nav-item:hover svg { opacity: 1; }
  .db-sidebar-user { margin: 12px; padding: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; }
  .db-sidebar-user-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .db-sidebar-user-avatar { width: 34px; height: 34px; border-radius: 9px; background: linear-gradient(135deg, #00e896, #4f9eff); display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #020d1a; flex-shrink: 0; }
  .db-sidebar-user-name { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .db-sidebar-user-email { font-size: 10.5px; color: rgba(255,255,255,0.3); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .db-logout-btn { width: 100%; padding: 8px; border-radius: 8px; background: rgba(255,80,80,0.07); border: 1px solid rgba(255,80,80,0.13); color: #ff7070; font-family: 'DM Sans', sans-serif; font-size: 12px; font-weight: 500; cursor: pointer; transition: all 0.18s; display: flex; align-items: center; justify-content: center; gap: 6px; }
  .db-logout-btn:hover { background: rgba(255,80,80,0.14); border-color: rgba(255,80,80,0.25); }
  .db-main { flex: 1; overflow-y: auto; position: relative; z-index: 1; padding: 32px; animation: fadeSlideUp 0.5s ease 0.1s both; }
  .db-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 32px; }
  .db-topbar-greeting { font-family: 'Syne', sans-serif; }
  .db-topbar-hi { font-size: 22px; font-weight: 700; color: #fff; }
  .db-topbar-sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-top: 2px; }
  .db-topbar-actions { display: flex; align-items: center; gap: 10px; }
  .db-topbar-icon-btn { width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: rgba(255,255,255,0.45); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.18s; position: relative; }
  .db-topbar-icon-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .db-notif-dot { position: absolute; top: 7px; right: 7px; width: 7px; height: 7px; border-radius: 50%; background: #00e896; border: 1.5px solid #020d1a; }
  .db-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 28px; }
  .db-stat-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 18px 20px; transition: border-color 0.2s, transform 0.2s; }
  .db-stat-card:hover { border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
  .db-stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .db-stat-icon { width: 36px; height: 36px; border-radius: 9px; display: flex; align-items: center; justify-content: center; }
  .db-stat-label { font-size: 12px; color: rgba(255,255,255,0.38); margin-bottom: 4px; }
  .db-stat-value { font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700; color: #fff; letter-spacing: -1px; line-height: 1; }
  .db-stat-delta { font-size: 11px; color: rgba(255,255,255,0.25); margin-top: 4px; }
  .db-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
  .db-section-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #fff; }
  .db-section-link { font-size: 12px; color: #00e896; cursor: pointer; font-weight: 500; display: flex; align-items: center; gap: 2px; transition: opacity 0.2s; }
  .db-section-link:hover { opacity: 0.75; }
  .db-content-grid { display: grid; grid-template-columns: 1fr 340px; gap: 20px; }
  .db-table-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; }
  .db-table-head { display: grid; padding: 12px 18px; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 10.5px; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; color: rgba(255,255,255,0.22); }
  .db-table-row { display: grid; padding: 14px 18px; border-bottom: 1px solid rgba(255,255,255,0.04); align-items: center; transition: background 0.16s; cursor: pointer; }
  .db-table-row:last-child { border-bottom: none; }
  .db-table-row:hover { background: rgba(255,255,255,0.025); }
  .db-role-name { font-size: 13.5px; font-weight: 600; color: #fff; }
  .db-company-name { font-size: 12px; color: rgba(255,255,255,0.38); margin-top: 1px; }
  .db-location-badge { display: flex; align-items: center; gap: 4px; font-size: 11.5px; color: rgba(255,255,255,0.35); }
  .db-salary { font-size: 12.5px; color: rgba(255,255,255,0.5); font-weight: 500; }
  .db-status-pill { display: inline-flex; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; width: fit-content; }
  .db-applicant-count { font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff; }
  .db-new-badge { font-size: 10px; font-weight: 600; color: #00e896; background: rgba(0,232,150,0.1); border-radius: 20px; padding: 2px 7px; margin-left: 6px; }
  .db-posted-time { font-size: 11px; color: rgba(255,255,255,0.25); }
  .db-side-panel { display: flex; flex-direction: column; gap: 16px; }
  .db-match-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 18px; }
  .db-match-item { display: flex; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .db-match-item:last-child { border-bottom: none; padding-bottom: 0; }
  .db-match-info { flex: 1; min-width: 0; }
  .db-match-role { font-size: 13px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .db-match-company { font-size: 11px; color: rgba(255,255,255,0.35); }
  .db-match-pct { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 800; color: #00e896; flex-shrink: 0; }
  .db-quick-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 18px; }
  .db-quick-btn { width: 100%; display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 10px; margin-bottom: 6px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: rgba(255,255,255,0.6); cursor: pointer; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; transition: all 0.18s; text-align: left; }
  .db-quick-btn:last-child { margin-bottom: 0; }
  .db-quick-btn:hover { background: rgba(0,232,150,0.07); border-color: rgba(0,232,150,0.2); color: #00e896; }
  .db-quick-btn svg { flex-shrink: 0; }
  .db-quick-btn-arrow { margin-left: auto; opacity: 0.4; }
  .db-profile-card { background: rgba(0,232,150,0.05); border: 1px solid rgba(0,232,150,0.15); border-radius: 16px; padding: 18px; }
  .db-profile-pct-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .db-profile-pct-label { font-size: 12px; color: rgba(255,255,255,0.45); }
  .db-profile-pct-value { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; color: #00e896; }
  .db-profile-bar-bg { height: 5px; background: rgba(255,255,255,0.07); border-radius: 99px; overflow: hidden; }
  .db-profile-bar-fill { height: 100%; background: #00e896; border-radius: 99px; box-shadow: 0 0 8px rgba(0,232,150,0.5); }
  .db-profile-tip { font-size: 11.5px; color: rgba(255,255,255,0.3); margin-top: 10px; }
  .db-profile-tip span { color: #00e896; font-weight: 500; }
  .db-post-btn { width: 100%; padding: 13px; border-radius: 10px; background: #00e896; color: #020d1a; border: none; font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 20px rgba(0,232,150,0.25); }
  .db-post-btn:hover { background: #00ffa3; box-shadow: 0 6px 28px rgba(0,232,150,0.4); transform: translateY(-1px); }
  .db-funnel-card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 18px; }
  .db-funnel-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .db-funnel-row:last-child { margin-bottom: 0; }
  .db-funnel-label { font-size: 12px; color: rgba(255,255,255,0.38); width: 90px; flex-shrink: 0; }
  .db-funnel-bar-bg { flex: 1; height: 6px; background: rgba(255,255,255,0.06); border-radius: 99px; overflow: hidden; }
  .db-funnel-bar-fill { height: 100%; border-radius: 99px; }
  .db-funnel-count { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #fff; width: 30px; text-align: right; flex-shrink: 0; }
  .db-empty { text-align: center; padding: 40px 20px; color: rgba(255,255,255,0.25); font-size: 13px; }
  .db-skeleton { background: rgba(255,255,255,0.05); border-radius: 8px; animation: shimmer 1.5s infinite; }
  @keyframes shimmer { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
  @keyframes fadeSlideUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
  @keyframes fadeSlideLeft { from { opacity: 0; transform: translateX(-12px); } to { opacity: 1; transform: translateX(0); } }
  @media (max-width: 1100px) { .db-stats-grid { grid-template-columns: repeat(2, 1fr); } .db-content-grid { grid-template-columns: 1fr; } }
  @media (max-width: 700px) { .db-sidebar { display: none; } .db-main { padding: 20px 16px; } .db-stats-grid { grid-template-columns: 1fr 1fr; } }
`;

/* ── Helper: extract array from any API response shape ── */
export const extractList = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  // handles { data: [...] }, { jobs: [...] }, { content: [...] }
  return data.data || data.jobs || data.content || [];
};

/* ═══════════════════════════════════════════════════════════════════
   SHARED SIDEBAR LAYOUT
═══════════════════════════════════════════════════════════════════ */
export const SidebarLayout = ({ activeNav, onNav, children }) => {
  const { user, isRecruiter, logout } = useContext(AuthContext);
  const { getUserProfile } = useContext(userContext);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem("authId");
    if (id) getUserProfile(id).then((d) => d && setProfileData(d)).catch(() => {});
  }, []);

  const displayName = profileData?.name || user?.name || user?.email?.split("@")[0] || "User";

  const candidateNav = [
    { path: "/dashboard",    label: "Overview",     icon: BarChart2  },
    { path: "/jobs",         label: "Browse Jobs",  icon: Search     },
    { path: "/applications", label: "Applications", icon: Send       },
    { path: "/saved",        label: "Saved Jobs",   icon: BookMarked },
    { path: "/profile",      label: "My Profile",   icon: User       },
  ];
  const recruiterNav = [
    { path: "/dashboard",  label: "Job Listings",    icon: Briefcase  },
    { path: "/applicants", label: "Applicants",      icon: Users      },
    { path: "/analytics",  label: "Analytics",       icon: TrendingUp },
    { path: "/post-job",   label: "Post a Job",      icon: Plus       },
    { path: "/profile",    label: "Company Profile", icon: Settings   },
  ];
  const navItems = isRecruiter ? recruiterNav : candidateNav;

<nav className="db-nav">
  {navItems.map(({ path, label, icon: Icon }) => (
    <div
      key={path}
      className={`db-nav-item ${activeNav === path ? "active" : ""}`}
      onClick={() => {
        onNav(path);
        navigate(path);
      }}
    >
      <Icon size={16} />
      {label}
    </div>
  ))}
</nav>

  return (
    <div className="db-root">
      <aside className="db-sidebar">
        <div className="db-sidebar-logo">
          <div className="db-sidebar-logo-row" onClick={() => navigate("/")}>
            <div className="db-sidebar-logo-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <rect x="4" y="2" width="16" height="20" rx="2" fill="#020d1a" />
                <path d="M8 7h8M8 12h8M8 17h5" stroke="#020d1a" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="db-sidebar-logo-name">RozgaarX</span>
          </div>
          <div className="db-sidebar-role-badge">{isRecruiter ? "Recruiter" : "Candidate"}</div>
        </div>

        {/* ✅ FIXED: nav now actually renders inside JSX */}
        <nav className="db-nav">
          {navItems.map(({ path, label, icon: Icon }) => (
            <div
              key={path}
              className={`db-nav-item ${activeNav === path ? "active" : ""}`}
              onClick={() => { onNav(path); navigate(path); }}
            >
              <Icon size={16} />{label}
            </div>
          ))}
        </nav>

        <div className="db-sidebar-user">
          <div className="db-sidebar-user-row">
            <div className="db-sidebar-user-avatar">{displayName[0]?.toUpperCase()}</div>
            <div style={{ minWidth: 0 }}>
              <div className="db-sidebar-user-name">{displayName}</div>
              <div className="db-sidebar-user-email">{user?.email || ""}</div>
            </div>
          </div>
          <button className="db-logout-btn" onClick={logout}><LogOut size={13} /> Sign Out</button>
        </div>
      </aside>
      <main className="db-main">{children}</main>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD
═══════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user, isRecruiter, token } = useContext(AuthContext);
  const { getUserProfile } = useContext(userContext);
  const { getApplicationsByUserId } = useContext(ApplicationContext);
  const { getJobs } = useContext(JobContext);
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState("/dashboard");
  const [profileData, setProfileData] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { navigate("/login"); return; }
    const id = localStorage.getItem("authId");
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [profile, jobsData] = await Promise.all([
          id ? getUserProfile(id) : Promise.resolve(null),
          getJobs(1),
        ]);
        if (profile) setProfileData(profile);

        // ✅ FIXED: handle { data: [...] } shape from your API
        const jobList = extractList(jobsData);
        setJobs(jobList);

        if (id && !isRecruiter) {
          const apps = await getApplicationsByUserId(id);
          setApplications(extractList(apps));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [token]);

  if (!token) return null;

  const displayName = profileData?.name || user?.name || user?.email?.split("@")[0] || "User";

  /* ── Candidate stats ── */
  const candidateStats = [
    {
      label: "Applications", value: String(applications.length),
      delta: `${applications.filter(a => {
        const d = new Date(a.created_at || a.createdAt || a.appliedAt || Date.now());
        return (Date.now() - d) < 7 * 86400000;
      }).length} this week`,
      icon: Send, color: "#00e896",
    },
    { label: "Profile Views", value: profileData?.profileViews ?? "—", delta: "Based on your profile", icon: Eye, color: "#4f9eff" },
    { label: "Available Jobs", value: String(jobs.length), delta: "Live listings", icon: BookMarked, color: "#f5a623" },
    {
      label: "Interviews",
      value: String(applications.filter(a => (a.status || "").toLowerCase().includes("interview")).length),
      delta: "Scheduled", icon: CheckCircle, color: "#b66dff",
    },
  ];

  const recruiterStats = [
    { label: "Active Listings", value: String(jobs.length), delta: "Your job posts", icon: Briefcase, color: "#00e896" },
    { label: "Total Applicants", value: String(applications.length), delta: "All applications", icon: Users, color: "#4f9eff" },
    {
      label: "Shortlisted",
      value: String(applications.filter(a => (a.status || "").toLowerCase().includes("short")).length),
      delta: "Awaiting review", icon: Star, color: "#f5a623",
    },
    {
      label: "Hired This Month",
      value: String(applications.filter(a => (a.status || "").toLowerCase() === "hired").length),
      delta: "Successful hires", icon: Award, color: "#b66dff",
    },
  ];
  const stats = isRecruiter ? recruiterStats : candidateStats;

  /* ── Profile completion — mapped to YOUR API's snake_case fields ── */
  const profileFields = [
    "bio", "phone", "location", "role",
    "skills", "resume_url", "linkedin", "portfolio",
  ];
  const filledFields = profileFields.filter(f => {
    const val = profileData?.[f];
    if (Array.isArray(val)) return val.length > 0;
    return val && String(val).trim() !== "" && val !== "null";
  });
  const profilePct = profileData
    ? Math.round((filledFields.length / profileFields.length) * 100)
    : 0;

  return (
    <>
      <style>{SHARED_STYLES}</style>
      <SidebarLayout activeNav={activeNav} onNav={setActiveNav}>
        <div className="db-topbar">
          <div className="db-topbar-greeting">
            <div className="db-topbar-hi">Good morning, {displayName.split(" ")[0]} 👋</div>
            <div className="db-topbar-sub">
              {isRecruiter
                ? "Here's what's happening with your listings today."
                : `${applications.length} applications tracked. Keep going!`}
            </div>
          </div>
          <div className="db-topbar-actions">
            <div className="db-topbar-icon-btn"><Bell size={17} /><div className="db-notif-dot" /></div>
            <div className="db-topbar-icon-btn" onClick={() => navigate("/profile")}><User size={17} /></div>
          </div>
        </div>

        <div className="db-stats-grid">
          {stats.map(({ label, value, delta, icon: Icon, color }) => (
            <div className="db-stat-card" key={label}>
              <div className="db-stat-top">
                <div className="db-stat-icon" style={{ background: `${color}18`, color }}><Icon size={17} /></div>
              </div>
              <div className="db-stat-label">{label}</div>
              <div className="db-stat-value">{loading ? "—" : value}</div>
              <div className="db-stat-delta">{delta}</div>
            </div>
          ))}
        </div>

        {isRecruiter
          ? <RecruiterPanel jobs={jobs} applications={applications} loading={loading} onNav={(path) => navigate(path)} />
          : <CandidatePanel applications={applications} jobs={jobs} profilePct={profilePct} profileData={profileData} loading={loading} onNav={(path) => navigate(path)} />}
      </SidebarLayout>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   CANDIDATE PANEL
═══════════════════════════════════════════════════════════════════ */
const CandidatePanel = ({ applications, jobs, profilePct, profileData, loading, onNav }) => {
  const recentApps = applications.slice(0, 5);
  const recommendedJobs = jobs.slice(0, 3);

  return (
    <div className="db-content-grid">
      <div>
        <div className="db-section-header">
          <div className="db-section-title">Recent Applications</div>
          <div className="db-section-link" onClick={() => onNav("/applications")}>View all <ChevronRight size={13} /></div>
        </div>
        <div className="db-table-card">
          <div className="db-table-head" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
            <span>Role</span><span>Location</span><span>Salary</span><span>Status</span>
          </div>
          {loading && <div className="db-empty">Loading applications...</div>}
          {!loading && recentApps.length === 0 && (
            <div className="db-empty">No applications yet. Start applying!</div>
          )}
          {!loading && recentApps.map((app, i) => {
            const statusKey = (app.status || "applied").toLowerCase().replace(/\s+/g, "");
            const s = STATUS_STYLES[statusKey] || STATUS_STYLES.applied;
            const color = LOGO_COLORS[i % LOGO_COLORS.length];
            const companyName = app.companyName || app.company_name || app.job?.companyName || "Company";
            const roleName = app.jobTitle || app.job_title || app.job?.title || "Position";
            return (
              <div className="db-table-row" key={app.id || i} style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Avatar letter={companyName[0]?.toUpperCase()} color={color} />
                  <div>
                    <div className="db-role-name">{roleName}</div>
                    <div className="db-company-name">{companyName}</div>
                  </div>
                </div>
                <div className="db-location-badge"><MapPin size={11} />{app.location || app.job?.location || "Remote"}</div>
                <div className="db-salary">{app.salary || app.job?.salary || "—"}</div>
                <div className="db-status-pill" style={{ background: s.bg, color: s.color }}>{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="db-side-panel">
        <div className="db-profile-card">
          <div className="db-section-title" style={{ marginBottom: 12 }}>Profile Strength</div>
          <div className="db-profile-pct-row">
            <div className="db-profile-pct-label">Completion</div>
            <div className="db-profile-pct-value">{profilePct}%</div>
          </div>
          <div className="db-profile-bar-bg">
            <div className="db-profile-bar-fill" style={{ width: `${profilePct}%` }} />
          </div>
          <div className="db-profile-tip">
            {profilePct < 100
              ? <>Add your <span>resume</span> and <span>skills</span> to reach 100%</>
              : <span>Your profile is complete 🎉</span>}
          </div>
        </div>

        <div className="db-match-card">
          <div className="db-section-header">
            <div className="db-section-title">Latest Jobs</div>
            <div className="db-section-link" onClick={() => onNav("/jobs")}>Browse <ChevronRight size={13} /></div>
          </div>
          {loading && <div className="db-empty" style={{ padding: 16 }}>Loading...</div>}
          {!loading && recommendedJobs.length === 0 && <div className="db-empty" style={{ padding: 16 }}>No jobs yet</div>}
          {!loading && recommendedJobs.map((job, i) => {
            const color = LOGO_COLORS[i % LOGO_COLORS.length];
            // ✅ handles both camelCase and snake_case from API
            const company = job.companyName || job.company_name || job.company || "Company";
            return (
              <div className="db-match-item" key={job.id || i}>
                <Avatar letter={company[0]?.toUpperCase()} color={color} size={34} />
                <div className="db-match-info">
                  <div className="db-match-role">{job.title || job.role}</div>
                  <div className="db-match-company">{company} · {job.location || "Remote"}</div>
                </div>
                <div className="db-match-pct" style={{ fontSize: 11, color: "#4f9eff" }}>{job.salary || "Apply"}</div>
              </div>
            );
          })}
        </div>

        <div className="db-quick-card">
          <div className="db-section-title" style={{ marginBottom: 12 }}>Quick Actions</div>
          {[
            { icon: Search,        label: "Browse New Jobs",   path: "/jobs"         },
            { icon: User,          label: "Update Profile",    path: "/profile"      },
            { icon: Send,          label: "View Applications", path: "/applications" },
            { icon: MessageSquare, label: "Message Recruiter", path: null            },
          ].map(({ icon: Icon, label, path }) => (
            <button className="db-quick-btn" key={label} onClick={() => path && onNav(path)}>
              <Icon size={14} />{label}
              <ChevronRight size={13} className="db-quick-btn-arrow" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   RECRUITER PANEL
═══════════════════════════════════════════════════════════════════ */
const RecruiterPanel = ({ jobs, applications, loading, onNav }) => {
  const myListings = jobs.slice(0, 5);

  const funnelData = [
    { label: "Applied",     count: applications.length,                                                                            color: "#4f9eff" },
    { label: "Reviewed",    count: applications.filter(a => ["review","reviewed"].includes((a.status||"").toLowerCase())).length,  color: "#b66dff" },
    { label: "Shortlisted", count: applications.filter(a => (a.status||"").toLowerCase().includes("short")).length,               color: "#f5a623" },
    { label: "Interviewed", count: applications.filter(a => (a.status||"").toLowerCase().includes("interview")).length,           color: "#00e896" },
    { label: "Hired",       count: applications.filter(a => (a.status||"").toLowerCase() === "hired").length,                     color: "#ff7070" },
  ];
  const maxCount = Math.max(...funnelData.map(f => f.count), 1);

  return (
    <div className="db-content-grid">
      <div>
        <div className="db-section-header">
          <div className="db-section-title">Active Job Listings</div>
          <div className="db-section-link" onClick={() => onNav("/dashboard")}>Manage all <ChevronRight size={13} /></div>
        </div>
        <div className="db-table-card">
          <div className="db-table-head" style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1fr" }}>
            <span>Role</span><span>Location</span><span>Status</span><span>Salary</span>
          </div>
          {loading && <div className="db-empty">Loading listings...</div>}
          {!loading && myListings.length === 0 && <div className="db-empty">No listings yet. Post your first job!</div>}
          {!loading && myListings.map((job, i) => {
            const statusKey = (job.status || "active").toLowerCase();
            const s = STATUS_STYLES[statusKey] || STATUS_STYLES.active;
            const company = job.companyName || job.company_name || job.company || "Your Company";
            return (
              <div className="db-table-row" key={job.id || i} style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1fr" }}>
                <div>
                  <div className="db-role-name">{job.title || job.role}</div>
                  <div className="db-company-name">{company}</div>
                </div>
                <div className="db-location-badge"><MapPin size={11} />{job.location || "Remote"}</div>
                <div className="db-status-pill" style={{ background: s.bg, color: s.color }}>{s.label}</div>
                <div className="db-salary">{job.salary || "—"}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="db-side-panel">
        <div className="db-quick-card">
          <div className="db-section-title" style={{ marginBottom: 12 }}>Post a New Job</div>
          <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", marginBottom: 14, lineHeight: 1.6 }}>
            Reach thousands of qualified candidates on RozgaarX within minutes.
          </p>
          <button className="db-post-btn" onClick={() => onNav("/post-job")}>
            <Plus size={16} /> Create Job Listing
          </button>
        </div>

        <div className="db-funnel-card">
          <div className="db-section-title" style={{ marginBottom: 14 }}>Hiring Funnel</div>
          {funnelData.map(({ label, count, color }) => (
            <div className="db-funnel-row" key={label}>
              <div className="db-funnel-label">{label}</div>
              <div className="db-funnel-bar-bg">
                <div className="db-funnel-bar-fill" style={{ width: `${(count / maxCount) * 100}%`, background: color }} />
              </div>
              <div className="db-funnel-count">{count}</div>
            </div>
          ))}
        </div>

        <div className="db-quick-card">
          <div className="db-section-title" style={{ marginBottom: 12 }}>Quick Actions</div>
          {[
            { icon: Users,     label: "Review Applicants",    path: "/applicants" },
            { icon: BarChart2, label: "View Analytics",       path: "/analytics"  },
            { icon: Settings,  label: "Edit Company Profile", path: "/profile"    },
            { icon: Plus,      label: "Post New Job",         path: "/post-job"   },
          ].map(({ icon: Icon, label, path }) => (
            <button className="db-quick-btn" key={label} onClick={() => onNav(path)}>
              <Icon size={14} />{label}
              <ChevronRight size={13} className="db-quick-btn-arrow" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;