const { cloneRepository } = require("./services/github.service");

const githubUrl = "https://github.com/octocat/Hello-World.git";
const projectId = 999;

cloneRepository(githubUrl, projectId)
    .then((path) => {
        console.log("Repository cloned successfully!");
        console.log("Location:", path);
    })
    .catch((error) => {
        console.error("Repository cloning failed:");
        console.error(error.message);
    });