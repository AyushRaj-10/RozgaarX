import { db } from "../config/db.js";

export const createUserProfile = async (user) => {
    const { auth_id,phone, role , skills, resume_url} = user;
    const query = `
        INSERT INTO users (auth_id, phone, role, skills, resume_url)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const values = [auth_id, phone, role, skills, resume_url];
    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

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
    const { phone, role, skills, resume_url } = updates;
    const query = `
        UPDATE users
        SET phone = COALESCE($1, phone),
            role = COALESCE($2, role),
            skills = COALESCE($3, skills),
            resume_url = COALESCE($4, resume_url)
        WHERE auth_id = $5
        RETURNING *;
    `;
    const values = [phone, role, skills, resume_url, auth_id];
    try {
        const result = await db.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw error;
    }
}

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