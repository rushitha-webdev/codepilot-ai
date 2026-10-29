const express = require("express");

const router = express.Router();

const {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    processGitHubProject,
    analyzeProject,
    getProjectAnalysis
} = require("../controllers/project.controller");

const {
    authenticateToken
} = require("../middleware/auth.middleware");


// Create a project
router.post(
    "/",
    authenticateToken,
    createProject
);


// Get all projects of logged-in user
router.get(
    "/",
    authenticateToken,
    getUserProjects
);


// Process GitHub repository
router.post(
    "/:id/process",
    authenticateToken,
    processGitHubProject
);


// Analyze a project using Gemini AI
router.post(
    "/:id/analyze",
    authenticateToken,
    analyzeProject
);


// Get latest analysis of a project
router.get(
    "/:id/analysis",
    authenticateToken,
    getProjectAnalysis
);


// Get one project
router.get(
    "/:id",
    authenticateToken,
    getProjectById
);


// Update a project
router.put(
    "/:id",
    authenticateToken,
    updateProject
);


// Delete a project
router.delete(
    "/:id",
    authenticateToken,
    deleteProject
);


module.exports = router;