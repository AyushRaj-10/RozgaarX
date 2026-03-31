import { useContext } from "react"; // ✅ FIX: was missing
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const RECRUITER_BUTTONS = [
  { label: "Job Listings",    path: "/dashboard"       },
  { label: "Post a Job",      path: "/post-job"        },
  { label: "Applicants",      path: "/applicants"      },
  { label: "Company Profile", path: "/company-profile" },
];

const CANDIDATE_BUTTONS = [
  { label: "Overview",      path: "/dashboard"    },
  { label: "Browse Jobs",   path: "/jobs"         },
  { label: "Applications",  path: "/applications" },
  { label: "Saved Jobs",    path: "/saved-jobs"   },
  { label: "My Profile",    path: "/profile"      },
];

// Use this component in Navbar / mobile bottom bar — NOT inside the sidebar
// (the sidebar renders its own nav items already)
const DashboardButtons = () => {
  const { isRecruiter, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!token) return null;

  const buttons = isRecruiter ? RECRUITER_BUTTONS : CANDIDATE_BUTTONS;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      {buttons.map(({ label, path }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(0,232,150,0.08)";
            e.target.style.borderColor = "rgba(0,232,150,0.2)";
            e.target.style.color = "#00e896";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.04)";
            e.target.style.borderColor = "rgba(255,255,255,0.08)";
            e.target.style.color = "rgba(255,255,255,0.6)";
          }}
        >
          {label}
        </button>
      ))}

      <button
        onClick={logout}
        style={{
          padding: "8px 14px",
          borderRadius: 8,
          background: "rgba(255,80,80,0.07)",
          border: "1px solid rgba(255,80,80,0.15)",
          color: "#ff7070",
          fontSize: 13,
          fontWeight: 500,
          cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.18s",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default DashboardButtons;