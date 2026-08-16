const db = require("../config/db");

// Create a new project
const createProject = async (
    userId,
    name,
    description,
    sourceType,
    sourceUrl
) => {
    const [result] = await db.execute(
        `INSERT INTO projects
        (user_id, name, description, source_type, source_url)
        VALUES (?, ?, ?, ?, ?)`,
        [userId, name, description, sourceType, sourceUrl]
    );

    return {
        id: result.insertId,
        userId,
        name,
        description,
        sourceType,
        sourceUrl
    };
};


// Get all projects belonging to a user
const getUserProjects = async (userId) => {
    const [rows] = await db.execute(
        `SELECT id, name, description, source_type, source_url, created_at
         FROM projects
         WHERE user_id = ?
         ORDER BY created_at DESC`,
        [userId]
    );

    return rows;
};


// Get one project belonging to a user
const getProjectById = async (projectId, userId) => {
    const [rows] = await db.execute(
        `SELECT id, name, description, source_type, source_url, created_at
         FROM projects
         WHERE id = ? AND user_id = ?`,
        [projectId, userId]
    );

    return rows[0];
};


// Delete a project belonging to a user
const deleteProject = async (projectId, userId) => {
    const [result] = await db.execute(
        `DELETE FROM projects
         WHERE id = ? AND user_id = ?`,
        [projectId, userId]
    );

    return result.affectedRows > 0;
};

// Update a project belonging to a user
const updateProject = async (projectId, userId, data) => {
    const { name, description, sourceType, sourceUrl } = data;

    const [result] = await db.execute(
        `UPDATE projects
         SET name = ?, description = ?, source_type = ?, source_url = ?
         WHERE id = ? AND user_id = ?`,
        [name, description, sourceType, sourceUrl, projectId, userId]
    );

    if (result.affectedRows === 0) {
        throw new Error("Project not found");
    }

    return {
        id: projectId,
        userId,
        name,
        description,
        sourceType,
        sourceUrl
    };
};


module.exports = {
    createProject,
    getUserProjects,
    getProjectById,
    deleteProject,
    updateProject
};