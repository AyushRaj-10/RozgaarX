import { db } from "../config/db.js";

export const createUserProfile = async (user) => {
    const {
        auth_id,
        phone,
        role,
        skills,
        resume_url,
        experience_years,
        current_company,
        bio,
        location,
        work_type,
        salary_min,
        salary_max,
        open_to_roles,
        notice_period,
        linkedin,
        portfolio
    } = user;

    const query = `
        INSERT INTO users (
            auth_id,
            phone,
            role,
            skills,
            resume_url,
            experience_years,
            current_company,
            bio,
            location,
            work_type,
            salary_min,
            salary_max,
            open_to_roles,
            notice_period,
            linkedin,
            portfolio
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16
        )
        RETURNING *;
    `;

    const values = [
        auth_id,
        phone,
        role,
        skills,           // TEXT[]
        resume_url,
        experience_years, // VARCHAR
        current_company,
        bio,
        location,
        work_type,
        salary_min,
        salary_max,
        open_to_roles,    // TEXT[]
        notice_period,
        linkedin,
        portfolio
    ];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const getUserProfileByAuthId = async (auth_id) => {
    const query = `
        SELECT * FROM users WHERE auth_id = $1;
    `;
    try {
        const result = await db.query(query, [auth_id]);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

export const updateUserProfile = async (auth_id, updates) => {
    const {
        phone,
        role,
        skills,
        resume_url,
        experience_years,
        current_company,
        bio,
        location,
        work_type,
        salary_min,
        salary_max,
        open_to_roles,
        notice_period,
        linkedin,
        portfolio
    } = updates;

    const query = `
        UPDATE users
        SET 
            phone = COALESCE($1, phone),
            role = COALESCE($2, role),
            skills = COALESCE($3, skills),
            resume_url = COALESCE($4, resume_url),
            experience_years = COALESCE($5, experience_years),
            current_company = COALESCE($6, current_company),
            bio = COALESCE($7, bio),
            location = COALESCE($8, location),
            work_type = COALESCE($9, work_type),
            salary_min = COALESCE($10, salary_min),
            salary_max = COALESCE($11, salary_max),
            open_to_roles = COALESCE($12, open_to_roles),
            notice_period = COALESCE($13, notice_period),
            linkedin = COALESCE($14, linkedin),
            portfolio = COALESCE($15, portfolio),
            updated_at = NOW()
        WHERE auth_id = $16
        RETURNING *;
    `;

    const values = [
        phone ?? null,
        role ?? null,
        skills ?? null,          // TEXT[]
        resume_url ?? null,
        experience_years ?? null,
        current_company ?? null,
        bio ?? null,
        location ?? null,
        work_type ?? null,
        salary_min ?? null,
        salary_max ?? null,
        open_to_roles ?? null,   
        notice_period ?? null,
        linkedin ?? null,
        portfolio ?? null,
        auth_id
    ];

    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
};

export const deleteUserProfile = async (auth_id) => {
    const query = `
        DELETE FROM users WHERE auth_id = $1;
    `;
    try {
        const result = await db.query(query, [auth_id]);
        return result.rows[0];
    } catch (error) {
        throw error;    
    }
};