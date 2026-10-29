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
    // Get the existing project first
    const existingProject = await getProjectById(projectId, userId);

    if (!existingProject) {
        throw new Error("Project not found");
    }

    // Preserve fields that were not provided
    const name = data.name !== undefined
        ? data.name.trim()
        : existingProject.name;

    const description = data.description !== undefined
        ? data.description
        : existingProject.description;

    const sourceType = existingProject.source_type;
    const sourceUrl = existingProject.source_url;

    if (!name) {
        throw new Error("Project name is required");
    }

    const [result] = await db.execute(
        `UPDATE projects
         SET name = ?, description = ?
         WHERE id = ? AND user_id = ?`,
        [name, description, projectId, userId]
    );

    if (result.affectedRows === 0) {
        throw new Error("Project not found or no changes were made");
    }

    return {
        id: existingProject.id,
        name,
        description,
        source_type: sourceType,
        source_url: sourceUrl,
        created_at: existingProject.created_at
    };
};

module.exports = {
    createProject,
    getUserProjects,
    getProjectById,
    deleteProject,
    updateProject
};