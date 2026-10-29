const chatService = require("../services/chat.service");


// Ask a question about a project
const askProjectQuestion = async (req, res) => {
    console.log("CHAT REQUEST RECEIVED");
    console.log("Project ID:", req.params.id);
    console.log("Question:", req.body.question);

    try {
        const projectId = req.params.id;
        const { question } = req.body;

        // Validate question
        if (!question || !question.trim()) {
            console.log("Question validation failed");

            return res.status(400).json({
                message: "Question is required"
            });
        }

        console.log("Calling chat service...");

        const answer = await chatService.askProjectQuestion(
            projectId,
            question
        );

        console.log("Chat service completed successfully");

        res.status(200).json({
            message: "Question answered successfully",
            question,
            answer
        });

    } catch (error) {
        console.error("CHAT CONTROLLER ERROR:", error);

        res.status(500).json({
            message: "Failed to answer question"
        });
    }
};


module.exports = {
    askProjectQuestion
};