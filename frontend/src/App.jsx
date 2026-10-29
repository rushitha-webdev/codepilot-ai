
import { useEffect, useState } from "react";
import {
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import ProjectDetails from "./pages/ProjectDetails";
import CreateProject from "./pages/CreateProject";
import robotMascot from "./assets/robot-mascot.png";
import "./App.css";

const API_URL = "http://localhost:5000";

// =====================================================
// DASHBOARD
// =====================================================

function Dashboard({
    token,
    setToken,
    projects,
    setProjects,
    projectsLoading,
    error,
    setError
}) {
    const navigate = useNavigate();

    const [editingProject, setEditingProject] = useState(null);
    const [editForm, setEditForm] = useState({
        name: "",
        description: ""
    });
    const [savingEdit, setSavingEdit] = useState(false);
    const [editError, setEditError] = useState("");

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setProjects([]);
        setError("");
        navigate("/");
    };

    // Open the Edit Project popup
    const openEditProject = (project) => {
        setEditingProject(project);

        setEditForm({
            name: project.name || "",
            description: project.description || ""
        });

        setEditError("");
        setError("");
    };

    // Close the popup without saving
    const closeEditProject = () => {
        if (savingEdit) return;

        setEditingProject(null);
        setEditForm({
            name: "",
            description: ""
        });
        setEditError("");
    };

    // Save edited project details
    const handleEditProject = async (event) => {
        event.preventDefault();

        if (!editingProject) return;

        const name = editForm.name.trim();
        const description = editForm.description.trim();

        if (!name) {
            setEditError("Project name is required.");
            return;
        }

        try {
            setSavingEdit(true);
            setEditError("");

            const response = await fetch(
                `${API_URL}/api/projects/${editingProject.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        name,
                        description
                    })
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to update project."
                );
            }

            // Update the dashboard without reloading the page
            setProjects((previous) =>
                previous.map((project) =>
                    String(project.id) === String(editingProject.id)
                        ? {
                            ...project,
                            ...data.project,
                            name,
                            description
                        }
                        : project
                )
            );

            setEditingProject(null);
            setEditForm({
                name: "",
                description: ""
            });
            setEditError("");
        } catch (err) {
            console.error("Edit project error:", err);
            setEditError(
                err.message || "Failed to update project."
            );
        } finally {
            setSavingEdit(false);
        }
    };

    // Delete a project
    const handleDeleteProject = async (project) => {
        const confirmed = window.confirm(
            `Are you sure you want to delete "${project.name}"?`
        );

        if (!confirmed) return;

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/api/projects/${project.id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to delete project."
                );
            }

            setProjects((previous) =>
                previous.filter(
                    (item) =>
                        String(item.id) !== String(project.id)
                )
            );
        } catch (err) {
            console.error("Delete project error:", err);
            setError(
                err.message || "Failed to delete project."
            );
        }
    };

    return (
        <div className="dashboard">
            {/* NAVBAR */}
            <header className="dashboard-navbar">
                <div className="dashboard-logo">
                    <div className="logo-icon">&lt;/&gt;</div>
                    <span>
                        CodePilot <span className="brand-accent">AI</span>
                    </span>
                </div>

                <div className="navbar-user">
                    <span className="welcome-message">
                        Welcome, {localStorage.getItem("fullName") || "Developer"}!
                    </span>

                    <button
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* DASHBOARD CONTENT */}
            <main className="dashboard-main">
                <div className="dashboard-heading">
                    <div>
                        <span className="dashboard-label">
                            YOUR WORKSPACE
                        </span>

                        <h1>Your Projects</h1>

                        <p>
                            Analyze and understand your software
                            projects with AI.
                        </p>
                    </div>

                    <button
                        className="new-project-button"
                        onClick={() => navigate("/create-project")}
                    >
                        + New Project
                    </button>
                </div>

                {error && (
                    <div className="dashboard-error" role="alert">
                        {error}
                    </div>
                )}

                {/* PROJECT LIST */}
                <section className="projects-section">
                    <div className="section-header">
                        <h2>Projects</h2>

                        <span>
                            {projects.length}{" "}
                            {projects.length === 1
                                ? "project"
                                : "projects"}
                        </span>
                    </div>

                    {projectsLoading ? (
                        <div className="loading-state">
                            <div className="loader"></div>
                            <p>Loading your projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">&lt;/&gt;</div>
                            <h3>No projects yet</h3>

                            <p>
                                Create your first project to start
                                analyzing your codebase.
                            </p>

                            <button
                                className="new-project-button"
                                onClick={() =>
                                    navigate("/create-project")
                                }
                            >
                                + Create your first project
                            </button>
                        </div>
                    ) : (
                        <div className="projects-grid">
                            {projects.map((project) => (
                                <article
                                    className="project-card"
                                    key={project.id}
                                >
                                    <div className="project-card-top">
                                        <div className="project-icon">
                                            &lt;/&gt;
                                        </div>

                                        <div className="project-card-actions">
                                            <span
                                                className={
                                                    project.source_type === "github"
                                                        ? "source-badge github"
                                                        : "source-badge upload"
                                                }
                                            >
                                                {project.source_type ||
                                                    project.sourceType ||
                                                    "project"}
                                            </span>

                                            {/* EDIT BUTTON */}
                                            <button
                                                type="button"
                                                className="edit-project-button"
                                                title="Edit project"
                                                aria-label={`Edit ${project.name}`}
                                                onClick={() =>
                                                    openEditProject(project)
                                                }
                                            >
                                                <svg
                                                    width="17"
                                                    height="17"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M12 20h9" />
                                                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
                                                </svg>
                                            </button>

                                            {/* DELETE BUTTON */}
                                            <button
                                                type="button"
                                                className="delete-project-button"
                                                title="Delete project"
                                                aria-label={`Delete ${project.name}`}
                                                onClick={() =>
                                                    handleDeleteProject(project)
                                                }
                                            >
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    aria-hidden="true"
                                                >
                                                    <path d="M3 6h18" />
                                                    <path d="M8 6V4h8v2" />
                                                    <path d="m19 6-1 14H6L5 6" />
                                                    <path d="M10 11v5" />
                                                    <path d="M14 11v5" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>

                                    <h3>{project.name}</h3>

                                    <p className="project-description">
                                        {project.description ||
                                            "No description provided."}
                                    </p>

                                    <div className="project-card-footer">
                                        <span>
                                            Created{" "}
                                            {project.created_at
                                                ? new Date(
                                                    project.created_at
                                                ).toLocaleDateString()
                                                : "recently"}
                                        </span>

                                        <button
                                            onClick={() =>
                                                navigate(
                                                    `/projects/${project.id}`
                                                )
                                            }
                                        >
                                            Open →
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* EDIT PROJECT POPUP */}
            {editingProject && (
                <div
                    className="edit-modal-overlay"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeEditProject();
                        }
                    }}
                >
                    <section
                        className="edit-modal"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-modal-title"
                    >
                        {/* POPUP HEADER */}
                        <div className="edit-modal-header">
                            <div
                                className="edit-modal-icon"
                                aria-hidden="true"
                            >
                                <svg
                                    width="23"
                                    height="23"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M12 20h9" />
                                    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z" />
                                </svg>
                            </div>

                            <div className="edit-modal-heading">
                                <h2 id="edit-modal-title">
                                    Edit Project
                                </h2>

                                <p>
                                    Update your project's details.
                                </p>
                            </div>

                            <button
                                type="button"
                                className="edit-modal-close"
                                onClick={closeEditProject}
                                disabled={savingEdit}
                                aria-label="Close edit project dialog"
                            >
                                &times;
                            </button>
                        </div>

                        {/* EDIT FORM */}
                        <form
                            className="edit-project-form"
                            onSubmit={handleEditProject}
                        >
                            <div className="edit-form-group">
                                <label htmlFor="edit-project-name">
                                    Project name
                                </label>

                                <input
                                    id="edit-project-name"
                                    name="name"
                                    type="text"
                                    value={editForm.name}
                                    onChange={(event) =>
                                        setEditForm((previous) => ({
                                            ...previous,
                                            name: event.target.value
                                        }))
                                    }
                                    placeholder="Enter project name"
                                    maxLength={150}
                                    required
                                    autoFocus
                                    disabled={savingEdit}
                                />
                            </div>

                            <div className="edit-form-group">
                                <label htmlFor="edit-project-description">
                                    Description
                                </label>

                                <textarea
                                    id="edit-project-description"
                                    name="description"
                                    value={editForm.description}
                                    onChange={(event) =>
                                        setEditForm((previous) => ({
                                            ...previous,
                                            description: event.target.value
                                        }))
                                    }
                                    placeholder="Describe what your project does..."
                                    rows={4}
                                    maxLength={2000}
                                    disabled={savingEdit}
                                />
                            </div>

                            <p className="edit-modal-hint">
                                Updating these fields won't change your
                                GitHub repository or existing AI analysis.
                            </p>

                            {editError && (
                                <div
                                    className="edit-modal-error"
                                    role="alert"
                                >
                                    {editError}
                                </div>
                            )}

                            {/* POPUP ACTIONS */}
                            <div className="edit-modal-actions">
                                <button
                                    type="button"
                                    className="edit-cancel-button"
                                    onClick={closeEditProject}
                                    disabled={savingEdit}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="edit-save-button"
                                    disabled={savingEdit}
                                >
                                    {savingEdit
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
}

// =====================================================
// LOGIN AND REGISTRATION
// =====================================================

function AuthPage({ setToken }) {
    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setFormData((previous) => ({
            ...previous,
            [event.target.name]: event.target.value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const endpoint = isLogin
                ? "/api/auth/login"
                : "/api/auth/register";

            const body = isLogin
                ? {
                    email: formData.email,
                    password: formData.password
                }
                : {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password
                };

            const response = await fetch(
                `${API_URL}${endpoint}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Authentication failed."
                );
            }

            if (isLogin) {
                if (!data.token) {
                    throw new Error(
                        "Login succeeded but no token was returned."
                    );
                }

                localStorage.setItem("token", data.token);

                const registeredName =
                    data.user?.name ||
                    data.user?.fullName ||
                    data.name ||
                    localStorage.getItem("fullName");

                if (registeredName) {
                    localStorage.setItem(
                        "fullName",
                        registeredName
                    );
                }

                setToken(data.token);
            } else {
                localStorage.setItem(
                    "fullName",
                    formData.name.trim()
                );

                setMessage(
                    "Registration successful! You can now log in."
                );

                setIsLogin(true);

                setFormData((previous) => ({
                    ...previous,
                    password: "",
                    name: ""
                }));
            }
        } catch (err) {
            console.error("Authentication error:", err);
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <div className="auth-container">
                {/* LEFT: LOGIN CARD */}
                <section className="auth-card-container">
                    <div className="auth-card">
                        <div className="auth-brand-inline">
                            <div className="logo-icon">&lt;/&gt;</div>
                            <span>
                                CodePilot{" "}
                                <span className="brand-accent">AI</span>
                            </span>
                        </div>

                        <div className="auth-header">
                            <span className="auth-eyebrow">
                                YOUR AI CODING WORKSPACE
                            </span>

                            <h2>
                                {isLogin
                                    ? "Welcome back"
                                    : "Create your account"}
                            </h2>

                            <p>
                                {isLogin
                                    ? "Sign in to continue to your workspace."
                                    : "Create an account and start understanding your code."}
                            </p>
                        </div>

                        <div className="auth-tabs">
                            <button
                                type="button"
                                className={isLogin ? "active" : ""}
                                onClick={() => {
                                    setIsLogin(true);
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                Login
                            </button>

                            <button
                                type="button"
                                className={!isLogin ? "active" : ""}
                                onClick={() => {
                                    setIsLogin(false);
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                Register
                            </button>
                        </div>

                        <form
                            onSubmit={handleSubmit}
                            autoComplete="off"
                        >
                            {!isLogin && (
                                <div className="form-group">
                                    <label htmlFor="name">
                                        Full name
                                    </label>

                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="email">
                                    Email address
                                </label>

                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">
                                    Password
                                </label>

                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    required
                                />
                            </div>

                            {error && (
                                <div
                                    className="message error"
                                    role="alert"
                                >
                                    {error}
                                </div>
                            )}

                            {message && (
                                <div
                                    className="message success"
                                    role="status"
                                >
                                    {message}
                                </div>
                            )}

                            <button
                                className="submit-button"
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Please wait..."
                                    : isLogin
                                        ? "Sign in to CodePilot"
                                        : "Create account"}

                                {!loading && <span> →</span>}
                            </button>
                        </form>

                        <p className="switch-text">
                            {isLogin
                                ? "Don't have an account?"
                                : "Already have an account?"}

                            <button
                                type="button"
                                onClick={() => {
                                    setIsLogin((previous) => !previous);
                                    setMessage("");
                                    setError("");
                                }}
                            >
                                {isLogin ? "Create one" : "Sign in"}
                            </button>
                        </p>

                        <p className="auth-secure-note">
                            <span>✦</span> Your code. Your workspace.
                            Powered by AI.
                        </p>
                    </div>
                </section>

                {/* RIGHT: ROBOT AND PRODUCT FEATURES */}
                <section
                    className="auth-visual-panel"
                    aria-label="CodePilot AI features"
                >
                    <div className="visual-topline">
                        <div className="logo">
                            <div className="logo-icon">&lt;/&gt;</div>
                            <span>
                                CodePilot{" "}
                                <span className="brand-accent">AI</span>
                            </span>
                        </div>

                        <span className="status-pill">
                            <span className="status-dot"></span>
                            AI workspace
                        </span>
                    </div>

                    <div className="visual-copy">
                        <span className="visual-kicker">
                            YOUR AI SOFTWARE ENGINEERING ASSISTANT
                        </span>

                        <h1>
                            Turn your code
                            <br />
                            into <span>knowledge.</span>
                        </h1>

                        <p>
                            Understand repositories, explore architecture,
                            and improve your code with an AI assistant
                            built for developers.
                        </p>
                    </div>

                    <div className="robot-stage">
                        <div className="robot-orbit robot-orbit-one"></div>
                        <div className="robot-orbit robot-orbit-two"></div>

                        <div className="floating-code-card floating-code-top">
                            <span className="window-dots">
                                <i></i>
                                <i></i>
                                <i></i>
                            </span>
                            <span className="code-line line-purple"></span>
                            <span className="code-line line-blue"></span>
                            <span className="code-line line-pink"></span>
                        </div>

                        <div className="floating-feature-card">
                            <span className="feature-card-icon">⌘</span>
                            <span>
                                <strong>Analyze repository</strong>
                                <small>Understand your codebase</small>
                            </span>
                        </div>

                        <img
                            className="robot-mascot"
                            src={robotMascot}
                            alt="Cute 3D robot coding on a laptop"
                        />

                        <div className="robot-caption">
                            <span className="caption-sparkle">✦</span>
                            Build better software with AI
                        </div>
                    </div>

                    <div className="visual-feature-row">
                        <div>
                            <span>01</span>
                            <strong>Analyze</strong>
                        </div>
                        <div>
                            <span>02</span>
                            <strong>Understand</strong>
                        </div>
                        <div>
                            <span>03</span>
                            <strong>Improve</strong>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

// =====================================================
// MAIN APP
// =====================================================

function MainApp() {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [projects, setProjects] = useState([]);
    const [projectsLoading, setProjectsLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchProjects = async () => {
        const savedToken = localStorage.getItem("token");

        if (!savedToken) return;

        setProjectsLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/api/projects`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${savedToken}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to fetch projects."
                );
            }

            setProjects(data.projects || []);
            setError("");
        } catch (err) {
            console.error("Fetch projects error:", err);
            setError(
                err.message || "Failed to fetch projects."
            );
        } finally {
            setProjectsLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchProjects();
        }
    }, [token]);

    return (
        <Routes>
            <Route
                path="/"
                element={
                    token
                        ? <Navigate to="/dashboard" replace />
                        : <AuthPage setToken={setToken} />
                }
            />

            <Route
                path="/dashboard"
                element={
                    token ? (
                        <Dashboard
                            token={token}
                            setToken={setToken}
                            projects={projects}
                            setProjects={setProjects}
                            projectsLoading={projectsLoading}
                            error={error}
                            setError={setError}
                        />
                    ) : (
                        <Navigate to="/" replace />
                    )
                }
            />

            <Route
                path="/create-project"
                element={
                    token
                        ? <CreateProject />
                        : <Navigate to="/" replace />
                }
            />

            <Route
                path="/projects/:id"
                element={
                    token ? (
                        <div style={{
                            padding: "50px",
                            textAlign: "center"
                        }}>
                            <h1>Project Details</h1>
                            <p>We will build this page next.</p>
                        </div>
                    ) : (
                        <Navigate to="/" replace />
                    )
                }
            />

            <Route
                path="*"
                element={
                    <Navigate
                        to={token ? "/dashboard" : "/"}
                        replace
                    />
                }
            />
        </Routes>
    );
}

// =====================================================
// APP ROUTING
// =====================================================

function App() {
    return (
        <Routes>
            <Route
                path="/projects/:id"
                element={<ProjectDetails />}
            />

            <Route
                path="*"
                element={<MainApp />}
            />
        </Routes>
    );
}

export default App;
