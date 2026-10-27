import { Inngest } from "inngest";

import { executeWorkflow } from "./workflow.js";

export const inngest = new Inngest({
    id: "ai-decision-flow"
});

export const executeWorkflowFunction =
    inngest.createFunction(
        {
            id: "execute-ai-decision-workflow",

            triggers: {
                event: "workflow/run.requested"
            }
        },

        async ({ event, step }) => {
            const {
                runId,
                nodes,
                edges
            } = event.data;

            const result = await step.run(
                "execute-workflow",
                async () => {
                    return await executeWorkflow({
                        runId,
                        nodes,
                        edges
                    });
                }
            );

            return result;
        }
    );

export const functions = [
    executeWorkflowFunction
];