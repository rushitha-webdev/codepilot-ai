const {
    analyzeProjectCode
} = require("./services/project-analysis.service");

const projectId = 5;

const test = async () => {

    try {

        const result = await analyzeProjectCode(projectId);

        console.log("\n========== PROJECT ANALYSIS ==========\n");

        console.log("Project ID:", result.projectId);
        console.log("Files analyzed:", result.filesAnalyzed);

        console.log("\n---------- GEMINI RESULT ----------\n");

        console.log(result.analysis);

        console.log("\n====================================");
        console.log("Project analysis successful!");

    } catch (error) {

        console.error("Project analysis failed:");
        console.error(error.message);

    }
};

test();