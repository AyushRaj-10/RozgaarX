import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext.jsx";
import { JobContext } from "../../context/JobContext.jsx";
import { Plus, X, CheckCircle } from "lucide-react";
import { SidebarLayout, SHARED_STYLES } from "../user/Dashboard.jsx";

const FIELD_STYLES = `
  .pj-form { max-width: 700px; }
  .pj-section { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; margin-bottom: 20px; }
  .pj-section-title { font-family: 'Syne',sans-serif; font-size: 15px; font-weight: 700; color: #fff; margin-bottom: 18px; }
  .pj-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .pj-field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; }
  .pj-label { font-size: 11.5px; font-weight: 600; color: rgba(255,255,255,0.35); text-transform: uppercase; }
  .pj-input { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 11px 14px; color: #fff; font-size: 13.5px; outline: none; width: 100%; }
  .pj-input:focus { border-color: rgba(0,232,150,0.4); }
  .pj-textarea { resize: vertical; min-height: 100px; }
  .pj-skill-row { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
  .pj-skill-chip { display: flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 20px; background: rgba(79,158,255,0.1); border: 1px solid rgba(79,158,255,0.2); color: #4f9eff; font-size: 12px; }
  .pj-skill-add { display: flex; gap: 8px; }
  .pj-add-btn { padding: 11px 18px; border-radius: 10px; background: rgba(0,232,150,0.1); border: 1px solid rgba(0,232,150,0.2); color: #00e896; cursor: pointer; }
  .pj-submit { width: 100%; padding: 14px; border-radius: 12px; background: #00e896; color: #020d1a; border: none; font-weight: 700; cursor: pointer; }
  .pj-success { display: flex; flex-direction: column; align-items: center; padding: 60px 20px; gap: 16px; }
`;

const INITIAL = {
  title: "",
  company: "",
  location: "",
  salary_min: "",
  salary_max: "",
  type: "Full-time",
  experience: "",
  description: "",
  requirements: "",
  benefits: "",
};

const PostJob = () => {
  const { user } = useContext(AuthContext);
  const { createJob } = useContext(JobContext);

  const [form, setForm] = useState(INITIAL);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(s => [...s, trimmed]);
    }
    setSkillInput("");
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = "Job title required";
    if (!form.company.trim()) errs.company = "Company required";
    if (!form.location.trim()) errs.location = "Location required";
    if (!form.description.trim()) errs.description = "Description required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

const handleSubmit = async () => {
  if (!validate()) return;

  setLoading(true);

  try {
    const [minSalary, maxSalary] = form.salary
      ? form.salary.replace(/[^\d-]/g, "").split("-")
      : ["", ""];

    const payload = {
      title: form.title,
      description: form.description,
      company: form.company,
      location: form.location,

      salary_min: minSalary || null,
      salary_max: maxSalary || null,

      job_type: form.type,
      experience_level: form.experience,

      skills: skills, // send as ARRAY (not string)
    };

    const res = await createJob(payload);

    if (res) {
      setSuccess(true);
      setForm(INITIAL);
      setSkills([]);
      setErrors({});
    } else {
      setErrors({ submit: "Failed to post job" });
    }
  } catch (err) {
    console.error(err);
    setErrors({ submit: "Something went wrong" });
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <style>{SHARED_STYLES + FIELD_STYLES}</style>
      <SidebarLayout activeNav="post" onNav={() => {}}>
        <div className="db-topbar">
          <div className="db-topbar-hi">Post a New Job</div>
        </div>

        {success ? (
          <div className="pj-success">
            <CheckCircle size={50} color="#00e896" />
            <h2>Job Posted Successfully 🎉</h2>
          </div>
        ) : (
          <div className="pj-form">

            {/* BASIC */}
            <div className="pj-section">
              <div className="pj-section-title">Basic Info</div>

              <div className="pj-field">
                <input className="pj-input" placeholder="Job Title"
                  value={form.title} onChange={e => set("title", e.target.value)} />
              </div>

              <div className="pj-field">
                <input className="pj-input" placeholder="Company"
                  value={form.company} onChange={e => set("company", e.target.value)} />
              </div>

              <div className="pj-field">
                <input className="pj-input" placeholder="Location"
                  value={form.location} onChange={e => set("location", e.target.value)} />
              </div>

              <div className="pj-grid">
                <input className="pj-input" placeholder="Min Salary"
                  value={form.salary_min} onChange={e => set("salary_min", e.target.value)} />

                <input className="pj-input" placeholder="Max Salary"
                  value={form.salary_max} onChange={e => set("salary_max", e.target.value)} />
              </div>

              <input className="pj-input" placeholder="Experience"
                value={form.experience} onChange={e => set("experience", e.target.value)} />
            </div>

            {/* SKILLS */}
            <div className="pj-section">
              <div className="pj-section-title">Skills</div>

              <div className="pj-skill-add">
                <input
                  className="pj-input"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addSkill();
                    }
                  }}
                />
                <button className="pj-add-btn" onClick={addSkill}>Add</button>
              </div>

              <div className="pj-skill-row">
                {skills.map(s => (
                  <div key={s} className="pj-skill-chip">
                    {s}
                    <X size={12} onClick={() => setSkills(sk => sk.filter(x => x !== s))} />
                  </div>
                ))}
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="pj-section">
              <textarea className="pj-input pj-textarea"
                placeholder="Job Description"
                value={form.description}
                onChange={e => set("description", e.target.value)}
              />
            </div>

            {errors.submit && <div style={{ color: "red" }}>{errors.submit}</div>}

            <button className="pj-submit" onClick={handleSubmit} disabled={loading}>
              {loading ? "Posting..." : "Post Job"}
            </button>
          </div>
        )}
      </SidebarLayout>
    </>
  );
};

export default PostJob;