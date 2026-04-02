import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext.jsx";
import { ApplicationContext } from "../../context/ApplicationContext.jsx";
import { JobContext } from "../../context/JobContext.jsx";
import { Users, MapPin, Clock, ChevronDown, Check, X } from "lucide-react";
import { SidebarLayout, Avatar, LOGO_COLORS, STATUS_STYLES, SHARED_STYLES } from "../user/Dashboard.jsx";

const STATUS_OPTIONS = ["applied", "review", "shortlisted", "rejected", "hired"];

const Applicants = () => {
  const { user } = useContext(AuthContext);
  const { getApplicationsByJobId, updateApplicationStatus } = useContext(ApplicationContext);
  const { getJobs } = useContext(JobContext);

  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [loadingApps, setLoadingApps] = useState(false);
  const [filter, setFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selected, setSelected] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    setLoadingJobs(true);
    getJobs(1)
      .then(data => {
        const list = Array.isArray(data) ? data : data?.jobs || data?.content || [];
        setJobs(list);
        if (list.length > 0) {
          setSelectedJobId(list[0].id);
          fetchApplicants(list[0].id);
        }
      })
      .catch(() => {})
      .finally(() => setLoadingJobs(false));
  }, []);

  const fetchApplicants = async (jobId) => {
    setLoadingApps(true);
    setApplicants([]);
    setSelected(null);
    try {
      const data = await getApplicationsByJobId(jobId);
      const list = Array.isArray(data) ? data : [];
      setApplicants(list);
      if (list.length > 0) setSelected(list[0]);
    } catch (e) {}
    setLoadingApps(false);
  };

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    setDropdownOpen(null);
    try {
      await updateApplicationStatus(appId, newStatus);
      setApplicants(prev => prev.map(a => a.id === appId ? { ...a, status: newStatus } : a));
      if (selected?.id === appId) setSelected(s => ({ ...s, status: newStatus }));
      showToast(`Status updated to ${newStatus}`, "success");
    } catch (e) {
      showToast("Failed to update status", "error");
    } finally {
      setUpdatingId(null);
    }
  };

  const showToast = (msg, type) => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = filter === "all"
    ? applicants
    : applicants.filter(a => (a.status || "applied").toLowerCase().replace(" ", "") === filter);

  const funnelCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = applicants.filter(a => (a.status || "applied").toLowerCase().replace(" ","") === s).length;
    return acc;
  }, {});

  return (
    <>
      <style>{SHARED_STYLES + `
        .ac-layout { display: grid; grid-template-columns: 220px 1fr 340px; gap: 16px; height: calc(100vh - 200px); }
        .ac-job-list { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow-y: auto; padding: 8px; }
        .ac-job-list::-webkit-scrollbar { width: 3px; }
        .ac-job-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .ac-job-item { padding: 10px 12px; border-radius: 10px; cursor: pointer; transition: background 0.15s; margin-bottom: 4px; }
        .ac-job-item:hover { background: rgba(255,255,255,0.04); }
        .ac-job-item.active { background: rgba(0,232,150,0.07); border: 1px solid rgba(0,232,150,0.15); }
        .ac-job-title { font-size: 12.5px; font-weight: 600; color: #fff; margin-bottom: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ac-job-count { font-size: 10.5px; color: rgba(255,255,255,0.3); }
        .ac-app-list { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; overflow-y: auto; }
        .ac-app-list::-webkit-scrollbar { width: 3px; }
        .ac-app-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .ac-app-item { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); cursor: pointer; transition: background 0.15s; position: relative; }
        .ac-app-item:hover { background: rgba(255,255,255,0.02); }
        .ac-app-item.selected { background: rgba(0,232,150,0.04); border-left: 2px solid #00e896; }
        .ac-app-top { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
        .ac-app-name { font-size: 13.5px; font-weight: 600; color: #fff; }
        .ac-app-email { font-size: 11.5px; color: rgba(255,255,255,0.3); }
        .ac-app-bottom { display: flex; align-items: center; justify-content: space-between; }
        .ac-status-dropdown { position: relative; }
        .ac-status-trigger { display: flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; cursor: pointer; border: none; }
        .ac-dropdown-menu { position: absolute; top: calc(100% + 6px); right: 0; background: #0d1f30; border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; overflow: hidden; z-index: 50; min-width: 130px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
        .ac-dropdown-item { padding: 8px 14px; font-size: 12px; cursor: pointer; transition: background 0.12s; display: flex; align-items: center; gap: 8px; }
        .ac-dropdown-item:hover { background: rgba(255,255,255,0.07); }
        .ac-detail { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 22px; overflow-y: auto; }
        .ac-detail::-webkit-scrollbar { width: 3px; }
        .ac-detail::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .ac-detail-name { font-family: 'Syne',sans-serif; font-size: 18px; font-weight: 700; color: #fff; margin-bottom: 4px; }
        .ac-detail-email { font-size: 12px; color: rgba(255,255,255,0.35); margin-bottom: 14px; }
        .ac-info-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; font-size: 12.5px; color: rgba(255,255,255,0.45); }
        .ac-action-btn { width: 100%; padding: 10px; border-radius: 8px; font-family: 'DM Sans',sans-serif; font-size: 13px; font-weight: 500; cursor: pointer; border: 1px solid; margin-bottom: 8px; transition: all 0.15s; display: flex; align-items: center; justify-content: center; gap: 6px; }
        .ac-filter-row { display: flex; gap: 6px; margin-bottom: 12px; flex-wrap: wrap; }
        .ac-filter-btn { padding: 4px 12px; border-radius: 20px; font-size: 11.5px; font-weight: 500; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.38); background: transparent; font-family: 'DM Sans',sans-serif; transition: all 0.15s; }
        .ac-filter-btn.active { background: rgba(0,232,150,0.1); border-color: rgba(0,232,150,0.3); color: #00e896; }
        .ac-toast { position: fixed; bottom: 24px; right: 24px; padding: 12px 18px; border-radius: 10px; font-size: 13px; z-index: 100; animation: fadeSlideUp 0.3s ease; }
        .ac-toast.success { background: rgba(0,232,150,0.15); border: 1px solid rgba(0,232,150,0.3); color: #00e896; }
        .ac-toast.error { background: rgba(255,80,80,0.15); border: 1px solid rgba(255,80,80,0.3); color: #ff7070; }
        .ac-empty { display: flex; align-items: center; justify-content: center; height: 100%; color: rgba(255,255,255,0.2); font-size: 13px; }
      `}</style>

      <SidebarLayout activeNav="applicants" onNav={() => {}}>
        <div className="db-topbar">
          <div className="db-topbar-greeting">
            <div className="db-topbar-hi">Applicants</div>
            <div className="db-topbar-sub">
              {applicants.length} applicant{applicants.length !== 1 ? "s" : ""} for selected job
            </div>
          </div>
        </div>

        <div className="ac-filter-row">
          {["all", ...STATUS_OPTIONS].map(f => (
            <button key={f} className={`ac-filter-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
              {f === "all" ? `All (${applicants.length})` : `${STATUS_STYLES[f]?.label || f} (${funnelCounts[f] || 0})`}
            </button>
          ))}
        </div>

        <div className="ac-layout">
          {/* Job selector */}
          <div className="ac-job-list">
            <div style={{ padding: "6px 12px 10px", fontSize: 10, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", color: "rgba(255,255,255,0.22)" }}>Your Listings</div>
            {loadingJobs && <div style={{ padding: 12, fontSize: 12, color: "rgba(255,255,255,0.25)" }}>Loading...</div>}
            {jobs.map(job => (
              <div
                key={job.id}
                className={`ac-job-item ${selectedJobId === job.id ? "active" : ""}`}
                onClick={() => { setSelectedJobId(job.id); fetchApplicants(job.id); setFilter("all"); }}
              >
                <div className="ac-job-title">{job.title || job.role}</div>
                <div className="ac-job-count">{job.location || "Remote"}</div>
              </div>
            ))}
          </div>

          {/* Applicant list */}
          <div className="ac-app-list">
            {loadingApps && <div className="ac-empty">Loading applicants...</div>}
            {!loadingApps && filtered.length === 0 && <div className="ac-empty">No applicants{filter !== "all" ? ` with this status` : " yet"}</div>}
            {!loadingApps && filtered.map((app, i) => {
              const statusKey = (app.status || "applied").toLowerCase().replace(" ","");
              const s = STATUS_STYLES[statusKey] || STATUS_STYLES.applied;
              const color = LOGO_COLORS[i % LOGO_COLORS.length];
              const name = app.userName || app.applicantName || app.user?.name || `Applicant ${i + 1}`;
              const email = app.userEmail || app.applicantEmail || app.user?.email || "";
              return (
                <div key={app.id || i} className={`ac-app-item ${selected?.id === app.id ? "selected" : ""}`} onClick={() => setSelected(app)}>
                  <div className="ac-app-top">
                    <Avatar letter={name[0]?.toUpperCase()} color={color} size={34} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="ac-app-name">{name}</div>
                      <div className="ac-app-email">{email}</div>
                    </div>
                  </div>
                  <div className="ac-app-bottom">
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
                      {app.createdAt ? new Date(app.createdAt).toLocaleDateString() : "—"}
                    </span>
                    <div className="ac-status-dropdown" onClick={e => e.stopPropagation()}>
                      <button
                        className="ac-status-trigger"
                        style={{ background: s.bg, color: s.color }}
                        onClick={() => setDropdownOpen(dropdownOpen === app.id ? null : app.id)}
                      >
                        {s.label} <ChevronDown size={10} />
                      </button>
                      {dropdownOpen === app.id && (
                        <div className="ac-dropdown-menu">
                          {STATUS_OPTIONS.map(opt => {
                            const os = STATUS_STYLES[opt] || STATUS_STYLES.applied;
                            return (
                              <div key={opt} className="ac-dropdown-item" style={{ color: os.color }} onClick={() => handleStatusChange(app.id, opt)}>
                                <div style={{ width: 7, height: 7, borderRadius: "50%", background: os.color }} />
                                {os.label}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                  {updatingId === app.id && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 4, fontSize: 11, color: "#00e896" }}>Updating...</div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Detail panel */}
          <div className="ac-detail">
            {!selected ? (
              <div className="ac-empty">Select an applicant</div>
            ) : (() => {
              const idx = applicants.findIndex(a => a.id === selected.id);
              const color = LOGO_COLORS[Math.max(idx, 0) % LOGO_COLORS.length];
              const name = selected.userName || selected.applicantName || selected.user?.name || "Applicant";
              const email = selected.userEmail || selected.applicantEmail || selected.user?.email || "";
              const statusKey = (selected.status || "applied").toLowerCase().replace(" ","");
              const s = STATUS_STYLES[statusKey] || STATUS_STYLES.applied;
              return (
                <>
                  <div style={{ textAlign: "center", marginBottom: 20, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <Avatar letter={name[0]?.toUpperCase()} color={color} size={52} />
                    <div style={{ marginTop: 12 }}>
                      <div className="ac-detail-name">{name}</div>
                      <div className="ac-detail-email">{email}</div>
                      <div className="db-status-pill" style={{ background: s.bg, color: s.color, margin: "8px auto 0", display: "inline-flex" }}>{s.label}</div>
                    </div>
                  </div>

                  {selected.location && <div className="ac-info-row"><MapPin size={13} /> {selected.location}</div>}
                  {selected.experience && <div className="ac-info-row">Experience: {selected.experience}</div>}
                  {selected.createdAt && (
                    <div className="ac-info-row"><Clock size={13} /> Applied {new Date(selected.createdAt).toLocaleDateString()}</div>
                  )}

                  <div style={{ marginTop: 20 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.7px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 10 }}>Update Status</div>
                    {STATUS_OPTIONS.map(opt => {
                      const os = STATUS_STYLES[opt] || STATUS_STYLES.applied;
                      const isCurrent = statusKey === opt;
                      return (
                        <button
                          key={opt}
                          className="ac-action-btn"
                          style={{
                            background: isCurrent ? os.bg : "transparent",
                            borderColor: isCurrent ? os.color : "rgba(255,255,255,0.08)",
                            color: isCurrent ? os.color : "rgba(255,255,255,0.45)",
                          }}
                          onClick={() => !isCurrent && handleStatusChange(selected.id, opt)}
                          disabled={isCurrent || updatingId === selected.id}
                        >
                          {isCurrent && <Check size={13} />}
                          {os.label}
                        </button>
                      );
                    })}
                  </div>

                  {selected.coverLetter && (
                    <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.7px", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: 8 }}>Cover Letter</div>
                      <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{selected.coverLetter}</div>
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </SidebarLayout>

      {toast && <div className={`ac-toast ${toast.type}`}>{toast.msg}</div>}
    </>
  );
};

export default Applicants;