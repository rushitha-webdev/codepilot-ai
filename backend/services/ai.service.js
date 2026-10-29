require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const analyzeProject = async (projectCode) => {
    const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `
You are a software engineering assistant.

Analyze the following software project.

Provide:

1. Project summary
2. Technologies used
3. Project architecture
4. Important files
5. Potential issues
6. Recommendations for improvement

Keep the explanation clear and practical.

PROJECT CODE:

${projectCode}
`
    });

    return response.text;
};

module.exports = {
    analyzeProject
};