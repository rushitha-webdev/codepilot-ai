const {
    processGitHubProject
} = require("./services/project-analysis.service");

const githubUrl = "https://github.com/octocat/Hello-World.git";
const projectId = 5;

const test = async () => {
    try {
        const result = await processGitHubProject(
            githubUrl,
            projectId
        );

        console.log("================================");
        console.log("Project processed successfully!");
        console.log("Repository:", result.repositoryPath);
        console.log("Files processed:", result.filesProcessed);
        console.log("================================");

    } catch (error) {
        console.error("Project processing failed:");
        console.error(error.message);
    }
};

test();