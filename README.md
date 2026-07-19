# Vertex-AI - Multi-Agent Platform

Vertex-AI is a modern, premium AI assistant platform built with a microservices architecture. It supports complex agent workflows, live code execution previews, PowerPoint slide creation, PDF document generation, image creation, web searching, and PDF RAG analysis.

---

## 🏗️ Architecture Overview

The application is structured as a set of backend microservices coordinated by an API Gateway, with a single-page React frontend.

```
                  ┌──────────────────────┐
                  │   React Frontend     │
                  └──────────┬───────────┘
                             │
                             ▼ (Port 8000)
                  ┌──────────────────────┐
                  │    API Gateway       │─────────┐
                  └──────────┬───────────┘         │
                             │                     ▼ (Session Caching)
      ┌──────────────────────┼─────────────────────┼─────────────────────┐
      ▼ (Port 8001)          ▼ (Port 8002)         ▼ (Port 8003)         ▼ (Port 8004)
┌──────────────┐       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│ Auth Service │       │ Chat Service │      │ Agent Engine │      │   Billing    │
└──────┬───────┘       └──────┬───────┘      └──────┬───────┘      └──────┬───────┘
       │                      │                     │                     │
       ▼ (MongoDB)            ▼ (MongoDB)           ▼ (MongoDB)           ▼ (MongoDB)
┌──────────────┐       ┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   auth_db    │       │   chat_db    │      │   agent_db   │      │  billing_db  │
└──────────────┘       └──────────────┘      └──────────────┘      └──────────────┘
```

### Port Assignments & Services
*   **API Gateway** (`http://localhost:8000`): Proxies request paths to the respective services and validates user session cookies.
*   **Auth Service** (`http://localhost:8001`): Handles Firebase user token verification, profile creation, and active session tokens.
*   **Chat Service** (`http://localhost:8002`): Manages conversation records, message history, and database persistence.
*   **Agent Engine** (`http://localhost:8003`): Runs multi-agent coordination using **LangGraph** (agents include General Chat, Web Search, Coding/Artifact generator, PPT, PDF, Image Generation, Vision, and PDF RAG).
*   **Billing Service** (`http://localhost:8004`): Interfaces with **Razorpay** for plan upgrades and handles transaction state updates.
*   **Redis** (`localhost:6379`): Manages user session state and message caches.

---

## 🛠️ Tech Stack

### Frontend
*   **Core**: React (Vite, React Router v7)
*   **State Management**: Redux Toolkit
*   **Styling**: Tailwind CSS v4, Framer Motion
*   **Integrations**: Firebase Auth, Razorpay SDK, Monaco Editor (`@monaco-editor/react`)

### Backend
*   **Core**: Node.js, Express, Mongoose
*   **Caching/Sessions**: Redis (`ioredis`)
*   **Multi-Agent Orchestration**: LangGraph (`@langchain/langgraph`), LangChain
*   **AI Models**: Groq (Llama-3.3-70b), OpenRouter (DeepSeek-Chat), Gemini-2.5-Flash
*   **Vector Database**: Qdrant Cloud
*   **Document/Media Generation**: PDFKit, PPTXGenJS
*   **File Storage**: AWS S3

---

## 🚀 Local Setup

### Prerequisites
1.  **Node.js** (v18+ recommended)
2.  **Redis** (running locally on port `6379`)
3.  **MongoDB Atlas** account (or local MongoDB instances)
4.  **Firebase Project** (for client authentication)
5.  **Razorpay Developer Account** (for payment tests)

### Step 1: Clone and Setup Environment Variables
Every service and the frontend requires environment configurations. Copy the template `.env.example` files to `.env` in their respective directories and fill in your keys:

*   **API Gateway**: `backend/gateway/.env`
*   **Auth Service**: `backend/services/auth/.env`
*   **Chat Service**: `backend/services/chat/.env`
*   **Agent Engine**: `backend/services/agent/.env`
*   **Billing Service**: `backend/services/billing/.env`
*   **Frontend**: `frontend/.env`

Also add your Firebase Admin credentials in `backend/services/auth/serviceAccount.json`.

### Step 2: Install Dependencies
Install packages for the backend gateway, services, and frontend:
```bash
# In the root, backend, frontend, gateway, and each microservice directory:
npm install
```

### Step 3: Run the Services
Run each backend component and the React client dev server:

```bash
# Start Gateway
cd backend/gateway && npm run dev

# Start Services (in separate terminals)
cd backend/services/auth && npm run dev
cd backend/services/chat && npm run dev
cd backend/services/agent && npm run dev
cd backend/services/billing && npm run dev

# Start Frontend Dev Server
cd frontend && npm run dev
```

---

## 🔒 Security Reminder
All sensitive keys and files (`.env`, `serviceAccount.json`, node dependencies, and build folders) are ignored via the root `.gitignore` to prevent leaks. Please verify your staging area before committing.
