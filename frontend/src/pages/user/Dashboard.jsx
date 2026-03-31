import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext.jsx";
import { userContext } from "../../context/UserContext.jsx"
import {
  Briefcase, Search, BookMarked, User, Bell, LogOut,
  Plus, Users, BarChart2, FileText, Settings, ChevronRight,
  TrendingUp, Eye, Zap, MapPin, Star, MessageSquare, Send, Award, CheckCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

// ✅ FIX: Removed DashboardButtons import — it does not belong in the sidebar.
//         The sidebar already renders its own nav. Use DashboardButtons in your Navbar instead.

/* ─── Static mock data ───────────────────────────────────────────── */
const CANDIDATE_STATS = [
  { label: "Applications",  value: "12", delta: "+3 this week",    icon: Send,        color: "#00e896" },
  { label: "Profile Views", value: "84", delta: "+12 today",       icon: Eye,         color: "#4f9eff" },
  { label: "Saved Jobs",    value: "7",  delta: "2 expiring soon", icon: BookMarked,  color: "#f5a623" },
  { label: "Interviews",    value: "2",  delta: "Next: Tomorrow",  icon: CheckCircle, color: "#b66dff" },
];

const RECRUITER_STATS = [
  { label: "Active Listings",  value: "6",   delta: "+1 this week",    icon: Briefcase, color: "#00e896" },
  { label: "Total Applicants", value: "143", delta: "+28 this week",   icon: Users,     color: "#4f9eff" },
  { label: "Shortlisted",      value: "19",  delta: "5 pending review",icon: Star,      color: "#f5a623" },
  { label: "Hired This Month", value: "3",   delta: "Goal: 5",         icon: Award,     color: "#b66dff" },
];

const RECENT_APPLICATIONS = [
  { role: "Frontend Engineer", company: "Stripe",   location: "Remote",    salary: "₹28–36L", status: "review",    logo: "S", color: "#635BFF" },
  { role: "React Developer",   company: "Razorpay", location: "Bengaluru", salary: "₹22–30L", status: "shortlist", logo: "R", color: "#2EECC9" },
  { role: "UI Engineer",       company: "CRED",     location: "Bengaluru", salary: "₹20–28L", status: "rejected",  logo: "C", color: "#E94235" },
  { role: "Product Engineer",  company: "Zepto",    location: "Mumbai",    salary: "₹18–24L", status: "applied",   logo: "Z", color: "#F5A623" },
];

const RECENT_LISTINGS = [
  { role: "Senior Backend Dev", applicants: 34, new: 8,  status: "active", posted: "2d ago" },
  { role: "Product Designer",   applicants: 21, new: 3,  status: "active", posted: "5d ago" },
  { role: "Data Analyst",       applicants: 18, new: 0,  status: "paused", posted: "8d ago" },
  { role: "DevOps Engineer",    applicants: 47, new: 12, status: "active", posted: "1d ago" },
];

const RECOMMENDED_JOBS = [
  { role: "Full Stack Developer", company: "PhonePe", location: "Bengaluru", salary: "₹25–35L", match: 96, logo: "P", color: "#5F259F" },
  { role: "React Native Dev",     company: "Swiggy",  location: "Remote",    salary: "₹20–28L", match: 89, logo: "S", color: "#FC8019" },
  { role: "Frontend Architect",   company: "Meesho",  location: "Bengaluru", salary: "₹30–45L", match: 82, logo: "M", color: "#BE3FA5" },
];

/* ─── Helpers ─────────────────────────────────────────────────────── */
const STATUS_STYLES = {
  applied:   { bg: "rgba(79,158,255,0.12)",  color: "#4f9eff",  label: "Applied"     },
  review:    { bg: "rgba(245,166,35,0.12)",  color: "#f5a623",  label: "In Review"   },
  shortlist: { bg: "rgba(0,232,150,0.12)",   color: "#00e896",  label: "Shortlisted" },
  rejected:  { bg: "rgba(255,80,80,0.12)",   color: "#ff7070",  label: "Rejected"    },
  active:    { bg: "rgba(0,232,150,0.12)",   color: "#00e896",  label: "Active"      },
  paused:    { bg: "rgba(245,166,35,0.12)",  color: "#f5a623",  label: "Paused"      },
};

const Avatar = ({ letter, color, size = 38 }) => (
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

/* ═══════════════════════════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
═══════════════════════════════════════════════════════════════════ */
const Dashboard = () => {
  const { user, isRecruiter, logout, token } = useContext(AuthContext);
  const { getUserProfile } = useContext(userContext);
  const navigate = useNavigate();

  const [activeNav, setActiveNav] = useState(isRecruiter ? "listings" : "overview");
  const [profileData, setProfileData] = useState(null);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("authId");
    if (id) {
      getUserProfile(id)
        .then((d) => d && setProfileData(d))
        .catch(() => {});
    }
  }, []);

  // ✅ Redirect if not logged in
  if (!token) {
    navigate("/login");
    return null;
  }

  const displayName =
    profileData?.name || user?.name || user?.email?.split("@")[0] || "User";
  const stats = isRecruiter ? RECRUITER_STATS : CANDIDATE_STATS;

  /* ── Nav items per role ── */
  const candidateNav = [
    { id: "overview",     label: "Overview",    icon: BarChart2  },
    { id: "jobs",         label: "Browse Jobs", icon: Search     },
    { id: "applications", label: "Applications",icon: Send       },
    { id: "saved",        label: "Saved Jobs",  icon: BookMarked },
    { id: "profile",      label: "My Profile",  icon: User       },
  ];
  const recruiterNav = [
    { id: "listings",   label: "Job Listings",   icon: Briefcase  },
    { id: "applicants", label: "Applicants",     icon: Users      },
    { id: "analytics",  label: "Analytics",      icon: TrendingUp },
    { id: "post",       label: "Post a Job",     icon: Plus       },
    { id: "profile",    label: "Company Profile",icon: Settings   },
  ];
  const navItems = isRecruiter ? recruiterNav : candidateNav;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root {
          min-height: 100vh;
          background: #020d1a;
          display: flex;
          font-family: 'DM Sans', sans-serif;
          color: #fff;
          position: relative;
        }
        .db-root::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,232,150,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,232,150,0.018) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none; z-index: 0;
        }

        /* ── SIDEBAR ── */
        .db-sidebar {
          width: 240px; flex-shrink: 0;
          background: rgba(255,255,255,0.02);
          border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column;
          position: sticky; top: 0; height: 100vh;
          z-index: 10; padding: 24px 0;
          animation: fadeSlideLeft 0.5s ease both;
        }

        .db-sidebar-logo {
          padding: 0 20px 24px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          margin-bottom: 16px;
        }
        .db-sidebar-logo-row {
          display: flex; align-items: center; gap: 9px; cursor: pointer;
        }
        .db-sidebar-logo-icon {
          width: 32px; height: 32px; background: #00e896; border-radius: 8px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .db-sidebar-logo-name {
          font-family: 'Syne', sans-serif; font-size: 19px; font-weight: 800;
          color: #00e896; letter-spacing: -0.5px;
        }
        .db-sidebar-role-badge {
          margin-top: 8px; display: inline-block;
          padding: 3px 9px; border-radius: 20px;
          font-size: 10px; font-weight: 600; letter-spacing: 1px;
          text-transform: uppercase;
          background: rgba(0,232,150,0.1); color: #00e896;
          border: 1px solid rgba(0,232,150,0.2);
        }

        .db-nav {
          flex: 1; padding: 0 12px;
          display: flex; flex-direction: column; gap: 2px;
        }
        .db-nav-item {
          display: flex; align-items: center; gap: 11px;
          padding: 10px 12px; border-radius: 10px; cursor: pointer;
          font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.38);
          transition: all 0.18s; border: 1px solid transparent;
          user-select: none;
        }
        .db-nav-item:hover {
          background: rgba(255,255,255,0.04);
          color: rgba(255,255,255,0.7);
        }
        .db-nav-item.active {
          background: rgba(0,232,150,0.08);
          border-color: rgba(0,232,150,0.15);
          color: #00e896; font-weight: 600;
        }
        .db-nav-item svg { opacity: 0.5; transition: opacity 0.18s; flex-shrink: 0; }
        .db-nav-item.active svg,
        .db-nav-item:hover svg { opacity: 1; }

        .db-sidebar-user {
          margin: 12px; padding: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 12px;
        }
        .db-sidebar-user-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
        }
        .db-sidebar-user-avatar {
          width: 34px; height: 34px; border-radius: 9px;
          background: linear-gradient(135deg, #00e896, #4f9eff);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px;
          color: #020d1a; flex-shrink: 0;
        }
        .db-sidebar-user-name {
          font-size: 13px; font-weight: 600; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .db-sidebar-user-email {
          font-size: 10.5px; color: rgba(255,255,255,0.3);
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .db-logout-btn {
          width: 100%; padding: 8px; border-radius: 8px;
          background: rgba(255,80,80,0.07); border: 1px solid rgba(255,80,80,0.13);
          color: #ff7070; font-family: 'DM Sans', sans-serif;
          font-size: 12px; font-weight: 500; cursor: pointer;
          transition: all 0.18s;
          display: flex; align-items: center; justify-content: center; gap: 6px;
        }
        .db-logout-btn:hover {
          background: rgba(255,80,80,0.14);
          border-color: rgba(255,80,80,0.25);
        }

        /* ── MAIN ── */
        .db-main {
          flex: 1; overflow-y: auto; position: relative; z-index: 1;
          padding: 32px;
          animation: fadeSlideUp 0.5s ease 0.1s both;
        }
        .db-topbar {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 32px;
        }
        .db-topbar-greeting { font-family: 'Syne', sans-serif; }
        .db-topbar-hi { font-size: 22px; font-weight: 700; color: #fff; }
        .db-topbar-sub { font-size: 13px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .db-topbar-actions { display: flex; align-items: center; gap: 10px; }
        .db-topbar-icon-btn {
          width: 38px; height: 38px; border-radius: 10px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.45); cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s; position: relative;
        }
        .db-topbar-icon-btn:hover { background: rgba(255,255,255,0.08); color: #fff; }
        .db-notif-dot {
          position: absolute; top: 7px; right: 7px;
          width: 7px; height: 7px; border-radius: 50%;
          background: #00e896; border: 1.5px solid #020d1a;
        }

        /* ── STAT CARDS ── */
        .db-stats-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          gap: 14px; margin-bottom: 28px;
        }
        .db-stat-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 14px; padding: 18px 20px;
          transition: border-color 0.2s, transform 0.2s;
        }
        .db-stat-card:hover {
          border-color: rgba(255,255,255,0.12);
          transform: translateY(-2px);
        }
        .db-stat-top {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 12px;
        }
        .db-stat-icon {
          width: 36px; height: 36px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
        }
        .db-stat-label { font-size: 12px; color: rgba(255,255,255,0.38); margin-bottom: 4px; }
        .db-stat-value {
          font-family: 'Syne', sans-serif; font-size: 28px; font-weight: 700;
          color: #fff; letter-spacing: -1px; line-height: 1;
        }
        .db-stat-delta { font-size: 11px; color: rgba(255,255,255,0.25); margin-top: 4px; }

        /* ── SECTION HEADER ── */
        .db-section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 14px;
        }
        .db-section-title {
          font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; color: #fff;
        }
        .db-section-link {
          font-size: 12px; color: #00e896; cursor: pointer; font-weight: 500;
          display: flex; align-items: center; gap: 2px; transition: opacity 0.2s;
        }
        .db-section-link:hover { opacity: 0.75; }

        /* ── CONTENT GRID ── */
        .db-content-grid {
          display: grid; grid-template-columns: 1fr 340px; gap: 20px;
        }

        /* ── TABLE CARD ── */
        .db-table-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; overflow: hidden;
        }
        .db-table-head {
          display: grid; padding: 12px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          font-size: 10.5px; font-weight: 600; letter-spacing: 0.8px;
          text-transform: uppercase; color: rgba(255,255,255,0.22);
        }
        .db-table-row {
          display: grid; padding: 14px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.04);
          align-items: center; transition: background 0.16s; cursor: pointer;
        }
        .db-table-row:last-child { border-bottom: none; }
        .db-table-row:hover { background: rgba(255,255,255,0.025); }
        .db-role-name { font-size: 13.5px; font-weight: 600; color: #fff; }
        .db-company-name { font-size: 12px; color: rgba(255,255,255,0.38); margin-top: 1px; }
        .db-location-badge {
          display: flex; align-items: center; gap: 4px;
          font-size: 11.5px; color: rgba(255,255,255,0.35);
        }
        .db-salary { font-size: 12.5px; color: rgba(255,255,255,0.5); font-weight: 500; }
        .db-status-pill {
          display: inline-flex; padding: 3px 10px; border-radius: 20px;
          font-size: 11px; font-weight: 600; width: fit-content;
        }
        .db-applicant-count {
          font-family: 'Syne', sans-serif; font-size: 16px; font-weight: 700; color: #fff;
        }
        .db-new-badge {
          font-size: 10px; font-weight: 600; color: #00e896;
          background: rgba(0,232,150,0.1); border-radius: 20px;
          padding: 2px 7px; margin-left: 6px;
        }
        .db-posted-time { font-size: 11px; color: rgba(255,255,255,0.25); }

        /* ── SIDE PANEL ── */
        .db-side-panel { display: flex; flex-direction: column; gap: 16px; }

        /* ── MATCH CARD ── */
        .db-match-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 18px;
        }
        .db-match-item {
          display: flex; align-items: center; gap: 12px;
          padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .db-match-item:last-child { border-bottom: none; padding-bottom: 0; }
        .db-match-info { flex: 1; min-width: 0; }
        .db-match-role {
          font-size: 13px; font-weight: 600; color: #fff;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
        }
        .db-match-company { font-size: 11px; color: rgba(255,255,255,0.35); }
        .db-match-pct {
          font-family: 'Syne', sans-serif; font-size: 15px;
          font-weight: 800; color: #00e896; flex-shrink: 0;
        }

        /* ── QUICK ACTIONS ── */
        .db-quick-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 18px;
        }
        .db-quick-btn {
          width: 100%; display: flex; align-items: center; gap: 10px;
          padding: 10px 12px; border-radius: 10px; margin-bottom: 6px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.6); cursor: pointer;
          font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500;
          transition: all 0.18s; text-align: left;
        }
        .db-quick-btn:last-child { margin-bottom: 0; }
        .db-quick-btn:hover {
          background: rgba(0,232,150,0.07);
          border-color: rgba(0,232,150,0.2);
          color: #00e896;
        }
        .db-quick-btn svg { flex-shrink: 0; }
        .db-quick-btn-arrow { margin-left: auto; opacity: 0.4; }

        /* ── PROFILE CARD ── */
        .db-profile-card {
          background: rgba(0,232,150,0.05);
          border: 1px solid rgba(0,232,150,0.15);
          border-radius: 16px; padding: 18px;
        }
        .db-profile-pct-row {
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 8px;
        }
        .db-profile-pct-label { font-size: 12px; color: rgba(255,255,255,0.45); }
        .db-profile-pct-value {
          font-family: 'Syne', sans-serif; font-size: 20px;
          font-weight: 800; color: #00e896;
        }
        .db-profile-bar-bg {
          height: 5px; background: rgba(255,255,255,0.07);
          border-radius: 99px; overflow: hidden;
        }
        .db-profile-bar-fill {
          height: 100%; background: #00e896; border-radius: 99px;
          box-shadow: 0 0 8px rgba(0,232,150,0.5);
        }
        .db-profile-tip { font-size: 11.5px; color: rgba(255,255,255,0.3); margin-top: 10px; }
        .db-profile-tip span { color: #00e896; font-weight: 500; }

        /* ── POST JOB BTN ── */
        .db-post-btn {
          width: 100%; padding: 13px; border-radius: 10px;
          background: #00e896; color: #020d1a; border: none;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 700;
          cursor: pointer; transition: all 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(0,232,150,0.25);
        }
        .db-post-btn:hover {
          background: #00ffa3;
          box-shadow: 0 6px 28px rgba(0,232,150,0.4);
          transform: translateY(-1px);
        }

        /* ── FUNNEL CARD ── */
        .db-funnel-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 16px; padding: 18px;
        }
        .db-funnel-row {
          display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
        }
        .db-funnel-row:last-child { margin-bottom: 0; }
        .db-funnel-label {
          font-size: 12px; color: rgba(255,255,255,0.38);
          width: 90px; flex-shrink: 0;
        }
        .db-funnel-bar-bg {
          flex: 1; height: 6px; background: rgba(255,255,255,0.06);
          border-radius: 99px; overflow: hidden;
        }
        .db-funnel-bar-fill { height: 100%; border-radius: 99px; }
        .db-funnel-count {
          font-family: 'Syne', sans-serif; font-size: 13px;
          font-weight: 700; color: #fff; width: 30px;
          text-align: right; flex-shrink: 0;
        }

        /* ── KEYFRAMES ── */
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeSlideLeft {
          from { opacity: 0; transform: translateX(-12px); }
          to   { opacity: 1; transform: translateX(0); }
        }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .db-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .db-content-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 700px) {
          .db-sidebar { display: none; }
          .db-main { padding: 20px 16px; }
          .db-stats-grid { grid-template-columns: 1fr 1fr; }
        }
      `}</style>

      <div className="db-root">

        {/* ── SIDEBAR ── */}
        <aside className="db-sidebar">

          {/* ✅ FIXED: Logo row = icon + name only. No DashboardButtons here. */}
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
            <div className="db-sidebar-role-badge">
              {isRecruiter ? "Recruiter" : "Candidate"}
            </div>
          </div>

          {/* Nav */}
          <nav className="db-nav">
            {navItems.map(({ id, label, icon: Icon }) => (
              <div
                key={id}
                className={`db-nav-item ${activeNav === id ? "active" : ""}`}
                onClick={() => setActiveNav(id)}
              >
                <Icon size={16} />
                {label}
              </div>
            ))}
          </nav>

          {/* User card + logout */}
          <div className="db-sidebar-user">
            <div className="db-sidebar-user-row">
              <div className="db-sidebar-user-avatar">
                {displayName[0]?.toUpperCase()}
              </div>
              <div style={{ minWidth: 0 }}>
                <div className="db-sidebar-user-name">{displayName}</div>
                <div className="db-sidebar-user-email">{user?.email || ""}</div>
              </div>
            </div>
            <button className="db-logout-btn" onClick={logout}>
              <LogOut size={13} /> Sign Out
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="db-main">

          {/* Topbar */}
          <div className="db-topbar">
            <div className="db-topbar-greeting">
              <div className="db-topbar-hi">
                Good morning, {displayName.split(" ")[0]} 👋
              </div>
              <div className="db-topbar-sub">
                {isRecruiter
                  ? "Here's what's happening with your listings today."
                  : "You have 2 new job matches since your last visit."}
              </div>
            </div>
            <div className="db-topbar-actions">
              <div
                className="db-topbar-icon-btn"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={17} />
                <div className="db-notif-dot" />
              </div>
              <div
                className="db-topbar-icon-btn"
                onClick={() => navigate("/profile")}
              >
                <User size={17} />
              </div>
            </div>
          </div>

          {/* Stat cards */}
          <div className="db-stats-grid">
            {stats.map(({ label, value, delta, icon: Icon, color }) => (
              <div className="db-stat-card" key={label}>
                <div className="db-stat-top">
                  <div className="db-stat-icon" style={{ background: `${color}18`, color }}>
                    <Icon size={17} />
                  </div>
                </div>
                <div className="db-stat-label">{label}</div>
                <div className="db-stat-value">{value}</div>
                <div className="db-stat-delta">{delta}</div>
              </div>
            ))}
          </div>

          {/* Role-specific panel */}
          {isRecruiter
            ? <RecruiterPanel navigate={navigate} />
            : <CandidatePanel navigate={navigate} />}
        </main>
      </div>
    </>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   CANDIDATE PANEL
═══════════════════════════════════════════════════════════════════ */
const CandidatePanel = ({ navigate }) => (
  <div className="db-content-grid">
    <div>
      <div className="db-section-header">
        <div className="db-section-title">Recent Applications</div>
        <div className="db-section-link" onClick={() => navigate("/applications")}>
          View all <ChevronRight size={13} />
        </div>
      </div>
      <div className="db-table-card">
        <div className="db-table-head" style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}>
          <span>Role</span><span>Location</span><span>Salary</span><span>Status</span>
        </div>
        {RECENT_APPLICATIONS.map((app) => {
          const s = STATUS_STYLES[app.status];
          return (
            <div
              className="db-table-row"
              key={app.role}
              style={{ gridTemplateColumns: "2fr 1fr 1fr 1fr" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar letter={app.logo} color={app.color} />
                <div>
                  <div className="db-role-name">{app.role}</div>
                  <div className="db-company-name">{app.company}</div>
                </div>
              </div>
              <div className="db-location-badge">
                <MapPin size={11} /> {app.location}
              </div>
              <div className="db-salary">{app.salary}</div>
              <div className="db-status-pill" style={{ background: s.bg, color: s.color }}>
                {s.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="db-side-panel">
      {/* Profile Strength */}
      <div className="db-profile-card">
        <div className="db-section-title" style={{ marginBottom: 12 }}>Profile Strength</div>
        <div className="db-profile-pct-row">
          <div className="db-profile-pct-label">Completion</div>
          <div className="db-profile-pct-value">72%</div>
        </div>
        <div className="db-profile-bar-bg">
          <div className="db-profile-bar-fill" style={{ width: "72%" }} />
        </div>
        <div className="db-profile-tip">
          Add your <span>resume</span> and <span>skills</span> to reach 100%
        </div>
      </div>

      {/* Top Matches */}
      <div className="db-match-card">
        <div className="db-section-header">
          <div className="db-section-title">Top Matches</div>
          <div className="db-section-link" onClick={() => navigate("/jobs")}>
            Browse <ChevronRight size={13} />
          </div>
        </div>
        {RECOMMENDED_JOBS.map((job) => (
          <div className="db-match-item" key={job.role}>
            <Avatar letter={job.logo} color={job.color} size={34} />
            <div className="db-match-info">
              <div className="db-match-role">{job.role}</div>
              <div className="db-match-company">{job.company} · {job.location}</div>
            </div>
            <div className="db-match-pct">{job.match}%</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="db-quick-card">
        <div className="db-section-title" style={{ marginBottom: 12 }}>Quick Actions</div>
        {[
          { icon: Search,        label: "Browse New Jobs"   },
          { icon: User,          label: "Update Profile"    },
          { icon: FileText,      label: "Upload Resume"     },
          { icon: MessageSquare, label: "Message Recruiter" },
        ].map(({ icon: Icon, label }) => (
          <button className="db-quick-btn" key={label}>
            <Icon size={14} />
            {label}
            <ChevronRight size={13} className="db-quick-btn-arrow" />
          </button>
        ))}
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   RECRUITER PANEL
═══════════════════════════════════════════════════════════════════ */
const RecruiterPanel = ({ navigate }) => (
  <div className="db-content-grid">
    <div>
      <div className="db-section-header">
        <div className="db-section-title">Active Job Listings</div>
        <div className="db-section-link" onClick={() => navigate("/my-listings")}>
          Manage all <ChevronRight size={13} />
        </div>
      </div>
      <div className="db-table-card">
        <div className="db-table-head" style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1fr" }}>
          <span>Role</span><span>Applicants</span><span>Status</span><span>Posted</span>
        </div>
        {RECENT_LISTINGS.map((listing) => {
          const s = STATUS_STYLES[listing.status];
          return (
            <div
              className="db-table-row"
              key={listing.role}
              style={{ gridTemplateColumns: "2fr 1.2fr 1fr 1fr" }}
            >
              <div className="db-role-name">{listing.role}</div>
              <div>
                <span className="db-applicant-count">{listing.applicants}</span>
                {listing.new > 0 && (
                  <span className="db-new-badge">+{listing.new} new</span>
                )}
              </div>
              <div className="db-status-pill" style={{ background: s.bg, color: s.color }}>
                {s.label}
              </div>
              <div className="db-posted-time">{listing.posted}</div>
            </div>
          );
        })}
      </div>
    </div>

    <div className="db-side-panel">
      {/* Post a Job CTA */}
      <div className="db-quick-card">
        <div className="db-section-title" style={{ marginBottom: 12 }}>Post a New Job</div>
        <p style={{ fontSize: 12.5, color: "rgba(255,255,255,0.35)", marginBottom: 14, lineHeight: 1.6 }}>
          Reach thousands of qualified candidates on RozgaarX within minutes.
        </p>
        <button className="db-post-btn" onClick={() => navigate("/post-job")}>
          <Plus size={16} /> Create Job Listing
        </button>
      </div>

      {/* Hiring Funnel */}
      <div className="db-funnel-card">
        <div className="db-section-title" style={{ marginBottom: 14 }}>Hiring Funnel</div>
        {[
          { label: "Applied",     count: 143, pct: 100, color: "#4f9eff" },
          { label: "Reviewed",    count: 89,  pct: 62,  color: "#b66dff" },
          { label: "Shortlisted", count: 19,  pct: 13,  color: "#f5a623" },
          { label: "Interviewed", count: 8,   pct: 6,   color: "#00e896" },
          { label: "Offered",     count: 3,   pct: 2,   color: "#ff7070" },
        ].map(({ label, count, pct, color }) => (
          <div className="db-funnel-row" key={label}>
            <div className="db-funnel-label">{label}</div>
            <div className="db-funnel-bar-bg">
              <div className="db-funnel-bar-fill" style={{ width: `${pct}%`, background: color }} />
            </div>
            <div className="db-funnel-count">{count}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="db-quick-card">
        <div className="db-section-title" style={{ marginBottom: 12 }}>Quick Actions</div>
        {[
          { icon: Users,    label: "Review Applicants"    },
          { icon: BarChart2,label: "View Analytics"       },
          { icon: Settings, label: "Edit Company Profile" },
          { icon: Zap,      label: "Boost a Listing"      },
        ].map(({ icon: Icon, label }) => (
          <button className="db-quick-btn" key={label}>
            <Icon size={14} />
            {label}
            <ChevronRight size={13} className="db-quick-btn-arrow" />
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default Dashboard;