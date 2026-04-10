const BASE_URL = "http://localhost:5000";

async function handleResponse(res) {
  const json = await res.json();
  if (!res.ok || !json.success) {
    const message = json.message || "Something went wrong";
    throw new Error(message);
  }
  return json.data;
}

export async function fetchTasks() {
  const res = await fetch(`${BASE_URL}/tasks`);
  return handleResponse(res);
}

export async function createTask(title) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function updateTaskStatus(id, completed) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed }),
  });
  return handleResponse(res);
}

export async function updateTaskTitle(id, title) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  return handleResponse(res);
}

export async function deleteTask(id) {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
  });
  return handleResponse(res);
}
