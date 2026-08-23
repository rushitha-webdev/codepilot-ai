const db = require("../config/db");

// Store a document belonging to a project
const createDocument = async (
    projectId,
    fileName,
    filePath,
    fileType,
    content
) => {
    const [result] = await db.execute(
        `INSERT INTO documents
        (project_id, file_name, file_path, file_type, content)
        VALUES (?, ?, ?, ?, ?)`,
        [projectId, fileName, filePath, fileType, content]
    );

    return {
        id: result.insertId,
        projectId,
        fileName,
        filePath,
        fileType,
        content
    };
};


// Get all documents belonging to a project
const getProjectDocuments = async (projectId) => {
    const [rows] = await db.execute(
        `SELECT id, project_id, file_name, file_path, file_type, created_at
         FROM documents
         WHERE project_id = ?
         ORDER BY file_path ASC`,
        [projectId]
    );

    return rows;
};


// Get one document belonging to a project
const getDocumentById = async (documentId, projectId) => {
    const [rows] = await db.execute(
        `SELECT id, project_id, file_name, file_path, file_type, content, created_at
         FROM documents
         WHERE id = ? AND project_id = ?`,
        [documentId, projectId]
    );

    return rows[0];
};


// Delete a document
const deleteDocument = async (documentId, projectId) => {
    const [result] = await db.execute(
        `DELETE FROM documents
         WHERE id = ? AND project_id = ?`,
        [documentId, projectId]
    );

    return result.affectedRows > 0;
};


module.exports = {
    createDocument,
    getProjectDocuments,
    getDocumentById,
    deleteDocument
};