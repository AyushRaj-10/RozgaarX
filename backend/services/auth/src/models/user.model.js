import { db } from "../config/db.js";

export const createUser = async(username, email , password) => {
    const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
    return await db.query(query, [username, email, password]);
}

export const getUserByEmail = async(email) => {
    const query = `
    SELECT * FROM users
    WHERE email = $1
    `;
    return await db.query(query, [email]);
}