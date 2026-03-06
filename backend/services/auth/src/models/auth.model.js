import { db } from "../config/db.js";

export const createUser = async(username, email , password , role) => {
    const query = `
    INSERT INTO auth (username, email, password , role)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `;
    return await db.query(query, [username, email, password, role]);
}

export const getUserByEmail = async(email) => {
    const query = `
    SELECT * FROM auth
    WHERE email = $1
    `;
    return await db.query(query, [email]);
}