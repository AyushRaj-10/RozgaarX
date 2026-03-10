import { getAllJobs, createJob, updateJob , getJobById , deleteJob , searchJobs} from "../models/jobs.models.js";
import redisClient from "../config/redis.js";

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

        const {
            title,
            description,
            company,
            location,
            salary_min,
            salary_max,
            job_type,
            experience_level,
            skills
        } = req.body;

        const created_by = req.user.id; 

        const newJob = await createJob(
            title,
            description,
            company,
            location,
            salary_min,
            salary_max,
            job_type,
            experience_level,
            skills,
            created_by
        );

        res.status(201).json(newJob);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

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

export const searchJobsController = async (req, res) => {
    try {

        const { keyword, page = 1 } = req.query;

        const cacheKey = `search:${keyword}:${page}`;
        const cached = await redisClient.get(cacheKey);

        if(cached){
            console.log("Cache hit");
            return res.json(JSON.parse(cached));
        }

        console.log("Cache Miss")

        const limit = 10;
        const offset = (page - 1) * limit;

        const jobs = await searchJobs(keyword, limit, offset);

        await redisClient.set(cacheKey, JSON.stringify(jobs), {
            EX: 60
        });

        res.status(200).json(jobs);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};