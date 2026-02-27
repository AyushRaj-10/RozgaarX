import { db } from "../config/db.js";

export const createApplication = async (userId, jobId, resumeUrl) => {
  const query = `
    INSERT INTO applications (user_id, job_id, resume_url)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [userId, jobId, resumeUrl];
  const { rows } = await db.query(query, values);
  return rows[0];
};

export const getApplicationsByUserId = async (userId) => {
  const query = `
    SELECT * FROM applications
    WHERE user_id = $1;
  `;
  const values = [userId];
  const { rows } = await db.query(query, values);
  return rows;
};

export const getApplicationsByJobId = async (jobId) => {
  const query = `
    SELECT * FROM applications
    WHERE job_id = $1;
  `;
  const values = [jobId];
  const { rows } = await db.query(query, values);
  return rows;
};      

