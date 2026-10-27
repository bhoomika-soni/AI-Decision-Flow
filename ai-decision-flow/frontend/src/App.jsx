import { useState } from "react";

import FlowCanvas from "./components/FlowCanvas";
import NodeEditor from "./components/NodeEditor";

import "./index.css";

const initialNodes = [
  {
    id: "1",
    type: "decision",
    position: { x: 250, y: 100 },
    data: {
      label: "Check Eligibility",
      prompt: "Is the user's age greater than or equal to 18?",
    },
  },
];

export default function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [executionResult, setExecutionResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleNodeChange(nodeId, field, value) {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                [field]: value,
              },
            }
          : node
      )
    );

    setSelectedNode((currentNode) =>
      currentNode?.id === nodeId
        ? {
            ...currentNode,
            data: {
              ...currentNode.data,
              [field]: value,
            },
          }
        : currentNode
    );
  }

  function handleAddNode() {
    const newNode = {
      id: crypto.randomUUID(),
      type: "decision",
      position: {
        x: 100 + Math.random() * 300,
        y: 100 + Math.random() * 200,
      },
      data: {
        label: "New Decision",
        prompt: "",
      },
    };

    setNodes((currentNodes) => [...currentNodes, newNode]);
    setSelectedNode(newNode);
    setExecutionResult(null);
    setError("");
  }

  function handleDeleteNode(nodeId) {
    setNodes((currentNodes) =>
      currentNodes.filter((node) => node.id !== nodeId)
    );

    setEdges((currentEdges) =>
      currentEdges.filter(
        (edge) =>
          edge.source !== nodeId && edge.target !== nodeId
      )
    );

    setSelectedNode(null);
    setExecutionResult(null);
  }

  async function handleRunWorkflow() {
    setLoading(true);
    setError("");
    setExecutionResult(null);

    try {
      const response = await fetch(
        "http://localhost:3000/api/workflows/run",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nodes, edges }),
        }
      );

      const result = await response.json();
      console.log("Backend response:", result);

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to start workflow."
        );
      }

      setExecutionResult(result);
      if (result.runId) {
  const runId = result.runId;

  for (let attempt = 0; attempt < 30; attempt++) {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const statusResponse = await fetch(
      `http://localhost:3000/api/workflows/runs/${runId}`
    );

    const statusResult = await statusResponse.json();

    if (!statusResponse.ok) {
      throw new Error(
        statusResult.message || "Unable to retrieve workflow result."
      );
    }

    const run = statusResult.run;

    if (run?.status === "completed" || run?.status === "failed") {
      setExecutionResult(run);

      if (run.status === "failed") {
        setError(run.error || "Workflow execution failed.");
      }

      break;
    }
  }
}
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <div>
          <h1>AI Decision Flow</h1>
          <p>Design and execute AI-powered workflows</p>
        </div>

        <div className="toolbar">
          <button onClick={handleAddNode}>+ Add Node</button>

          <button
            className="run-button"
            onClick={handleRunWorkflow}
            disabled={loading}
          >
            {loading ? "Starting..." : "▶ Run Workflow"}
          </button>
        </div>
      </header>

      <main className="workspace">
        <section className="canvas-section">
          <div className="canvas-heading">
            <h2>Workflow Canvas</h2>
            <span>{nodes.length} nodes</span>
          </div>

          <FlowCanvas
            nodes={nodes}
            setNodes={setNodes}
            edges={edges}
            setEdges={setEdges}
            onNodeClick={setSelectedNode}
          />
        </section>

        <NodeEditor
          node={selectedNode}
          onChange={handleNodeChange}
          onDelete={handleDeleteNode}
        />
      </main>

      {(error || executionResult) && (
        <section className="result-panel">
          {error && <p className="error-message">{error}</p>}

          {executionResult && (
            <>
              <h3>Workflow Execution</h3>
              <p>Status: {executionResult.status}</p>
              <p>Run ID: {executionResult.runId}</p>
              <p>
                The workflow has been submitted. Execution results
                may take a moment to become available.
              </p>
            </>
          )}
          
{/* Display Gemini's YES/NO result */}
{executionResult?.path && (
  <div className="execution-results">
    <h2>Gemini Decision Results</h2>

    {executionResult.path.map((item, index) => (
      <div key={`${item.nodeId}-${index}`} className="result-card">
        <h3>{item.nodeLabel || item.nodeId}</h3>

        <p>
          <strong>Question:</strong> {item.prompt}
        </p>

        <p>
          <strong>Gemini's Answer:</strong>{" "}
          <span
            style={{
              color:
                item.answer?.toUpperCase() === "YES"
                  ? "green"
                  : "red",
              fontWeight: "bold",
            }}
          >
            {item.answer}
          </span>
        </p>
      </div>
    ))}
  </div>
)}

        </section>
        
      )}
      
      
    </div>
  );
}