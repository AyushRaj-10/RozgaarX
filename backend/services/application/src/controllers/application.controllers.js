import { createApplication, getApplicationsByUserId , getApplicationsByJobId, updateApplication } from "../models/application.models.js";

import { producer } from "../kafka/producers.js";
import { TOPICS } from "../kafka/topics.js";
import redisClient from "../../../jobs/src/config/redis.js";
import logger from "../utils/logger.js";


export const applyForJob = async (req, res) => {
  try {

    const userId = req.user.id;   
    const { jobId, resumeUrl } = req.body;

    const application = await createApplication(userId, jobId, resumeUrl);

    await producer.send({
      topic: TOPICS.APPLICATION_CREATED,
      messages: [
        {
          value: JSON.stringify({
            applicationId: application.id,
            userId,
            jobId,
            resumeUrl
          }),
        },
      ],
    });

    res.status(201).json(application);

  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getApplications = async (req, res) => {
  try {
    const { userId, jobId } = req.query;

    if (!userId && !jobId) {
      return res.status(400).json({
        error: "Please provide either userId or jobId as a query parameter",
      });
    }

    const cacheKey = userId
      ? `applications:user:${userId}`
      : `applications:job:${jobId}`;

    const cached = await redisClient.get(cacheKey);

    if (cached) {
      logger.info("Cache hit");
      return res.json(JSON.parse(cached));
    }

    logger.info("Cache Miss");

    let applications;

    if (userId) {
      applications = await getApplicationsByUserId(userId);
    } else {
      applications = await getApplicationsByJobId(jobId);
    }

    await redisClient.set(cacheKey, JSON.stringify(applications), {
      EX: 60 * 10, 
    });

    return res.status(200).json(applications);

  } catch (error) {
    console.error("Error fetching applications:", error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getApplicationsForJob = async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const applications = await getApplicationsByJobId(jobId);
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications for job:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const getApplicationsForUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const applications = await getApplicationsByUserId(userId);
    res.status(200).json(applications);
  } catch (error) {
    console.error("Error fetching applications for user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export const updateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.applicationId;
    const { status } = req.body;

    const updatedApplication = await updateApplication(applicationId, status);

    res.status(200).json(updatedApplication);
  } catch (error) {
    console.error("Error updating application status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}