import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext.jsx";
import { ApplicationContext } from "../../context/ApplicationContext.jsx";
import { MapPin, ChevronRight, Clock, Filter, X, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { SidebarLayout, Avatar, LOGO_COLORS, STATUS_STYLES, SHARED_STYLES } from "./Dashboard.jsx";

const MyApplications = () => {
  const { user, token } = useContext(AuthContext);
  const { getApplicationsByUserId, updateApplicationStatus } = useContext(ApplicationContext);

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);

  const userId = localStorage.getItem("authId");

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    getApplicationsByUserId(userId)
      .then(data => {
        const list = Array.isArray(data) ? data : [];
        setApplications(list);
        if (list.length > 0) setSelected(list[0]);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userId]);

  const STATUS_FILTERS = ["all", "applied", "review", "shortlisted", "rejected", "hired"];

  const filtered = filter === "all"
    ? applications
    : applications.filter(a => (a.status || "applied").toLowerCase().replace(" ", "") === filter.replace(" ", ""));

  /* ── Stats ── */
  const stats = {
    total:       applications.length,
    active:      applications.filter(a => !["rejected","hired"].includes((a.status||"").toLowerCase())).length,
    interviews:  applications.filter(a => (a.status||"").toLowerCase().includes("interview")).length,
    offers:      applications.filter(a => (a.status||"").toLowerCase() === "hired").length,
  };

  return (
    <>
      <style>{SHARED_STYLES + `
        .ap-stats { display: grid; grid-template-columns: repeat(4,1fr); gap: 12px; margin-bottom: 24px; }
        .ap-stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 16px 18px; }
        .ap-stat-val { font-family: 'Syne',sans-serif; font-size: 26px; font-weight: 700; color: #fff; }
        .ap-stat-label { font-size: 11.5px; color: rgba(255,255,255,0.35); margin-top: 2px; }
        .ap-layout { display: grid; grid-template-columns: 380px 1fr; gap: 20px; height: calc(100vh - 280px); }
        .ap-list { overflow-y: auto; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; }
        .ap-list::-webkit-scrollbar { width: 4px; }
        .ap-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .ap-item { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; transition: background 0.15s; }
        .ap-item:hover { background: rgba(255,255,255,0.025); }
        .ap-item.selected { background: rgba(0,232,150,0.05); border-left: 2px solid #00e896; }
        .ap-item-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .ap-item-info { flex: 1; min-width: 0; }
        .ap-item-role { font-size: 13.5px; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ap-item-company { font-size: 12px; color: rgba(255,255,255,0.38); }
        .ap-item-meta { display: flex; align-items: center; justify-content: space-between; }
        .ap-item-date { font-size: 11px; color: rgba(255,255,255,0.22); }
        .ap-detail { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 28px; overflow-y: auto; }
        .ap-detail::-webkit-scrollbar { width: 4px; }
        .ap-detail::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .ap-detail-header { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.07); }
        .ap-detail-title { font-family: 'Syne',sans-serif; font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .ap-detail-company { font-size: 13px; color: rgba(255,255,255,0.4); margin-bottom: 14px; }
        .ap-timeline { margin-top: 8px; }
        .ap-timeline-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 0; position: relative; }
        .ap-timeline-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; margin-top: 4px; }
        .ap-timeline-line { position: absolute; left: 4px; top: 18px; bottom: -10px; width: 2px; background: rgba(255,255,255,0.06); }
        .ap-timeline-step { font-size: 13px; font-weight: 600; color: #fff; }
        .ap-timeline-date { font-size: 11px; color: rgba(255,255,255,0.3); margin-top: 2px; }
        .ap-filter-strip { display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap; }
        .ap-filter-btn { padding: 5px 14px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.38); background: transparent; font-family: 'DM Sans',sans-serif; transition: all 0.15s; text-transform: capitalize; }
        .ap-filter-btn.active { background: rgba(0,232,150,0.1); border-color: rgba(0,232,150,0.3); color: #00e896; }
        .ap-empty { display: flex; align-items: center; justify-content: center; height: 100%; color: rgba(255,255,255,0.2); font-size: 13px; flex-direction: column; gap: 8px; }
      `}</style>

      <SidebarLayout activeNav="applications" onNav={() => {}}>
        <div className="db-topbar">
          <div className="db-topbar-greeting">
            <div className="db-topbar-hi">My Applications</div>
            <div className="db-topbar-sub">Track every application in one place</div>
          </div>
        </div>

        {/* Stats */}
        <div className="ap-stats">
          {[
            { label: "Total Applied", value: stats.total, color: "#4f9eff" },
            { label: "Active",        value: stats.active, color: "#00e896" },
            { label: "Interviews",    value: stats.interviews, color: "#b66dff" },
            { label: "Offers",        value: stats.offers, color: "#f5a623" },
          ].map(({ label, value, color }) => (
            <div className="ap-stat" key={label}>
              <div className="ap-stat-val" style={{ color }}>{loading ? "—" : value}</div>
              <div className="ap-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* Filter strip */}
        <div className="ap-filter-strip">
          {STATUS_FILTERS.map(f => (
            <button key={f} className={`ap-filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? "All" : (STATUS_STYLES[f]?.label || f)}
            </button>
          ))}
        </div>

        {/* Layout */}
        <div className="ap-layout">
          {/* List */}
          <div className="ap-list">
            {loading && <div className="db-empty">Loading...</div>}
            {!loading && filtered.length === 0 && (
              <div className="db-empty">No applications{filter !== "all" ? ` with status "${filter}"` : ""} yet.</div>
            )}
            {filtered.map((app, i) => {
              const statusKey = (app.status || "applied").toLowerCase().replace(" ","");
              const s = STATUS_STYLES[statusKey] || STATUS_STYLES.applied;
              const color = LOGO_COLORS[i % LOGO_COLORS.length];
              const company = app.companyName || app.job?.companyName || "Company";
              const role = app.jobTitle || app.job?.title || "Position";
              const dateStr = app.createdAt || app.appliedAt
                ? new Date(app.createdAt || app.appliedAt).toLocaleDateString()
                : "—";
              return (
                <div key={app.id || i} className={`ap-item ${selected?.id === app.id ? "selected" : ""}`} onClick={() => setSelected(app)}>
                  <div className="ap-item-top">
                    <Avatar letter={company[0]?.toUpperCase()} color={color} size={36} />
                    <div className="ap-item-info">
                      <div className="ap-item-role">{role}</div>
                      <div className="ap-item-company">{company}</div>
                    </div>
                  </div>
                  <div className="ap-item-meta">
                    <span className="ap-item-date">{dateStr}</span>
                    <div className="db-status-pill" style={{ background: s.bg, color: s.color }}>{s.label}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail */}
          <div className="ap-detail">
            {!selected ? (
              <div className="ap-empty"><AlertCircle size={28} opacity={0.3} />Select an application</div>
            ) : (() => {
              const idx = applications.findIndex(a => a.id === selected.id);
              const color = LOGO_COLORS[Math.max(idx, 0) % LOGO_COLORS.length];
              const company = selected.companyName || selected.job?.companyName || "Company";
              const role = selected.jobTitle || selected.job?.title || "Position";
              const statusKey = (selected.status || "applied").toLowerCase().replace(" ","");
              const s = STATUS_STYLES[statusKey] || STATUS_STYLES.applied;

              /* Build a simple timeline based on status */
              const timelineSteps = [
                { step: "Applied", done: true, color: "#4f9eff" },
                { step: "Under Review", done: ["review","shortlisted","interview","hired"].includes(statusKey), color: "#b66dff" },
                { step: "Shortlisted", done: ["shortlisted","interview","hired"].includes(statusKey), color: "#f5a623" },
                { step: "Interview", done: ["interview","hired"].includes(statusKey), color: "#00e896" },
                { step: "Decision", done: ["hired","rejected"].includes(statusKey), color: statusKey === "rejected" ? "#ff7070" : "#00e896" },
              ];

              return (
                <>
                  <div className="ap-detail-header">
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 16 }}>
                      <Avatar letter={company[0]?.toUpperCase()} color={color} size={48} />
                      <div>
                        <div className="ap-detail-title">{role}</div>
                        <div className="ap-detail-company">{company}</div>
                        <div className="db-status-pill" style={{ background: s.bg, color: s.color }}>{s.label}</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {selected.location && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 4 }}><MapPin size={11} />{selected.location}</span>}
                      {selected.salary && <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{selected.salary}</span>}
                      {(selected.createdAt || selected.appliedAt) && (
                        <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)", display: "flex", alignItems: "center", gap: 4 }}>
                          <Clock size={11} /> Applied {new Date(selected.createdAt || selected.appliedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Application Timeline */}
                  <div style={{ marginBottom: 0 }}>
                    <div className="db-section-title" style={{ marginBottom: 16 }}>Application Progress</div>
                    <div className="ap-timeline">
                      {timelineSteps.map(({ step, done, color: tc }, i) => (
                        <div className="ap-timeline-item" key={step}>
                          {i < timelineSteps.length - 1 && <div className="ap-timeline-line" />}
                          <div className="ap-timeline-dot" style={{ background: done ? tc : "rgba(255,255,255,0.1)", boxShadow: done ? `0 0 6px ${tc}60` : "none" }} />
                          <div>
                            <div className="ap-timeline-step" style={{ color: done ? "#fff" : "rgba(255,255,255,0.3)" }}>{step}</div>
                            {done && <div className="ap-timeline-date">{i === 0 ? new Date(selected.createdAt || selected.appliedAt || Date.now()).toLocaleDateString() : "Completed"}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Job notes/description if available */}
                  {(selected.job?.description || selected.coverLetter) && (
                    <div style={{ marginTop: 24, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="db-section-title" style={{ marginBottom: 10 }}>
                        {selected.coverLetter ? "Your Cover Letter" : "Job Description"}
                      </div>
                      <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.75 }}>
                        {selected.coverLetter || selected.job?.description}
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </SidebarLayout>
    </>
  );
};

export default MyApplications;