import { Handle, Position } from "@xyflow/react";

export default function DecisionNode({ data, selected }) {
  return (
    <div
      style={{
        minWidth: "220px",
        border: selected ? "2px solid #6366f1" : "1px solid #475569",
        borderRadius: "12px",
        background: "#1e293b",
        color: "#f8fafc",
        padding: "16px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      }}
    >
      <Handle type="target" position={Position.Top} />

      <div style={{ fontSize: "12px", color: "#a5b4fc" }}>
        AI DECISION
      </div>

      <div
        style={{
          marginTop: "8px",
          fontWeight: "600",
          overflowWrap: "anywhere",
        }}
      >
        {data.label || "New Decision"}
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "12px",
          color: "#cbd5e1",
        }}
      >
        {data.prompt || "Configure your decision prompt"}
      </div>

      <Handle
        id="yes"
        type="source"
        position={Position.Bottom}
        style={{ left: "30%", background: "#22c55e" }}
      />

      <Handle
        id="no"
        type="source"
        position={Position.Bottom}
        style={{ left: "70%", background: "#ef4444" }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "20px",
          fontSize: "12px",
        }}
      >
        <span style={{ color: "#4ade80" }}>YES</span>
        <span style={{ color: "#f87171" }}>NO</span>
      </div>
    </div>
  );
}