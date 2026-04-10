import { useEffect, useState } from "react";
import {
  fetchTasks,
  createTask,
  updateTaskStatus,
  updateTaskTitle,
  deleteTask,
} from "./api";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  // Load from localStorage first
  useEffect(() => {
    const stored = localStorage.getItem("tasks");
    if (stored) {
      setTasks(JSON.parse(stored));
    }
  }, []);

  // Sync to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Fetch from API
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await fetchTasks(); // expects { tasks: [...] }
        setTasks(data.tasks || []);
      } catch (err) {
        setError(err.message || "Failed to load tasks");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed) return;
    try {
      setError("");
      const data = await createTask(trimmed); // { task }
      setTasks((prev) => [data.task, ...prev]);
      setNewTitle("");
    } catch (err) {
      setError(err.message || "Failed to create task");
    }
  };

  const handleToggleCompleted = async (task) => {
    try {
      setError("");
      const data = await updateTaskStatus(task.id, !task.completed);
      const updated = data.task;
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError(err.message || "Failed to update task");
    }
  };

  const handleDelete = async (id) => {
    try {
      setError("");
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err.message || "Failed to delete task");
    }
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const saveEditing = async (task) => {
    const trimmed = editingTitle.trim();
    if (!trimmed || trimmed === task.title) {
      cancelEditing();
      return;
    }
    try {
      setError("");
      const data = await updateTaskTitle(task.id, trimmed);
      const updated = data.task;
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      cancelEditing();
    } catch (err) {
      setError(err.message || "Failed to update title");
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "incomplete") return !t.completed;
    return true;
  });

  return (
    <div className="app">
      <h1>Task Manager</h1>

      <form className="task-form" onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Add a new task..."
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          maxLength={200}
        />
        <button type="submit">Add</button>
      </form>

      <div className="controls">
        <span>Filter:</span>
        <button
          type="button"
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          All
        </button>
        <button
          type="button"
          className={filter === "completed" ? "active" : ""}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>
        <button
          type="button"
          className={filter === "incomplete" ? "active" : ""}
          onClick={() => setFilter("incomplete")}
        >
          Incomplete
        </button>
      </div>

      {loading && <p className="info">Loading tasks...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && filteredTasks.length === 0 && (
        <p className="info">No tasks to show.</p>
      )}

      <ul className="task-list">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={task.completed ? "task completed" : "task"}
          >
            <div className="task-main">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleCompleted(task)}
              />

              {editingId === task.id ? (
                <>
                  <input
                    className="edit-input"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    maxLength={200}
                  />
                  <button type="button" onClick={() => saveEditing(task)}>
                    Save
                  </button>
                  <button type="button" onClick={cancelEditing}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span className="title">{task.title}</span>
                  <small className="date">
                    {new Date(task.createdAt).toLocaleString()}
                  </small>
                </>
              )}
            </div>

            <div className="task-actions">
              {editingId !== task.id && (
                <button type="button" onClick={() => startEditing(task)}>
                  Edit
                </button>
              )}
              <button
                type="button"
                className="danger"
                onClick={() => handleDelete(task.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
