import { getAllJobs, createJob, updateJob , getJobById , deleteJob } from "../models/jobs.models.js";

export const getJobs = async (req, res) => {
    try {
        const jobs = await getAllJobs();
        res.json(jobs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const createJobHandler = async (req, res) => {
    try { 
        const { title, description, company, location, salary_min, salary_max, job_type, experience_level, skills, created_by } = req.body;
        const newJob = await createJob(title, description, company, location, salary_min, salary_max, job_type, experience_level, skills, created_by);
        res.status(201).json(newJob);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getJobHandler = async (req, res) => {  
    try {
        const { id } = req.params;
        const job = await getJobById(id);
        if (!job) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.json(job);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const updateJobHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, company, location, salary_min, salary_max, job_type, experience_level, skills } = req.body;
        const updatedJob = await updateJob(id, title, description, company, location, salary_min, salary_max, job_type, experience_level, skills);
        if (!updatedJob) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.json(updatedJob);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const deleteJobHandler = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedJob = await deleteJob(id);
        if (!deletedJob) {
            return res.status(404).json({ error: "Job not found" });
        }
        res.json(deletedJob);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
}