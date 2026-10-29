import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import "./ProjectDetails.css";

const API_URL = "http://localhost:5000";

function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);
    const [analysis, setAnalysis] = useState(null);

    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState("");

    // AI Chat
    const [question, setQuestion] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [chatLoading, setChatLoading] = useState(false);
    const [chatError, setChatError] = useState("");

    // ==========================================
    // FETCH PROJECT DETAILS
    // ==========================================

    useEffect(() => {
        const fetchProjectDetails = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            try {
                setLoading(true);
                setError("");

                // Fetch project
                const projectResponse = await fetch(
                    `${API_URL}/api/projects/${id}`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const projectData =
                    await projectResponse.json();

                if (!projectResponse.ok) {
                    throw new Error(
                        projectData.message ||
                        "Failed to fetch project"
                    );
                }

                setProject(projectData.project);

                // Fetch latest analysis
                const analysisResponse = await fetch(
                    `${API_URL}/api/projects/${id}/analysis`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const analysisData =
                    await analysisResponse.json();

                if (analysisResponse.ok) {
                    setAnalysis(analysisData.analysis);
                } else {
                    setAnalysis(null);
                }

            } catch (error) {
                console.error(
                    "Project details error:",
                    error
                );

                setError(error.message);

            } finally {
                setLoading(false);
            }
        };

        fetchProjectDetails();

    }, [id, navigate]);


    // ==========================================
    // ANALYZE PROJECT
    // ==========================================

    const handleAnalyzeProject = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        try {
            setAnalyzing(true);
            setError("");

            const response = await fetch(
                `${API_URL}/api/projects/${id}/analyze`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to analyze project"
                );
            }

            setAnalysis(data.result);

        } catch (error) {
            console.error(
                "Project analysis error:",
                error
            );

            setError(error.message);

        } finally {
            setAnalyzing(false);
        }
    };


    // ==========================================
    // ASK CODEPILOT AI
    // ==========================================

    const handleAskQuestion = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        const trimmedQuestion = question.trim();

        if (!trimmedQuestion) {
            setChatError("Please enter a question.");
            return;
        }

        try {
            setChatLoading(true);
            setChatError("");

            // Add user message
            setChatMessages((previousMessages) => [
                ...previousMessages,
                {
                    type: "user",
                    message: trimmedQuestion
                }
            ]);

            setQuestion("");

            const response = await fetch(
                `${API_URL}/api/projects/${id}/chat`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        question: trimmedQuestion
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to get AI response"
                );
            }

            // Add AI response
            setChatMessages((previousMessages) => [
                ...previousMessages,
                {
                    type: "ai",
                    message: data.answer
                }
            ]);

        } catch (error) {
            console.error(
                "Chat error:",
                error
            );

            setChatError(
                error.message ||
                "Failed to get AI response"
            );

        } finally {
            setChatLoading(false);
        }
    };


    // ==========================================
    // CLEAR CHAT
    // ==========================================

    const handleClearChat = () => {
        setChatMessages([]);
        setChatError("");
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="project-details-page">

                <div className="details-loading">

                    <div className="modern-loader"></div>

                    <p>
                        Loading project...
                    </p>

                </div>

            </div>
        );
    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error && !project) {
        return (
            <div className="project-details-page">

                <div className="details-error">

                    <div className="error-icon">
                        !
                    </div>

                    <h2>
                        Unable to load project
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={() => navigate("/")}
                    >
                        Back to Projects
                    </button>

                </div>

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div className="project-details-page">

            {/* =====================================
                NAVBAR
            ====================================== */}

            <header className="cp-navbar">

                <div className="cp-brand">

                    <div className="cp-logo">
                        &lt;/&gt;
                    </div>

                    <div>
                        <div className="cp-brand-name">
                            CodePilot AI
                        </div>

                        <div className="cp-brand-subtitle">
                            Software Engineering Assistant
                        </div>
                    </div>

                </div>


                <div className="cp-navbar-right">

                    <span className="project-nav-label">
                        Project Workspace
                    </span>

                    <button
                        className="logout-button"
                        onClick={() => {
                            localStorage.removeItem("token");
                            navigate("/");
                        }}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* =====================================
                MAIN
            ====================================== */}

            <main className="cp-main">

                {/* Back */}

                <button
                    className="cp-back-button"
                    onClick={() => navigate("/")}
                >
                    <span>←</span>
                    Back to Projects
                </button>


                {/* =====================================
                    PROJECT HERO
                ====================================== */}

                <section className="project-hero">

                    <div className="hero-left">

                        <div className="hero-label">
                            PROJECT WORKSPACE
                        </div>

                        <div className="hero-title-row">

                            <h1>
                                {project?.name}
                            </h1>

                            <span className="status-badge">
                                <span className="status-dot"></span>
                                {analysis
                                    ? "Analyzed"
                                    : "Not Analyzed"}
                            </span>

                        </div>

                        <p className="hero-description">
                            {project?.description ||
                                "No project description provided."}
                        </p>

                    </div>


                    <div className="hero-source">

                        <span className="hero-source-label">
                            SOURCE
                        </span>

                        <span className="github-badge">
                            ● GitHub
                        </span>

                    </div>

                </section>


                {/* =====================================
                    PROJECT STATS
                ====================================== */}

                <section className="project-stats">

                    <div className="stat-card">

                        <div className="stat-icon purple">
                            &lt;/&gt;
                        </div>

                        <div>
                            <span className="stat-label">
                                SOURCE
                            </span>

                            <strong>
                                {project?.source_type ||
                                    project?.sourceType ||
                                    "Unknown"}
                            </strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon blue">
                            ◉
                        </div>

                        <div>
                            <span className="stat-label">
                                ANALYSIS
                            </span>

                            <strong>
                                {analysis
                                    ? "Available"
                                    : "Pending"}
                            </strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon green">
                            ✓
                        </div>

                        <div>
                            <span className="stat-label">
                                AI ASSISTANT
                            </span>

                            <strong>
                                Gemini AI
                            </strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon orange">
                            ◷
                        </div>

                        <div>
                            <span className="stat-label">
                                CREATED
                            </span>

                            <strong>
                                {project?.created_at
                                    ? new Date(
                                        project.created_at
                                    ).toLocaleDateString()
                                    : "Unknown"}
                            </strong>
                        </div>

                    </div>

                </section>


                {/* =====================================
                    REPOSITORY
                ====================================== */}

                <section className="repository-card">

                    <div className="repository-left">

                        <div className="repository-icon">
                            ◇
                        </div>

                        <div>

                            <span className="repository-label">
                                GITHUB REPOSITORY
                            </span>

                            <a
                                href={
                                    project?.source_url ||
                                    project?.sourceUrl ||
                                    "#"
                                }
                                target="_blank"
                                rel="noreferrer"
                            >
                                {project?.source_url ||
                                    project?.sourceUrl ||
                                    "Repository URL unavailable"}
                            </a>

                        </div>

                    </div>

                    <span className="external-icon">
                        ↗
                    </span>

                </section>


                {/* =====================================
                    AI ANALYSIS HEADER
                ====================================== */}

                <section className="analysis-section">

                    <div className="section-heading">

                        <div className="heading-left">

                            <div className="ai-section-icon">
                                ✦
                            </div>

                            <div>

                                <div className="section-eyebrow">
                                    CODEPILOT INTELLIGENCE
                                </div>

                                <h2>
                                    AI Project Analysis
                                </h2>

                                <p>
                                    Understand your codebase,
                                    architecture, issues and
                                    improvement opportunities.
                                </p>

                            </div>

                        </div>


                        {analysis && (

                            <button
                                className="secondary-action"
                                onClick={handleAnalyzeProject}
                                disabled={analyzing}
                            >
                                {analyzing
                                    ? "Analyzing..."
                                    : "↻ Regenerate"}
                            </button>

                        )}

                    </div>


                    {/* Error */}

                    {error && project && (

                        <div className="dashboard-error">
                            {error}
                        </div>

                    )}


                    {/* =================================
                        NO ANALYSIS
                    ================================== */}

                    {!analysis && !analyzing && (

                        <div className="analysis-empty">

                            <div className="empty-ai-icon">
                                ✦
                            </div>

                            <h3>
                                Your project is ready for analysis
                            </h3>

                            <p>
                                Let CodePilot AI inspect the
                                project files and generate
                                engineering insights.
                            </p>

                            <button
                                className="primary-action"
                                onClick={handleAnalyzeProject}
                            >
                                ✦ Analyze Project
                            </button>

                        </div>

                    )}


                    {/* =================================
                        ANALYZING
                    ================================== */}

                    {analyzing && (

                        <div className="analysis-processing">

                            <div className="processing-animation">

                                <div className="processing-ring"></div>

                                <span>
                                    ✦
                                </span>

                            </div>

                            <h3>
                                Analyzing your codebase
                            </h3>

                            <p>
                                CodePilot AI is examining the
                                project files and generating
                                engineering insights.
                            </p>

                            <div className="processing-bar">
                                <div></div>
                            </div>

                        </div>

                    )}


                    {/* =================================
                        ANALYSIS RESULT
                    ================================== */}

                    {analysis && !analyzing && (

                        <div className="analysis-content">

                            {/* Summary */}

                            <article className="summary-card">

                                <div className="card-heading">

                                    <div className="card-icon">
                                        ✦
                                    </div>

                                    <div>
                                        <span>
                                            OVERVIEW
                                        </span>

                                        <h3>
                                            Project Summary
                                        </h3>
                                    </div>

                                </div>

                                <div className="markdown-content">

                                    <ReactMarkdown>
                                        {analysis.summary ||
                                            analysis.analysis ||
                                            "No summary available."}
                                    </ReactMarkdown>

                                </div>

                            </article>


                            {/* Four analysis cards */}

                            <div className="analysis-cards-grid">

                                <article className="insight-card">

                                    <div className="insight-header">

                                        <div className="insight-icon purple">
                                            &lt;/&gt;
                                        </div>

                                        <div>
                                            <span>
                                                STACK
                                            </span>

                                            <h3>
                                                Technologies
                                            </h3>
                                        </div>

                                    </div>

                                    <div className="markdown-content">
                                        <ReactMarkdown>
                                            {analysis.technologies ||
                                                "No technology information available."}
                                        </ReactMarkdown>
                                    </div>

                                </article>


                                <article className="insight-card">

                                    <div className="insight-header">

                                        <div className="insight-icon blue">
                                            ◇
                                        </div>

                                        <div>
                                            <span>
                                                STRUCTURE
                                            </span>

                                            <h3>
                                                Architecture
                                            </h3>
                                        </div>

                                    </div>

                                    <div className="markdown-content">
                                        <ReactMarkdown>
                                            {analysis.architecture ||
                                                "No architecture information available."}
                                        </ReactMarkdown>
                                    </div>

                                </article>


                                <article className="insight-card">

                                    <div className="insight-header">

                                        <div className="insight-icon red">
                                            !
                                        </div>

                                        <div>
                                            <span>
                                                REVIEW
                                            </span>

                                            <h3>
                                                Potential Issues
                                            </h3>
                                        </div>

                                    </div>

                                    <div className="markdown-content">
                                        <ReactMarkdown>
                                            {analysis.issues ||
                                                "No issues identified."}
                                        </ReactMarkdown>
                                    </div>

                                </article>


                                <article className="insight-card">

                                    <div className="insight-header">

                                        <div className="insight-icon green">
                                            ✓
                                        </div>

                                        <div>
                                            <span>
                                                IMPROVEMENT
                                            </span>

                                            <h3>
                                                Recommendations
                                            </h3>

                                        </div>

                                    </div>

                                    <div className="markdown-content">
                                        <ReactMarkdown>
                                            {analysis.recommendations ||
                                                "No recommendations available."}
                                        </ReactMarkdown>
                                    </div>

                                </article>

                            </div>

                        </div>

                    )}

                </section>


                {/* =====================================
                    AI CHAT
                ====================================== */}

                <section className="chat-section">

                    <div className="chat-header">

                        <div className="chat-title-area">

                            <div className="chat-main-icon">
                                ✦
                            </div>

                            <div>

                                <div className="section-eyebrow">
                                    PROJECT ASSISTANT
                                </div>

                                <h2>
                                    Ask CodePilot AI
                                </h2>

                                <p>
                                    Ask questions about your
                                    project's code, architecture,
                                    technologies or issues.
                                </p>

                            </div>

                        </div>


                        {chatMessages.length > 0 && (

                            <button
                                className="clear-chat-button"
                                onClick={handleClearChat}
                            >
                                Clear conversation
                            </button>

                        )}

                    </div>


                    <div className="chat-panel">

                        {/* Empty */}

                        {chatMessages.length === 0 && (

                            <div className="chat-empty">

                                <div className="chat-empty-symbol">
                                    ✦
                                </div>

                                <h3>
                                    Your AI project assistant
                                </h3>

                                <p>
                                    Ask anything about this
                                    project and CodePilot will
                                    answer using the available
                                    project information.
                                </p>

                                <div className="suggested-questions">

                                    <button
                                        onClick={() =>
                                            setQuestion(
                                                "What technologies are used in this project?"
                                            )
                                        }
                                    >
                                        What technologies are used?
                                    </button>

                                    <button
                                        onClick={() =>
                                            setQuestion(
                                                "Explain the architecture of this project."
                                            )
                                        }
                                    >
                                        Explain the architecture
                                    </button>

                                    <button
                                        onClick={() =>
                                            setQuestion(
                                                "What are the main problems in this project?"
                                            )
                                        }
                                    >
                                        What are the main problems?
                                    </button>

                                </div>

                            </div>

                        )}


                        {/* Messages */}

                        {chatMessages.length > 0 && (

                            <div className="chat-messages">

                                {chatMessages.map(
                                    (chatMessage, index) => (

                                        <div
                                            key={index}
                                            className={`chat-row ${
                                                chatMessage.type === "user"
                                                    ? "chat-row-user"
                                                    : "chat-row-ai"
                                            }`}
                                        >

                                            <div
                                                className={`chat-avatar ${
                                                    chatMessage.type === "user"
                                                        ? "user-avatar"
                                                        : "ai-avatar"
                                                }`}
                                            >
                                                {chatMessage.type === "user"
                                                    ? "You"
                                                    : "✦"}
                                            </div>


                                            <div className="chat-bubble-wrapper">

                                                <div className="chat-message-meta">

                                                    <strong>
                                                        {chatMessage.type === "user"
                                                            ? "You"
                                                            : "CodePilot AI"}
                                                    </strong>

                                                </div>


                                                <div
                                                    className={`chat-bubble ${
                                                        chatMessage.type === "user"
                                                            ? "user-bubble"
                                                            : "ai-bubble"
                                                    }`}
                                                >

                                                    <ReactMarkdown>
                                                        {chatMessage.message}
                                                    </ReactMarkdown>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )}


                                {chatLoading && (

                                    <div className="chat-row chat-row-ai">

                                        <div className="chat-avatar ai-avatar">
                                            ✦
                                        </div>

                                        <div className="chat-bubble-wrapper">

                                            <div className="chat-message-meta">
                                                <strong>
                                                    CodePilot AI
                                                </strong>
                                            </div>

                                            <div className="chat-bubble ai-bubble thinking-bubble">

                                                <span></span>
                                                <span></span>
                                                <span></span>

                                            </div>

                                        </div>

                                    </div>

                                )}

                            </div>

                        )}

                    </div>


                    {/* Chat Error */}

                    {chatError && (

                        <div className="chat-error">
                            {chatError}
                        </div>

                    )}


                    {/* Chat Input */}

                    <form
                        className="chat-input-container"
                        onSubmit={handleAskQuestion}
                    >

                        <input
                            type="text"
                            value={question}
                            onChange={(e) =>
                                setQuestion(e.target.value)
                            }
                            placeholder="Ask CodePilot about this project..."
                            disabled={chatLoading}
                        />

                        <button
                            type="submit"
                            disabled={
                                chatLoading ||
                                !question.trim()
                            }
                        >
                            {chatLoading
                                ? "..."
                                : "↑"}
                        </button>

                    </form>

                    <div className="chat-input-hint">
                        CodePilot AI answers using the available
                        project files and analysis.
                    </div>

                </section>

            </main>

        </div>
    );
}

export default ProjectDetails;