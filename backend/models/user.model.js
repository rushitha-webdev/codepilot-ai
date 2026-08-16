const db = require("../config/db");

// Create a new user
const createUser = (name, email, password) => {
    const sql = `
        INSERT INTO users (name, email, password)
        VALUES (?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [name, email, password], (err, result) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(result);
        });
    });
};

// Find a user by email
const findUserByEmail = (email) => {
    const sql = `
        SELECT *
        FROM users
        WHERE email = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [email], (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(results[0]);
        });
    });
};

// Find a user by ID
const findUserById = (id) => {
    const sql = `
        SELECT id, name, email, created_at
        FROM users
        WHERE id = ?
    `;

    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, results) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(results[0]);
        });
    });
};

module.exports = {
    createUser,
    findUserByEmail,
    findUserById
};