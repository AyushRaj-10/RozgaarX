import {
  getAllJobs,
  createJob,
  updateJob,
  getJobById,
  deleteJob,
  searchJobs,
} from "../models/jobs.models.js";
import redisClient from "../config/redis.js";
import { producer } from "../kafka/producers.js";
import { TOPICS } from "../kafka/topics.js";
import logger from "../utils/logger.js";

export const getJobs = async (req, res) => {
  try {
    const { page = 1 } = req.query;

    const limit = 10;
    const pageNumber = parseInt(page) || 1;
    const offset = (pageNumber - 1) * limit;

    if (pageNumber < 1) {
      return res.status(400).json({ error: "Invalid page number" });
    }

    const cacheKey = `jobs:page:${pageNumber}:limit:${limit}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      logger.info("Cache hit");
      return res.json(JSON.parse(cached));
    }

    logger.info("Cache Miss");

    const jobs = await getAllJobs(limit, offset);

    const response = {
      data: jobs,
      page: pageNumber,
    };

    await redisClient.set(cacheKey, JSON.stringify(response), {
      EX: 60 * 5,
    });

    res.json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

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
      skills,
    } = req.body;

    const created_by = req.user.id;

    await producer.send({
      topic: TOPICS.JOB_CREATED,
      messages: [
        {
          value: JSON.stringify({
            title,
            description,
            company,
            location,
            salary_min,
            salary_max,
            job_type,
            experience_level,
            skills,
            created_by,
          }),
        },
      ],
    });

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
      created_by,
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
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateJobHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      company,
      location,
      salary_min,
      salary_max,
      job_type,
      experience_level,
      skills,
    } = req.body;
    const updatedJob = await updateJob(
      id,
      title,
      description,
      company,
      location,
      salary_min,
      salary_max,
      job_type,
      experience_level,
      skills,
    );
    if (!updatedJob) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(updatedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJobHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedJob = await deleteJob(id);
    if (!deletedJob) {
      return res.status(404).json({ error: "Job not found" });
    }
    res.json(deletedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const searchJobsController = async (req, res) => {
  try {
    const { keyword, page = 1 } = req.query;

    const cacheKey = `search:${keyword}:${page}`;
    const cached = await redisClient.get(cacheKey);

    if (cached) {
      logger.info("Cache hit");
      return res.json(JSON.parse(cached));
    }

    logger.info("Cache Miss");

    const jobs = await searchJobs(keyword);

    await redisClient.set(cacheKey, JSON.stringify(jobs), {
      EX: 60 * 3,
    });

    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
