const { GoogleGenAI } = require("@google/genai");

const db = require("../config/db");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
        timeout: 60000
    }
});


// Wait before retrying
const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};


// Generate Gemini response with retry support
const generateWithRetry = async (contents, maxRetries = 3) => {

    for (let attempt = 1; attempt <= maxRetries; attempt++) {

        try {

            console.log(
                `Gemini request attempt ${attempt}/${maxRetries}...`
            );

            const response = await ai.models.generateContent({
                model: "gemini-3.6-flash",
                contents
            });

            console.log(
                "Gemini response received successfully."
            );

            return response;

        } catch (error) {

            const status = error.status;

            console.error(
                `Gemini request failed on attempt ${attempt}:`,
                status || error.message
            );

            // Retry only temporary Gemini 503 errors
            if (status === 503 && attempt < maxRetries) {

                const waitTime = attempt * 2000;

                console.log(
                    `Gemini temporarily unavailable. ` +
                    `Retrying in ${waitTime / 1000} seconds...`
                );

                await sleep(waitTime);

                continue;
            }

            // If retries are finished or
            // the error is not a 503, throw the error
            throw error;
        }
    }
};


// Get project documents
const getProjectDocuments = async (projectId) => {
    const [rows] = await db.execute(
        `SELECT file_name, file_path, file_type, content
         FROM documents
         WHERE project_id = ?
         ORDER BY file_path ASC`,
        [projectId]
    );

    return rows;
};


// Get latest project analysis
const getProjectAnalysis = async (projectId) => {
    const [rows] = await db.execute(
        `SELECT
            summary,
            technologies,
            architecture,
            issues,
            recommendations
         FROM project_analysis
         WHERE project_id = ?
         ORDER BY created_at DESC
         LIMIT 1`,
        [projectId]
    );

    return rows[0];
};


// Find files that are most relevant to the user's question
const findRelevantDocuments = (documents, question) => {

    const questionWords = question
        .toLowerCase()
        .split(/[^a-zA-Z0-9]+/)
        .filter(word => word.length >= 3);


    const scoredDocuments = documents.map((document) => {

        const fileName = document.file_name.toLowerCase();
        const filePath = document.file_path.toLowerCase();
        const content = document.content.toLowerCase();

        let score = 0;


        for (const word of questionWords) {

            // File name is highly relevant
            if (fileName.includes(word)) {
                score += 5;
            }

            // File path is relevant
            if (filePath.includes(word)) {
                score += 3;
            }

            // Content contains the word
            if (content.includes(word)) {
                score += 1;
            }
        }


        return {
            ...document,
            score
        };
    });


    // Sort by relevance
    scoredDocuments.sort((a, b) => b.score - a.score);


    // Select only a small number of relevant files
    const relevantDocuments = scoredDocuments
        .filter(document => document.score > 0)
        .slice(0, 5);


    // If no files matched the question,
    // use the first few project files as fallback
    if (relevantDocuments.length === 0) {
        return documents.slice(0, 3);
    }


    return relevantDocuments;
};


// Prepare project files for Gemini
const prepareProjectCode = (documents) => {

    const MAX_FILE_SIZE = 12000;

    return documents
        .map((document) => {

            let content = document.content;

            // Prevent one huge file from consuming the entire prompt
            if (content.length > MAX_FILE_SIZE) {
                content =
                    content.substring(0, MAX_FILE_SIZE) +
                    "\n\n[File content truncated for AI analysis]";
            }

            return `
FILE: ${document.file_path}
TYPE: ${document.file_type}

CONTENT:
${content}
`;
        })
        .join("\n\n--------------------------------\n\n");
};


// Ask Gemini a question about the project
const askProjectQuestion = async (projectId, question) => {

    // Get stored project files
    const documents = await getProjectDocuments(projectId);

    if (documents.length === 0) {
        throw new Error("No project documents found");
    }


    // Get stored project analysis
    const analysis = await getProjectAnalysis(projectId);


    // Find files relevant to the question
    const relevantDocuments =
        findRelevantDocuments(documents, question);


    console.log(
        `Project ${projectId}: ${documents.length} total files, ` +
        `${relevantDocuments.length} relevant files selected`
    );


    // Prepare only relevant files
    const projectCode =
        prepareProjectCode(relevantDocuments);


    // Prepare previous analysis
    const previousAnalysis = analysis
        ? `
PROJECT ANALYSIS:

Summary:
${analysis.summary || "Not available"}

Technologies:
${analysis.technologies || "Not available"}

Architecture:
${analysis.architecture || "Not available"}

Issues:
${analysis.issues || "Not available"}

Recommendations:
${analysis.recommendations || "Not available"}
`
        : "No previous project analysis is available.";


    console.log(
        `Sending relevant project files to Gemini for project ${projectId}...`
    );


    // Ask Gemini with retry support
    const response = await generateWithRetry(`
You are CodePilot AI, a software engineering assistant.

You are answering questions about an existing software project.

Use the provided project analysis and relevant project files
to answer the user's question.

Rules:

- Answer based only on the provided project information.
- Do not invent files, technologies, or functionality.
- If the information is not available, clearly say so.
- Give practical and clear software engineering explanations.
- Mention relevant file names when useful.
- Keep the answer focused on the user's question.

${previousAnalysis}

RELEVANT PROJECT FILES:

${projectCode}

USER QUESTION:

${question}
`);


    return response.text;
};


module.exports = {
    askProjectQuestion
};