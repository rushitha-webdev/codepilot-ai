const projectService = require("../services/project.service");

// Create a project
const createProject = async (req, res) => {
    try {
        const { name, description, sourceType, sourceUrl } = req.body;

        if (!name || !sourceType) {
            return res.status(400).json({
                message: "Project name and source type are required"
            });
        }

        if (!["upload", "github"].includes(sourceType)) {
            return res.status(400).json({
                message: "Source type must be upload or github"
            });
        }

        const project = await projectService.createProject(
            req.user.userId,
            name,
            description || null,
            sourceType,
            sourceUrl || null
        );

        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error("Create project error:", error);

        res.status(500).json({
            message: "Failed to create project"
        });
    }
};


// Get all projects of logged-in user
const getUserProjects = async (req, res) => {
    try {
        const projects = await projectService.getUserProjects(
            req.user.userId
        );

        res.status(200).json({
            projects
        });

    } catch (error) {
        console.error("Get projects error:", error);

        res.status(500).json({
            message: "Failed to fetch projects"
        });
    }
};


// Get one project
const getProjectById = async (req, res) => {
    try {
        const project = await projectService.getProjectById(
            req.params.id,
            req.user.userId
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            project
        });

    } catch (error) {
        console.error("Get project error:", error);

        res.status(500).json({
            message: "Failed to fetch project"
        });
    }
};


// Delete a project
const deleteProject = async (req, res) => {
    try {
        const deleted = await projectService.deleteProject(
            req.params.id,
            req.user.userId
        );

        if (!deleted) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        res.status(200).json({
            message: "Project deleted successfully"
        });

    } catch (error) {
        console.error("Delete project error:", error);

        res.status(500).json({
            message: "Failed to delete project"
        });
    }
};
//Update a project
const updateProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.userId;

        const project = await projectService.updateProject(
            projectId,
            userId,
            req.body
        );

        res.status(200).json({
            message: "Project updated successfully",
            project
        });
    } catch (error) {
        res.status(404).json({
            message: error.message
        });
    }
};

module.exports = {
    createProject,
    getUserProjects,
    getProjectById,
    deleteProject,
    updateProject
};