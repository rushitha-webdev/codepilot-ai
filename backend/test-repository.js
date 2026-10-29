const { cloneRepository } = require("./services/github.service");
const {
    readRepositoryFiles
} = require("./services/repository.service");

const githubUrl = "https://github.com/octocat/Hello-World.git";
const projectId = 999;

const testRepository = async () => {
    try {

        // Step 1: Clone repository
        const repositoryPath = await cloneRepository(
            githubUrl,
            projectId
        );

        console.log("Repository cloned successfully!");
        console.log("Location:", repositoryPath);

        // Step 2: Read repository files
        const files = readRepositoryFiles(repositoryPath);

        console.log("Files found:", files.length);

        files.forEach((file) => {
            console.log("--------------------------------");
            console.log("File:", file.filePath);
            console.log("Type:", file.fileType);
            console.log("Content preview:");
            console.log(file.content.substring(0, 100));
        });

    } catch (error) {

        console.error("Repository processing failed:");
        console.error(error.message);

    }
};

testRepository();