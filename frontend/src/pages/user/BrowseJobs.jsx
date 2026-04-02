import React, { useState, useContext, useEffect, useRef } from "react";
import AuthContext from "../../context/AuthContext.jsx";
import { JobContext } from "../../context/JobContext.jsx";
import { ApplicationContext } from "../../context/ApplicationContext.jsx";
import { Search, MapPin, Building2, Briefcase, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";

const extractList = (res) => {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.data)) return res.data;
  return [];
};

const BrowseJobs = () => {
  const { token } = useContext(AuthContext);
  const { getJobs, getJobByKeyword } = useContext(JobContext);
  const { applyToJob, getApplicationsByUserId } = useContext(ApplicationContext);

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [applying, setApplying] = useState(false);

  const searchTimeout = useRef(null);
  const didFetch = useRef(false);
  const userId = localStorage.getItem("authId");

  const fetchJobs = async (p, kw) => {
    setLoading(true);
    try {
      let data;
      if (kw && kw.trim()) {
        data = await getJobByKeyword(kw.trim());
      } else {
        data = await getJobs(p);
      }
      const list = extractList(data);
      if (p === 1) setJobs(list);
      else setJobs(prev => [...prev, ...list]);
      if (list.length > 0 && !selectedJob) setSelectedJob(list[0]);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const apps = await getApplicationsByUserId(userId);
      if (Array.isArray(apps)) {
        setAppliedJobs(new Set(apps.map(a => String(a.jobId))));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (didFetch.current) return;
    didFetch.current = true;
    fetchJobs(1, "");
    if (userId) fetchAppliedJobs();
  }, []);

  const handleSearch = (val) => {
    setSearch(val);
    clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchJobs(1, val);
    }, 500);
  };

  const handleApply = async (job) => {
    if (!userId || !token) {
      alert("Please login first");
      return;
    }
    if (appliedJobs.has(String(job.id))) return;
    setApplying(true);
    try {
      const payload = { jobId: job.id, userId, jobTitle: job.title, companyName: job.company, status: "applied" };
      const res = await applyToJob(payload);
      if (res) {
        setAppliedJobs(prev => new Set([...prev, String(job.id)]));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setApplying(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchJobs(nextPage, search);
  };

  return (
    <div className="min-h-screen bg-[#020d1a] text-white font-['DM_Sans'] relative overflow-hidden">
      {/* Background Orbs (Matching Login) */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#00e896]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'linear-gradient(#00e896 1px, transparent 1px), linear-gradient(90deg, #00e896 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 relative z-10 h-screen flex flex-col">
        
        {/* Header Area */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold font-['Syne'] text-[#00e896]">Explore Opportunities</h1>
          <p className="text-gray-400 text-sm mt-1">Find your next career move at RozgaarX</p>
        </div>

        <div className="flex gap-6 flex-1 overflow-hidden mb-4">
          
          {/* LEFT SIDE: JOB LIST */}
          <div className="w-full md:w-[400px] flex flex-col gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#00e896] transition-colors" />
              <input
                placeholder="Search job titles..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-[#00e896]/50 focus:ring-1 focus:ring-[#00e896]/50 transition-all placeholder:text-gray-600"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {loading && jobs.length === 0 ? (
                [1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 animate-pulse rounded-xl" />)
              ) : (
                jobs.map(job => (
                  <div
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border ${
                      selectedJob?.id === job.id 
                      ? "bg-[#00e896]/10 border-[#00e896]/40 shadow-[0_0_20px_rgba(0,232,150,0.05)]" 
                      : "bg-white/5 border-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                    }`}
                  >
                    <h4 className={`font-bold truncate ${selectedJob?.id === job.id ? "text-[#00e896]" : "text-white"}`}>
                      {job.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                      <Building2 size={14} className="text-[#00e896]/60" /> {job.company}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <MapPin size={14} /> {job.location}
                    </div>
                  </div>
                ))
              )}

              {jobs.length > 0 && (
                <button 
                  onClick={loadMore}
                  className="w-full py-3 text-sm font-semibold text-gray-400 hover:text-white transition-colors"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Load More Jobs"}
                </button>
              )}
            </div>
          </div>

          {/* RIGHT SIDE: JOB DETAILS */}
          <div className="hidden md:flex flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md flex-col">
            {!selectedJob ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-50">
                <Briefcase size={48} strokeWidth={1} />
                <p className="mt-4 font-medium">Select a job to view full details</p>
              </div>
            ) : (
              <>
                {/* Detail Header */}
                <div className="p-8 border-b border-white/10 bg-gradient-to-br from-white/[0.02] to-transparent">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h2 className="text-3xl font-bold font-['Syne'] leading-tight mb-2">{selectedJob.title}</h2>
                      <div className="flex flex-wrap gap-4 items-center">
                        <span className="flex items-center gap-1.5 text-[#00e896] font-medium">
                          <Building2 size={16} /> {selectedJob.company}
                        </span>
                        <span className="flex items-center gap-1.5 text-gray-400">
                          <MapPin size={16} /> {selectedJob.location}
                        </span>
                      </div>
                    </div>
                    
                    {appliedJobs.has(String(selectedJob.id)) ? (
                      <div className="flex items-center gap-2 bg-[#00e896]/10 text-[#00e896] px-6 py-3 rounded-xl border border-[#00e896]/30 font-bold">
                        <CheckCircle2 size={18} /> Applied
                      </div>
                    ) : (
                      <button 
                        onClick={() => handleApply(selectedJob)}
                        disabled={applying}
                        className="bg-[#00e896] hover:bg-[#00ffa3] text-[#020d1a] px-8 py-3 rounded-xl font-bold transition-all shadow-[0_4px_20px_rgba(0,232,150,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                      >
                        {applying ? "Processing..." : "Apply Now"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Detail Body */}
                <div className="p-8 overflow-y-auto flex-1 custom-scrollbar">
                  <div className="max-w-2xl">
                    <h3 className="text-lg font-bold font-['Syne'] mb-4 flex items-center gap-2 text-white/90">
                      Description
                      <div className="h-px flex-1 bg-white/10 ml-2" />
                    </h3>
                    <div className="text-gray-400 leading-relaxed space-y-4 whitespace-pre-line">
                      {selectedJob.description}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,232,150,0.3); }
      `}</style>
    </div>
  );
};

export default BrowseJobs;