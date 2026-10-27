import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import DecisionNode from "./DecisionNode";

const nodeTypes = {
  decision: DecisionNode,
};

export default function FlowCanvas({
  nodes,
  setNodes,
  edges,
  setEdges,
  onNodeClick,
}) {
  function handleConnect(connection) {
    setEdges((currentEdges) =>
      addEdge(connection, currentEdges)
    );
  }

  return (
    <div className="flow-canvas">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={(changes) =>
          setNodes((currentNodes) => {
            // React Flow provides the official change helper below.
            return applyNodeChanges(changes, currentNodes);
          })
        }
        onEdgesChange={(changes) =>
          setEdges((currentEdges) =>
            applyEdgeChanges(changes, currentEdges)
          )
        }
        onConnect={handleConnect}
        onNodeClick={(_, node) => onNodeClick(node)}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
}