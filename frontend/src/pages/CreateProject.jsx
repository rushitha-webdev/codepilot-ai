
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateProject.css";

function CreateProject() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        sourceType: "github",
        sourceUrl: ""
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!formData.name.trim()) {
            setError("Project name is required.");
            return;
        }

        if (!formData.sourceUrl.trim()) {
            setError("GitHub repository URL is required.");
            return;
        }

        try {
            const parsedUrl = new URL(formData.sourceUrl.trim());

            if (
                parsedUrl.hostname !== "github.com" ||
                !/^\/[^/]+\/[^/]+\/?$/.test(parsedUrl.pathname)
            ) {
                setError(
                    "Enter a valid GitHub repository URL, such as https://github.com/username/repository."
                );
                return;
            }
        } catch {
            setError("Please enter a valid GitHub repository URL.");
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/projects",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...formData,
                        name: formData.name.trim(),
                        description: formData.description.trim() || null,
                        sourceUrl: formData.sourceUrl.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to create project."
                );
            }

            navigate("/dashboard");
        } catch (err) {
            console.error("Create project error:", err);

            setError(
                err.message || "Failed to create project."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-project-page">
            <header className="create-project-navbar">
                <button
                    type="button"
                    className="create-project-brand"
                    onClick={() => navigate("/dashboard")}
                    aria-label="CodePilot AI dashboard"
                >
                    <span className="create-project-logo">
                        &lt;/&gt;
                    </span>

                    <span className="create-project-brand-text">
                        CodePilot <span>AI</span>
                        <small>Software Engineering Assistant</small>
                    </span>
                </button>

                <button
                    type="button"
                    className="create-project-logout"
                    onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/");
                        window.location.reload();
                    }}
                >
                    Logout
                </button>
            </header>

            <main className="create-project-container">
                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate("/dashboard")}
                >
                    <span aria-hidden="true">←</span>
                    Back to Projects
                </button>

                <div className="create-project-intro">
                    <span className="create-project-eyebrow">
                        YOUR WORKSPACE
                    </span>

                    <h1>Create a Project</h1>

                    <p>
                        Connect your repository and let CodePilot AI
                        help you understand your code.
                    </p>
                </div>

                <section className="create-project-card">
                    <div className="create-project-header">
                        <div className="project-icon">
                            &lt;/&gt;
                        </div>

                        <div>
                            <h2>Project Details</h2>
                            <p>
                                Enter the details of the project
                                you want to analyze.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">
                                Project Name
                                <span className="required-mark"> *</span>
                            </label>

                            <input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="e.g. E-Commerce Application"
                                value={formData.name}
                                onChange={handleChange}
                                maxLength={150}
                                autoComplete="off"
                                required
                                disabled={loading}
                            />

                            <span className="field-hint">
                                Choose a name that helps you identify
                                your project.
                            </span>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                Description
                                <span className="optional-label">
                                    (Optional)
                                </span>
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                placeholder="What does your project do? What problem does it solve?"
                                rows={4}
                                value={formData.description}
                                onChange={handleChange}
                                maxLength={2000}
                                disabled={loading}
                            />

                            <span className="field-hint">
                                You can add or change this description later.
                            </span>
                        </div>

                        <div className="form-group">
                            <label>Project Source</label>

                            <div className="source-option active">
                                <div className="source-option-icon">
                                    <svg
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        aria-hidden="true"
                                    >
                                        <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 19.06 4.77 5.07 5.07 0 0 0 18.97 1S17.8.65 15 2.48a13.38 13.38 0 0 0-7 0C5.2.65 4.03 1 4.03 1a5.07 5.07 0 0 0-.09 3.77A5.44 5.44 0 0 0 2.5 7.52c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 8 17.13V22" />
                                    </svg>
                                </div>

                                <div className="source-option-copy">
                                    <strong>GitHub Repository</strong>
                                    <span>
                                        Analyze an existing GitHub project
                                    </span>
                                </div>

                                <span className="source-selected">
                                    <span></span>
                                    Selected
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="sourceUrl">
                                GitHub Repository URL
                                <span className="required-mark"> *</span>
                            </label>

                            <div className="repository-input-wrapper">
                                <svg
                                    className="repository-input-icon"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <path d="M8 12h8" />
                                    <path d="m12 8 4 4-4 4" />
                                </svg>

                                <input
                                    id="sourceUrl"
                                    name="sourceUrl"
                                    type="url"
                                    placeholder="https://github.com/username/repository"
                                    value={formData.sourceUrl}
                                    onChange={handleChange}
                                    autoComplete="off"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <span className="field-hint">
                                Use the URL of a repository you can access.
                            </span>
                        </div>

                        {error && (
                            <div className="form-error" role="alert">
                                <span aria-hidden="true">!</span>
                                {error}
                            </div>
                        )}

                        <div className="create-project-actions">
                            <button
                                type="button"
                                className="create-project-cancel"
                                onClick={() => navigate("/dashboard")}
                                disabled={loading}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="create-project-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="create-project-spinner"></span>
                                        Creating Project...
                                    </>
                                ) : (
                                    <>
                                        Create Project
                                        <span aria-hidden="true">→</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </section>

                <p className="create-project-footer-note">
                    <span aria-hidden="true">✦</span>
                    Your codebase, understood with AI.
                </p>
            </main>
        </div>
    );
}

export default CreateProject;
