CodePilot-AI Architecture

Step 1: User Authentication

The user opens the CodePilot-AI web application and logs in using their credentials.

User
  │
  ▼
React Frontend
  │
  ▼
Node.js + Express API
  │
  ▼
MySQL Database

MySQL verifies the user's credentials and returns the authentication result.

Step 2: Project Upload

The authenticated user uploads either:

ZIP Project
GitHub Repository URL
 User
  │
  ▼
 React Frontend
  │
  ▼
Node.js + Express Backend

Step 3: Project Processing

The backend prepares the uploaded project for analysis.

Tasks performed:

Extract ZIP file (if uploaded)
Clone repository (if GitHub URL)
Read project files
Ignore unnecessary folders
node_modules
.git
build
dist
Collect source code files

Project
   │
   ▼
Backend
   │
   ├── Extract Files
   ├── Read Source Code
   ├── Remove Unnecessary Files
   └── Prepare Documents


Step 4: Code Parsing using Tree-sitter

Tree-sitter parses the source code into an Abstract Syntax Tree (AST).

Instead of treating code as plain text, it understands:

Functions
Classes
Variables
Imports
Parameters
Return Types

Example:

function login(email, password) {}

Tree-sitter extracts:

Function Name : login
Parameters    : email, password
File          : auth.js

This enables semantic code understanding.

 Backend
    │
    ▼
 Tree-sitter

Step 5: Code Chunking

The parsed code is divided into meaningful chunks.

Example chunks:

One function
One class
One module
  Tree-sitter
      │
      ▼
  Code Chunks
  
Step 6: Embedding Generation

Each code chunk is converted into a vector representation using an embedding model.

Code Chunk
      │
      ▼
Embedding Model
      │
      ▼
Vector Embedding

These vectors capture the semantic meaning of the code.

Step 7: Store in ChromaDB

All embeddings are stored in ChromaDB for efficient semantic search.

Embedding
     │
     ▼
ChromaDB
Step 8: User Query

The user asks a question.

Example:

Where is authentication implemented?

User
   │
   ▼
React Frontend
   │
   ▼
Express Backend
Step 9: Retrieval-Augmented Generation (RAG)

The backend converts the user's question into an embedding and searches ChromaDB for the most relevant code chunks.

Only the relevant code is retrieved instead of the entire project.

Question
     │
     ▼
Question Embedding
     │
     ▼
ChromaDB
     │
     ▼
Relevant Code Chunks

This is the core of the Retrieval-Augmented Generation (RAG) pipeline.

Step 10: Gemini Response Generation

Gemini receives:

User question
Relevant code chunks
Project context

It generates an intelligent and context-aware answer.

Relevant Code
        │
        ▼
Gemini API
        │
        ▼
AI Response
Step 11: Display Response

The backend returns Gemini's response to the frontend.

Gemini
    │
    ▼
Express Backend
    │
    ▼
React Frontend
    │
    ▼
User
Complete System Architecture
                    User
                      │
                      ▼
            React Frontend (UI)
                      │
                      ▼
        Node.js + Express Backend
                      │
     ┌────────────────┼────────────────┐
     │                │                │
     ▼                ▼                ▼
  MySQL          Tree-sitter      GitHub API
(Authentication)     │
                     ▼
               Code Parsing
                     │
                     ▼
               Code Chunking
                     │
                     ▼
             Embedding Model
                     │
                     ▼
                 ChromaDB
                     │
                     ▼
              Similarity Search
                     │
                     ▼
                 Gemini API
                     │
                     ▼
                AI Response
                     │
                     ▼
              React Frontend