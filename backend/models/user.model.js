const db = require("../config/db");

// Create a new user
const createUser = async (name, email, password) => {
    const sql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;

    const [result] = await db.execute(
        sql,
        [name, email, password]
    );

    return result;
};


// Find a user by email
const findUserByEmail = async (email) => {
    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    const [results] = await db.execute(
        sql,
        [email]
    );

    return results[0];
};


// Find a user by ID
const findUserById = async (id) => {
    const sql = `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
    `;

    const [results] = await db.execute(
        sql,
        [id]
    );

    return results[0];
};


module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};