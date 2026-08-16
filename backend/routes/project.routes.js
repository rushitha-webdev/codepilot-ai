const express = require("express");
const router = express.Router();

const {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject
} = require("../controllers/project.controller");

const { authenticateToken } = require("../middleware/auth.middleware");

// Create a project
router.post("/", authenticateToken, createProject);

// Get all projects of logged-in user
router.get("/", authenticateToken, getUserProjects);

// Get one project
router.get("/:id", authenticateToken, getProjectById);

// Update a project
router.put("/:id", authenticateToken, updateProject);

// Delete a project
router.delete("/:id", authenticateToken, deleteProject);

module.exports = router;