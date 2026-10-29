const projectService = require("../services/project.service");
const projectAnalysisService = require("../services/project-analysis.service");

const {
    analyzeProjectCode
} = require("../services/project-analysis.service");

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

        // If this is a GitHub project, process the repository
        if (sourceType === "github" && sourceUrl) {

            console.log(
                `Starting GitHub processing for project ${project.id}...`
            );

            await projectAnalysisService.processGitHubProject(
                sourceUrl,
                project.id
            );

            console.log(
                `GitHub processing completed for project ${project.id}`
            );
        }

        res.status(201).json({
            message: "Project created successfully",
            project
        });

    } catch (error) {
        console.error("Create project error:", error);

        res.status(500).json({
            message: "Failed to create project",
            error: error.message
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


// Update a project

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
        console.error("Update project error:", error);

        const status = error.message === "Project not found"
            ? 404
            : 400;

        res.status(status).json({
            message: error.message || "Failed to update project"
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


// Process GitHub repository
const processGitHubProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.userId;

        console.log(`Processing GitHub project ${projectId}...`);

        // Check that the project belongs to the logged-in user
        const project = await projectService.getProjectById(
            projectId,
            userId
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Make sure this is a GitHub project
        if (project.source_type !== "github") {
            return res.status(400).json({
                message: "This project is not a GitHub project"
            });
        }

        // Make sure a GitHub URL exists
        if (!project.source_url) {
            return res.status(400).json({
                message: "GitHub repository URL is missing"
            });
        }

        // Clone repository, read files and store documents
        const result =
            await projectAnalysisService.processGitHubProject(
                project.source_url,
                projectId
            );

        console.log(
            `GitHub project ${projectId} processed successfully`
        );

        res.status(200).json({
            message: "GitHub project processed successfully",
            result
        });

    } catch (error) {
        console.error(
            "Process GitHub project error:",
            error
        );

        res.status(500).json({
            message: "Failed to process GitHub project",
            error: error.message
        });
    }
};


// Analyze a project using Gemini AI
const analyzeProject = async (req, res) => {
    try {
        const projectId = req.params.id;
        const userId = req.user.userId;

        // Check that the project belongs to the logged-in user
        const project = await projectService.getProjectById(
            projectId,
            userId
        );

        if (!project) {
            return res.status(404).json({
                message: "Project not found"
            });
        }

        // Analyze the project's stored documents
        const result = await analyzeProjectCode(projectId);

        res.status(200).json({
            message: "Project analyzed successfully",
            result
        });

    } catch (error) {
        console.error("Project analysis error:", error);

        res.status(500).json({
            message: error.message,
            error: error.stack
        });
    }
};


// Get latest project analysis
const getProjectAnalysis = async (req, res) => {
    try {
        const projectId = req.params.id;

        const analysis =
            await projectAnalysisService.getProjectAnalysis(
                projectId
            );

        if (!analysis) {
            return res.status(404).json({
                message: "Project analysis not found"
            });
        }

        res.status(200).json({
            message: "Project analysis fetched successfully",
            analysis
        });

    } catch (error) {
        console.error(
            "Get project analysis error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch project analysis"
        });
    }
};


module.exports = {
    createProject,
    getUserProjects,
    getProjectById,
    updateProject,
    deleteProject,
    processGitHubProject,
    analyzeProject,
    getProjectAnalysis
};