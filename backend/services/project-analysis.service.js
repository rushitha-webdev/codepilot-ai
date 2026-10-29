const { cloneRepository } = require("./github.service");
const { readRepositoryFiles } = require("./repository.service");
const documentService = require("./document.service");
const db = require("../config/db");
const { analyzeProject } = require("./ai.service");


// Clone GitHub repository, read files and store them
const processGitHubProject = async (githubUrl, projectId) => {

    // 1. Clone repository
    const repositoryPath = await cloneRepository(
        githubUrl,
        projectId
    );

    console.log("Repository cloned:", repositoryPath);

    // 2. Read repository files
    const files = readRepositoryFiles(repositoryPath);

    console.log("Files found:", files.length);

    // 3. Store files in database
    const documents = [];

    for (const file of files) {

        const document = await documentService.createDocument(
            projectId,
            file.fileName,
            file.filePath,
            file.fileType,
            file.content
        );

        documents.push(document);
    }

    return {
        repositoryPath,
        filesProcessed: documents.length,
        documents
    };
};


// Get all stored code of a project
const getProjectCode = async (projectId) => {

    const [rows] = await db.execute(
        `SELECT file_name, file_path, file_type, content
         FROM documents
         WHERE project_id = ?
         ORDER BY file_path ASC`,
        [projectId]
    );

    if (rows.length === 0) {
        throw new Error("No documents found for this project");
    }

    return rows;
};


// Extract sections from Gemini's response
const extractAnalysisSections = (analysis) => {

    const sections = {
        analysis: analysis,
        technologies: null,
        architecture: null,
        issues: null,
        recommendations: null
    };

    const regex =
        /###\s*\d+\.\s*([^\n]+)\n([\s\S]*?)(?=\n###\s*\d+\.|$)/g;

    let match;

    while ((match = regex.exec(analysis)) !== null) {

        const title = match[1]
            .trim()
            .toLowerCase();

        const content = match[2].trim();

        if (title.includes("project summary")) {
            sections.analysis = analysis;
        }

        else if (title.includes("technologies")) {
            sections.technologies = content;
        }

        else if (title.includes("architecture")) {
            sections.architecture = content;
        }

        else if (title.includes("potential issues")) {
            sections.issues = content;
        }

        else if (title.includes("recommendations")) {
            sections.recommendations = content;
        }
    }

    return sections;
};


// Analyze project using Gemini and save the result
const analyzeProjectCode = async (projectId) => {

    // 1. Get project documents
    const documents = await getProjectCode(projectId);

    // 2. Combine all project files
    const projectCode = documents
        .map((document) => {

            return `
FILE: ${document.file_path}
TYPE: ${document.file_type}

CONTENT:
${document.content}
`;

        })
        .join("\n\n--------------------------------\n\n");


    console.log(
        `Sending ${documents.length} files to Gemini...`
    );


    // 3. Send project code to Gemini
    const analysis = await analyzeProject(projectCode);


    // 4. Extract individual sections
    const sections = extractAnalysisSections(analysis);


    // 5. Save analysis in database
    const [result] = await db.execute(
        `INSERT INTO project_analysis
        (
            project_id,
            summary,
            technologies,
            architecture,
            issues,
            recommendations
        )
        VALUES (?, ?, ?, ?, ?, ?)`,
        [
            projectId,
            sections.analysis,
            sections.technologies,
            sections.architecture,
            sections.issues,
            sections.recommendations
        ]
    );


    console.log(
        "Project analysis saved with ID:",
        result.insertId
    );


    // 6. Return result
    return {
        projectId,
        analysisId: result.insertId,
        filesAnalyzed: documents.length,
        analysis: sections.analysis,
        technologies: sections.technologies,
        architecture: sections.architecture,
        issues: sections.issues,
        recommendations: sections.recommendations
    };
};

// Get the latest analysis of a project
const getProjectAnalysis = async (projectId) => {

    const [rows] = await db.execute(
        `SELECT
            id,
            project_id,
            summary,
            technologies,
            architecture,
            issues,
            recommendations,
            created_at
         FROM project_analysis
         WHERE project_id = ?
         ORDER BY created_at DESC
         LIMIT 1`,
        [projectId]
    );

    return rows[0];
};

module.exports = {
    processGitHubProject,
    getProjectCode,
    analyzeProjectCode,
    getProjectAnalysis
};