import "dotenv/config";

import express from "express";
import cors from "cors";
import { randomUUID } from "node:crypto";
import { workflowRuns } from "./workflow.js";

import { serve } from "inngest/express";

import {
    inngest,
    functions
} from "./inngest.js";



const app = express();

const PORT = process.env.PORT || 3000;

app.use(
    cors({
        origin:
            process.env.FRONTEND_URL ||
            "http://localhost:5173"
    })
);

app.use(express.json({ limit: "1mb" }));

// Health check
app.get("/api/health", (req, res) => {
    res.json({
        success: true,
        message: "AI Decision Flow backend is running."
    });
});

// Inngest endpoint
app.use(
    "/api/inngest",
    serve({
        client: inngest,
        functions
    })
);

// Submit a workflow for asynchronous execution
app.post("/api/workflows/run", async (req, res) => {
    try {
        const { nodes, edges } = req.body;

        if (!Array.isArray(nodes) || nodes.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one workflow node is required."
            });
        }

        if (!Array.isArray(edges)) {
            return res.status(400).json({
                success: false,
                message: "Edges must be an array."
            });
        }

        const runId = randomUUID();

        workflowRuns.set(runId, {
            runId,
            status: "queued",
            path: [],
            startedAt: new Date().toISOString(),
            finishedAt: null,
            error: null
        });

        await inngest.send({
            name: "workflow/run.requested",
            data: {
                runId,
                nodes,
                edges
            }
        });

        return res.status(202).json({
            success: true,
            message: "Workflow submitted for execution.",
            runId,
            status: "queued"
        });
    } catch (error) {
        console.error("Workflow submission failed:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to submit the workflow."
        });
    }
});

// Retrieve a workflow run's status and execution path
app.get("/api/workflows/runs/:runId", (req, res) => {
    const run = workflowRuns.get(req.params.runId);

    if (!run) {
        return res.status(404).json({
            success: false,
            message: "Workflow run not found."
        });
    }

    return res.json({
        success: true,
        run
    });
});

app.listen(PORT, () => {
    console.log(
        `Backend running at http://localhost:${PORT}`
    );

    console.log(
        `Health check: http://localhost:${PORT}/api/health`
    );
});