const express = require("express");
const router = express.Router();

const {
    createDocument,
    getProjectDocuments,
    getDocumentById,
    deleteDocument
} = require("../controllers/document.controller");

const { authenticateToken } = require("../middleware/auth.middleware");

// Create a document
router.post("/:projectId/documents", authenticateToken, createDocument);

// Get all documents of a project
router.get("/:projectId/documents", authenticateToken, getProjectDocuments);

// Get one document
router.get(
    "/:projectId/documents/:documentId",
    authenticateToken,
    getDocumentById
);

// Delete a document
router.delete(
    "/:projectId/documents/:documentId",
    authenticateToken,
    deleteDocument
);

module.exports = router;