import { db } from "../config/db.js";

export const getAllJobs = async () => {
  const query = "SELECT * FROM jobs";
  const { rows } = await db.query(query);
  return rows;
};

export const createJob = async (title, description, company, location, salary_min, salary_max, job_type, experience_level, skills, created_by) => {
  const query = `
    INSERT INTO jobs (
      title, description, company, location, salary_min, salary_max, job_type, experience_level, skills, created_by
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;
  `;
  const values = [
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
  ];
  const { rows } = await db.query(query, values);
  return rows[0];
};

export const getJobById = async (id) => {       
    const query = "SELECT * FROM jobs WHERE id = $1";   
    const values = [id];
    const { rows } = await db.query(query, values);
    return rows[0];
}

export const updateJob = async (id, title, description, company, location, salary_min, salary_max, job_type, experience_level, skills) => {  
    const query = `
    UPDATE jobs SET title = $1, description = $2, company = $3, location = $4, salary_min = $5, salary_max = $6, job_type = $7, experience_level = $8, skills = $9
    WHERE id = $10
    RETURNING *;
    `;
    const values = [
        title,
        description, 
        company, 
        location, 
        salary_min, 
        salary_max, 
        job_type, 
        experience_level, 
        skills, 
        id
    ];
    const { rows } = await db.query(query, values);
    return rows[0];
}

export const deleteJob = async (id) => {
    const query = "DELETE FROM jobs WHERE id = $1";
    const values = [id];
    await db.query(query, values);
}