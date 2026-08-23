const documentService = require("../services/document.service");

// Create a document
const createDocument = async (req, res) => {
    try {
        const {
            fileName,
            filePath,
            fileType,
            content
        } = req.body;

        const projectId = req.params.projectId;

        if (!projectId || !fileName || !filePath || !content) {
            return res.status(400).json({
                message: "Project ID, file name, file path and content are required"
            });
        }

        const document = await documentService.createDocument(
            projectId,
            fileName,
            filePath,
            fileType || null,
            content
        );

        res.status(201).json({
            message: "Document created successfully",
            document
        });

    } catch (error) {
        console.error("Create document error:", error);

        res.status(500).json({
            message: "Failed to create document"
        });
    }
};

// Get all documents of a project
const getProjectDocuments = async (req, res) => {
    try {
        const projectId = req.params.projectId;

        const documents = await documentService.getProjectDocuments(
            projectId
        );

        res.status(200).json({
            documents
        });

    } catch (error) {
        console.error("Get documents error:", error);

        res.status(500).json({
            message: "Failed to fetch documents"
        });
    }
};


// Get one document
const getDocumentById = async (req, res) => {
    try {
        const document = await documentService.getDocumentById(
            req.params.documentId,
            req.params.projectId
        );

        if (!document) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        res.status(200).json({
            document
        });

    } catch (error) {
        console.error("Get document error:", error);

        res.status(500).json({
            message: "Failed to fetch document"
        });
    }
};


// Delete a document
const deleteDocument = async (req, res) => {
    try {
        const deleted = await documentService.deleteDocument(
            req.params.documentId,
            req.params.projectId
        );

        if (!deleted) {
            return res.status(404).json({
                message: "Document not found"
            });
        }

        res.status(200).json({
            message: "Document deleted successfully"
        });

    } catch (error) {
        console.error("Delete document error:", error);

        res.status(500).json({
            message: "Failed to delete document"
        });
    }
};


module.exports = {
    createDocument,
    getProjectDocuments,
    getDocumentById,
    deleteDocument
};