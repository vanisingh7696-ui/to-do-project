import React, { useEffect, useRef, useState } from "react";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("todos") || "[]");
    } catch {
      return [];
    }
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  function addTodo(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const newTodo = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
    };
    setTodos((t) => [newTodo, ...t]);
    setText("");
    inputRef.current?.focus();
  }

  function toggleTodo(id) {
    setTodos((t) =>
      t.map((it) =>
        it.id === id ? { ...it, completed: !it.completed } : it
      )
    );
  }

  function deleteTodo(id) {
    setTodos((t) => t.filter((it) => it.id !== id));
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setEditingText(todo.text);
  }

  function saveEdit(id) {
    const trimmed = editingText.trim();
    if (!trimmed) {
      setTodos((t) => t.filter((it) => it.id !== id));
    } else {
      setTodos((t) =>
        t.map((it) => (it.id === id ? { ...it, text: trimmed } : it))
      );
    }
    setEditingId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditingText("");
  }

  function clearCompleted() {
    setTodos((t) => t.filter((it) => !it.completed));
  }

  const filtered = todos.filter((it) => {
    if (filter === "active") return !it.completed;
    if (filter === "completed") return it.completed;
    return true;
  });

  return (
    <div className="app-container">
      <div className="todo-card">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <div>
              <h1 className="title">My To-Do</h1>
              <p className="subtitle">Stay organized, stay focused</p>
            </div>
            <div className="header-stats">
              <div className="stat-number">{todos.length}</div>
              <div className="stat-label">Total tasks</div>
            </div>
          </div>
        </div>

        {/* Add task */}
        <div className="add-section">
          <form className="add-form" onSubmit={addTodo}>
            <input
              ref={inputRef}
              className="add-input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Add a new task and press Enter"
            />
            <button className="add-btn" type="submit">
              <span className="add-btn-content">Add</span>
            </button>
          </form>
        </div>

        {/* Controls */}
        <div className="controls-section">
          <div className="controls">
            <div className="filters">
              {["all", "active", "completed"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`filter-btn ${
                    filter === f ? "filter-active" : ""
                  }`}
                >
                  {f[0].toUpperCase() + f.slice(1)}
                  <span className="filter-badge">
                    {f === "all"
                      ? todos.length
                      : f === "active"
                      ? todos.filter((t) => !t.completed).length
                      : todos.filter((t) => t.completed).length}
                  </span>
                </button>
              ))}
            </div>
            <button className="clear-btn" onClick={clearCompleted}>
              Clear completed
            </button>
          </div>
        </div>

        {/* Todo list */}
        <div className="todo-list-container">
          <ul className="todo-list">
            {filtered.length === 0 && (
              <li className="empty-state">
                <div className="empty-icon">📝</div>
                <p className="empty-title">No tasks yet</p>
                <p className="empty-text">Add one above to get started!</p>
              </li>
            )}
            {filtered.map((todo) => (
              <li
                key={todo.id}
                className={`todo-item ${todo.completed ? "completed" : ""}`}
              >
                <div className="todo-content">
                  {/* Checkbox */}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      className="checkbox-input"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id)}
                    />
                    <span
                      className={`checkbox-custom ${
                        todo.completed ? "checked" : ""
                      }`}
                    >
                      {todo.completed && "✔"}
                    </span>
                  </label>

                  {/* Text or Edit */}
                  <div className="todo-text-container">
                    {editingId === todo.id ? (
                      <input
                        className="edit-input"
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onBlur={() => saveEdit(todo.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") saveEdit(todo.id);
                          if (e.key === "Escape") cancelEdit();
                        }}
                        autoFocus
                      />
                    ) : (
                      <span
                        className="todo-text"
                        onDoubleClick={() => startEdit(todo)}
                      >
                        {todo.text}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="todo-actions">
                  <button
                    className="action-btn edit-btn"
                    onClick={() => startEdit(todo)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete-btn"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="footer">
          <div className="footer-stats">
            <div className="footer-stat">
              <span className="stat-dot active-dot"></span>
              {todos.filter((t) => !t.completed).length} Active
            </div>
            <div className="footer-stat">
              <span className="stat-dot completed-dot"></span>
              {todos.filter((t) => t.completed).length} Completed
            </div>
            <div className="footer-stat">
              <span className="stat-dot total-dot"></span>
              {todos.length} Total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
