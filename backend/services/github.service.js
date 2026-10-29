const simpleGit = require("simple-git");
const path = require("path");
const fs = require("fs");

const cloneRepository = async (githubUrl, projectId) => {
    const projectsDir = path.join(__dirname, "../../projects");

    // Create projects directory if it doesn't exist
    if (!fs.existsSync(projectsDir)) {
        fs.mkdirSync(projectsDir, { recursive: true });
    }

    const projectPath = path.join(projectsDir, `project-${projectId}`);

    // Remove existing cloned project if it exists
    if (fs.existsSync(projectPath)) {
        fs.rmSync(projectPath, {
            recursive: true,
            force: true
        });
    }

    const git = simpleGit();

    await git.clone(githubUrl, projectPath);

    return projectPath;
};

module.exports = {
    cloneRepository
};