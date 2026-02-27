import { createApplication, getApplicationsByUserId , getApplicationsByJobId } from "../models/application.models.js";

export const applyForJob = async (req, res) => {
  try {

    const userId = req.user.id;   
    const { jobId, resumeUrl } = req.body;

    const application = await createApplication(userId, jobId, resumeUrl);

    res.status(201).json(application);

  } catch (error) {
    console.error("Error applying for job:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getApplications = async (req, res) => {    
    try {
      const { userId, jobId } = req.query;
        let applications;   
        if (userId) {
          applications = await getApplicationsByUserId(userId);
        } else if (jobId) {
          applications = await getApplicationsByJobId(jobId);
        } else {
          return res.status(400).json({ error: "Please provide either userId or jobId as a query parameter" });
        }
        res.status(200).json(applications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      res.status(500).json({ error: "Internal server error" });
    }
}