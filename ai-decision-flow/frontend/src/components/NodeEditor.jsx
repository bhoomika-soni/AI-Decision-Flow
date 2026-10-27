export default function NodeEditor({ node, onChange, onDelete }) {
  if (!node) {
    return (
      <aside className="node-editor">
        <h3>Node Editor</h3>
        <p>Select a decision node to edit its details.</p>
      </aside>
    );
  }

  return (
    <aside className="node-editor">
      <h3>Node Editor</h3>

      <label htmlFor="node-label">Node Name</label>
      <input
        id="node-label"
        value={node.data.label || ""}
        onChange={(event) =>
          onChange(node.id, "label", event.target.value)
        }
        placeholder="e.g. Check Eligibility"
      />

      <label htmlFor="node-prompt">AI Decision Prompt</label>
      <textarea
        id="node-prompt"
        value={node.data.prompt || ""}
        onChange={(event) =>
          onChange(node.id, "prompt", event.target.value)
        }
        placeholder="e.g. Is the user's age greater than or equal to 18?"
        rows={5}
      />

      <button
        className="delete-button"
        onClick={() => onDelete(node.id)}
      >
        Delete Node
      </button>
    </aside>
  );
}