const fs = require("fs");
const path = require("path");

// Directories/files that CodePilot should ignore
const ignoredNames = new Set([
    ".git",
    "node_modules",
    ".env",
    ".DS_Store"
]);

const readProjectFiles = (projectPath) => {
    const documents = [];

    const walkDirectory = (currentPath) => {
        const entries = fs.readdirSync(currentPath, {
            withFileTypes: true
        });

        for (const entry of entries) {
            if (ignoredNames.has(entry.name)) {
                continue;
            }

            const fullPath = path.join(currentPath, entry.name);

            if (entry.isDirectory()) {
                walkDirectory(fullPath);
            } else {
                const content = fs.readFileSync(fullPath, "utf-8");

                documents.push({
                    fileName: entry.name,
                    filePath: path.relative(projectPath, fullPath),
                    content
                });
            }
        }
    };

    walkDirectory(projectPath);

    return documents;
};

module.exports = {
    readProjectFiles
};