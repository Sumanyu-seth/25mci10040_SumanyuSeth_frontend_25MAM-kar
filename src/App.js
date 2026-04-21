import React, { useState } from "react";
import "./App.css";

function App() {
  const [entries, setEntries] = useState([]);
  const [draft, setDraft] = useState("");
  const [activeId, setActiveId] = useState(null);

  const processSubmission = () => {
    if (!draft.trim()) return;

    if (activeId !== null) {
      const revisedEntries = entries.map((item) =>
        item.id === activeId ? { ...item, content: draft } : item
      );
      setEntries(revisedEntries);
      setActiveId(null);
    } else {
      const freshEntry = {
        id: Date.now(),
        content: draft,
      };
      setEntries([...entries, freshEntry]);
    }

    setDraft("");
  };

  const removeEntry = (targetId) => {
    setEntries(entries.filter((item) => item.id !== targetId));
  };

  const initiateRevision = (item) => {
    setDraft(item.content);
    setActiveId(item.id);
  };

  return (
    <div style={{ padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>📝 Notes App</h2>

      {/* Input */}
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          value={draft}
          placeholder="Write a note..."
          onChange={(e) => setDraft(e.target.value)}
          style={{ width: "70%", padding: "8px" }}
        />
        <button onClick={processSubmission} style={{ marginLeft: "10px" }}>
          {activeId !== null ? "Update" : "Add"}
        </button>
      </div>

      {/* Notes List */}
      <ul>
        {entries.map((item) => (
          <li key={item.id} style={{ marginBottom: "8px" }}>
            {item.content}
            <button
              onClick={() => initiateRevision(item)}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </button>
            <button
              onClick={() => removeEntry(item.id)}
              style={{ marginLeft: "5px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {entries.length === 0 && <p>No notes yet</p>}
    </div>
  );
}

export default App;