# AI Decision Flow

An AI-powered workflow builder that allows users to create decision flows and execute them using Google's Gemini API. The application uses Inngest to orchestrate workflow execution and helps users evaluate conditions through AI-generated decisions.

## 🚀 Features

- **Visual Workflow Builder:** Create and manage decision nodes through an interactive canvas.
- **Custom Decision Prompts:** Define questions or conditions for Gemini to evaluate.
- **AI-Powered Decisions:** Use the Gemini API to generate answers for decision nodes.
- **Workflow Orchestration:** Execute workflows asynchronously using Inngest.
- **Execution Tracking:** Track workflow status, including queued, running, completed, and failed states.
- **Decision Path:** Record the prompts, answers, and execution details for each processed node.
- **Backend API:** Use Express.js endpoints to submit workflows and retrieve execution status.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend user interface |
| Vite | Frontend development and build tool |
| CSS | Application styling |
| Node.js | Backend runtime |
| Express.js | REST API |
| Inngest | Workflow orchestration |
| Google Gemini API | AI-powered decision evaluation |
| JavaScript | Application logic |

## 📁 Project Structure

```text
AI-Decision-Flow/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FlowCanvas.jsx
│   │   │   └── NodeEditor.jsx
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── ai.js
│   │   ├── workflow.js
│   │   └── index.js
│   └── package.json
│
└── README.md
```

*Note: Update the structure if your actual project contains additional files or folders.*

## ⚙️ Prerequisites

Before running the project, ensure you have:

- Node.js and npm installed.
- A Google Gemini API key.
- Inngest CLI installed or available through your configured development setup.

## 📥 Installation

### 1. Clone the repository

```bash
git clone https://github.com/bhoomika-soni/AI-Decision-Flow.git
cd AI-Decision-Flow
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
GEMINI_API_KEY=your_gemini_api_key
PORT=3000
```

Use the environment variable names expected by your existing backend code.

### 3. Set up the frontend

Open a separate terminal:

```bash
cd frontend
npm install
```

## ▶️ Running the Application

Run the frontend, backend, and Inngest development environment as required by your project configuration.

**Terminal 1 — Backend**

```bash
cd backend
npm run dev
```

**Terminal 2 — Frontend**

```bash
cd frontend
npm run dev
```

**Terminal 3 — Inngest**

Start the Inngest development server using your installed CLI and the command configured for your backend's Inngest endpoint. For example:

```bash
npx inngest-cli@latest dev
```

Open the local frontend URL printed by Vite. The Inngest development dashboard is commonly available at `http://localhost:8288`.

*Ensure your backend exposes the Inngest handler at the configured endpoint and that the frontend API URL matches your backend.*

## 🔄 How It Works

1. The user creates decision nodes and configures prompts in the workflow builder.
2. The frontend submits the nodes and edges to the Express backend.
3. The backend creates a unique workflow run ID and submits an execution event to Inngest.
4. Inngest invokes the workflow execution function.
5. The workflow evaluates decision prompts using the Gemini API.
6. The workflow records each node's prompt, answer, and execution timestamp.
7. The application can retrieve the workflow status and display the execution results.

## 🔌 API Endpoints

### Submit a workflow

`POST /api/workflows/run`

Submits a workflow for asynchronous execution.

Example request body:

```json
{
  "nodes": [],
  "edges": []
}
```

Example response:

```json
{
  "success": true,
  "message": "Workflow submitted for execution.",
  "runId": "generated-run-id",
  "status": "queued"
}
```

### Get workflow execution status

`GET /api/workflows/runs/:runId`

Retrieves the status and available execution details for a workflow run.

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | API key used to access the Gemini API |
| `PORT` | Backend server port, if configurable |

Never commit your `.env` file or expose your API key in frontend code or a public repository.

## ⚠️ Troubleshooting

- **Invalid API key:** Verify the environment variable name and API key configuration.
- **Quota exceeded:** Check Gemini API usage, model limits, and billing eligibility.
- **Workflow takes too long:** Inspect the Inngest run status and backend logs for slow API calls or retries.
- **Workflow status not found:** Verify the run ID and ensure workflow status is accessible to the backend API.
- **Frontend cannot reach backend:** Confirm that the backend is running and the API URL and CORS configuration are correct.

## 🎯 Future Improvements

- Add more node types and conditional branching.
- Visualize execution paths on the workflow canvas.
- Add workflow history and persistent execution storage.
- Improve error handling and retry management.
- Add user authentication and saved workflows.
- Provide detailed execution logs and analytics.

## 👩‍💻 Author

**Your Name**

A project exploring AI-powered decision-making, visual workflow design, and asynchronous workflow orchestration.

---

*AI Decision Flow — Turn decision logic into AI-powered workflows.*

