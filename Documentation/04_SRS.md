Software Requirements Specification (SRS)
CodePilot AI – Agentic Software Engineering Assistant
1. Introduction
1.1 Purpose

CodePilot AI is an AI-powered web application designed to help software developers understand, analyze, and improve software projects using Agentic AI and Retrieval-Augmented Generation (RAG). The system enables developers to interact with their codebase through natural language, generate documentation, detect potential issues, and gain insights into project architecture.

1.2 Scope

The application allows users to:

.Register and log in securely
.Upload software projects as ZIP files
.Import GitHub repositories
.Analyze project source code
.Ask AI questions about the project
.Generate project documentation
.Suggest unit tests
.Detect possible bugs
.View project history and AI conversations

2. Functional Requirements

2.1 User Management

.User Registration
.User Login
.User Logout
.JWT-based Authentication
.User Profile Management

2.2 Project Management

.Upload ZIP Project
.Import GitHub Repository
.View Uploaded Projects
.Delete Projects
.Store Project Metadata

2.3 AI Analysis Module

.Explain Project Structure
.Answer Project-Specific Questions
.Generate Documentation
.Suggest Unit Tests
.Detect Possible Bugs
.Provide Code Explanations

2.4 Chat Module

.Interactive AI Chat
.Save Chat History
.Reload Previous Conversations

2.5 Dashboard

.Display Uploaded Projects
.Show Recent AI Conversations
.Display Recent Project Analyses
.View User Activity Summary

3. Non-Functional Requirements

.Performance
.Upload and process projects within a reasonable time.
.Generate AI responses with minimal latency after analysis.
.Support efficient retrieval of relevant code using RAG.
.Security
.Encrypt user passwords using bcrypt.
.Secure authentication using JWT.
.Ensure user data isolation.
.Prevent unauthorized access to projects.
.Scalability
.Support multiple concurrent users.
.Allow multiple projects per user.
.Handle increasing project sizes efficiently.
.Reliability
.Preserve uploaded projects and chat history.
.Ensure data is not lost after server restarts.
.Provide consistent AI responses.
.Maintainability
.Use a modular architecture.
.Support future feature additions with minimal code changes.

4. Hardware Requirements

Minimum Requirements:

.8 GB RAM
.Dual-Core Processor
.Stable Internet Connection
.10 GB Free Disk Space

5. Software Requirements

.Operating System
.Ubuntu 22.04 or later
.Windows 10/11
.Development Tools
.Node.js
.React
.Express.js
.MySQL
.ChromaDB
.Tree-sitter
.Git
.Visual Studio Code
.AI Services
.Google Gemini API
.Embedding Model (Gemini Embeddings or equivalent)

6. User Roles

.Primary Users
.Students
.Software Developers
.Software Engineers
.Administrator (Optional)
.Manage users
.Monitor uploaded projects
.Manage system configuration

7. Constraints

.Limited requests under the free Gemini API plan.
.Internet connection required for AI processing.
.Large repositories may require additional processing time.
.AI response quality depends on retrieved project context.

8. Future Enhancements

.Pull Request Review
.AI Code Review
.Security Vulnerability Analysis
.Team Collaboration
.Architecture Visualization
.Multi-language Support
.Voice-based AI Assistant
.Automatic Code Refactoring Suggestions