import { evaluateDecision } from "./ai.js";

// Store execution status for local development.
// This is temporary in-memory storage, not a production database.
export const workflowRuns = new Map();

export async function executeWorkflow({
    runId,
    nodes,
    edges
}) {
    const run = {
        runId,
        status: "running",
        path: [],
        startedAt: new Date().toISOString(),
        finishedAt: null,
        error: null
    };

    workflowRuns.set(runId, run);

    try {
        if (!Array.isArray(nodes) || nodes.length === 0) {
            throw new Error("The workflow has no nodes.");
        }

        if (!Array.isArray(edges)) {
            throw new Error("Workflow edges must be an array.");
        }

        const nodeMap = new Map(
            nodes.map(node => [node.id, node])
        );

        // Validate node IDs.
        if (
            nodeMap.size !== nodes.length ||
            nodes.some(node => !node.id)
        ) {
            throw new Error(
                "Every node must have a unique ID."
            );
        }

        // Validate all connections.
        for (const edge of edges) {
            if (
                !nodeMap.has(edge.source) ||
                !nodeMap.has(edge.target)
            ) {
                throw new Error(
                    `Invalid connection: ${edge.id || "unknown edge"}`
                );
            }

            if (
                edge.sourceHandle !== "yes" &&
                edge.sourceHandle !== "no"
            ) {
                throw new Error(
                    `Connection ${edge.id || ""} must use a YES or NO handle.`
                );
            }
        }

        // Find the node with no incoming edges.
        const incomingNodeIds = new Set(
            edges.map(edge => edge.target)
        );

        const startingNodes = nodes.filter(
            node => !incomingNodeIds.has(node.id)
        );

        if (startingNodes.length !== 1) {
            throw new Error(
                "The workflow must have exactly one starting node."
            );
        }

        let currentNode = startingNodes[0];

        const visited = new Set();

        // Prevent infinite loops and excessive AI calls.
        const MAX_STEPS = 30;

        for (
            let stepNumber = 0;
            stepNumber < MAX_STEPS;
            stepNumber++
        ) {
            if (visited.has(currentNode.id)) {
                throw new Error(
                    `Cycle detected at node ${currentNode.id}.`
                );
            }

            visited.add(currentNode.id);

            const prompt = currentNode.data?.prompt;

            if (
                typeof prompt !== "string" ||
                !prompt.trim()
            ) {
                throw new Error(
                    `Node ${currentNode.id} has no prompt.`
                );
            }

            const answer = await evaluateDecision(prompt);

            const pathEntry = {
                nodeId: currentNode.id,
                nodeLabel:
                    currentNode.data?.label ||
                    currentNode.id,
                prompt,
                answer,
                executedAt: new Date().toISOString()
            };

            run.path.push(pathEntry);

            // Persist the current progress in local memory.
            workflowRuns.set(runId, { ...run });

            // Select the edge corresponding to the AI answer.
            const selectedEdge = edges.find(edge =>
                edge.source === currentNode.id &&
                edge.sourceHandle === answer.toLowerCase()
            );

            // No matching edge means this is the end of the path.
            if (!selectedEdge) {
                run.status = "completed";
                break;
            }

            currentNode = nodeMap.get(selectedEdge.target);
        }

        if (run.path.length >= MAX_STEPS && run.status !== "completed") {
            throw new Error(
                "Workflow exceeded the maximum number of steps."
            );
        }

        run.status = "completed";
        run.finishedAt = new Date().toISOString();

        workflowRuns.set(runId, { ...run });

        return run;
    } catch (error) {
        run.status = "failed";
        run.error = error.message;
        run.finishedAt = new Date().toISOString();

        workflowRuns.set(runId, { ...run });

        throw error;
    }
}