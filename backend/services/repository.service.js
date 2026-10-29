const fs = require("fs");
const path = require("path");

const ignoredDirectories = [
    "node_modules",
    ".git",
    "dist",
    "build",
    ".next",
    "coverage"
];

const allowedExtensions = [
    ".js",
    ".jsx",
    ".ts",
    ".tsx",
    ".py",
    ".java",
    ".c",
    ".cpp",
    ".h",
    ".html",
    ".css",
    ".scss",
    ".json",
    ".md"
];

const readRepositoryFiles = (repositoryPath) => {
    const files = [];

    const readDirectory = (directory) => {
        const entries = fs.readdirSync(directory, {
            withFileTypes: true
        });

        for (const entry of entries) {

            const fullPath = path.join(directory, entry.name);

            if (entry.isDirectory()) {

                if (ignoredDirectories.includes(entry.name)) {
                    continue;
                }

                readDirectory(fullPath);

            } else {

                const extension = path.extname(entry.name);

                    if (
                        !allowedExtensions.includes(extension) &&
                        entry.name !== "README"
                    ) {
                        continue;
                    }

                const content = fs.readFileSync(
                    fullPath,
                    "utf-8"
                );

                files.push({
                    fileName: entry.name,
                    filePath: path.relative(
                        repositoryPath,
                        fullPath
                    ),
                    fileType: extension
                        ? extension.substring(1)
                        : "text",
                    content
                });
            }
        }
    };

    readDirectory(repositoryPath);

    return files;
};

module.exports = {
    readRepositoryFiles
};