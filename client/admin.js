/* =============================================================
   ADMIN PAGE LOGIC (Interface 4)
   Handles: fetching all projects, creating a project, updating
   a project, deleting a project. Talks to the Express/MongoDB
   backend via the /api/projects endpoints.
============================================================== */

// Base URL of the backend API — change if your server runs elsewhere
const API_URL = "http://localhost:5000/api/projects";

// Cache DOM elements used across functions
const form = document.getElementById("project-form");
const projectIdField = document.getElementById("project-id");
const titleField = document.getElementById("project-title");
const descriptionField = document.getElementById("project-description");
const technologiesField = document.getElementById("project-technologies");
const linkField = document.getElementById("project-link");

const saveBtn = document.getElementById("save-btn");
const resetBtn = document.getElementById("reset-btn");
const formTitle = document.getElementById("admin-form-title");
const formStatus = document.getElementById("form-status");

const listContainer = document.getElementById("admin-projects-list");
const emptyState = document.getElementById("admin-empty");

// Run once the page loads
document.addEventListener("DOMContentLoaded", loadProjects);

// ---------- Task 1: Fetch and render all projects ----------
async function loadProjects() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch projects");
    const projects = await res.json();
    renderAdminList(projects);
  } catch (err) {
    console.error(err);
    showStatus("Could not load projects from the server.", "error");
  }
}

// Build the "Projects" list with Edit / Delete buttons for each item
function renderAdminList(projects) {
  listContainer.innerHTML = "";

  if (!projects || projects.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  projects.forEach((project) => {
    const item = document.createElement("div");
    item.className = "admin-project-item";

    item.innerHTML = `
      <h4 class="item-title">${escapeHtml(project.title)}</h4>
      <div class="item-actions">
        <button class="badge-btn badge-edit" data-id="${project._id}">Edit</button>
        <button class="badge-btn badge-delete" data-id="${project._id}">Delete</button>
      </div>
      <p class="item-desc">${escapeHtml(project.description)}</p>
      <p class="item-tech">${(project.technologies || []).join(", ")}</p>
      ${project.link ? `<p class="item-link">${escapeHtml(project.link)}</p>` : ""}
    `;

    listContainer.appendChild(item);
  });

  // Wire up Edit / Delete buttons after they're rendered
  document.querySelectorAll(".badge-edit").forEach((btn) =>
    btn.addEventListener("click", () => startEdit(btn.dataset.id, projects))
  );
  document.querySelectorAll(".badge-delete").forEach((btn) =>
    btn.addEventListener("click", () => deleteProject(btn.dataset.id))
  );
}

// ---------- Task 2: Create or update a project ----------
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const payload = {
    title: titleField.value.trim(),
    description: descriptionField.value.trim(),
    // Split the comma-separated technologies string into a clean array
    technologies: technologiesField.value
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    link: linkField.value.trim(),
  };

  const id = projectIdField.value;
  const isEditing = Boolean(id);

  try {
    const res = await fetch(isEditing ? `${API_URL}/${id}` : API_URL, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Save failed");

    showStatus(isEditing ? "Project updated." : "Project added.", "success");
    resetForm();
    loadProjects();
  } catch (err) {
    console.error(err);
    showStatus("Something went wrong while saving the project.", "error");
  }
});

// ---------- Task 3: Load a project into the form for editing ----------
function startEdit(id, projects) {
  const project = projects.find((p) => p._id === id);
  if (!project) return;

  projectIdField.value = project._id;
  titleField.value = project.title;
  descriptionField.value = project.description;
  technologiesField.value = (project.technologies || []).join(", ");
  linkField.value = project.link || "";

  formTitle.textContent = "Update Project";
  saveBtn.textContent = "Save Project";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ---------- Task 4: Delete a project ----------
async function deleteProject(id) {
  const confirmed = confirm("Delete this project? This cannot be undone.");
  if (!confirmed) return;

  try {
    const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    if (!res.ok) throw new Error("Delete failed");

    showStatus("Project deleted.", "success");
    loadProjects();
  } catch (err) {
    console.error(err);
    showStatus("Could not delete the project.", "error");
  }
}

// ---------- Reset button clears the form back to "create" mode ----------
resetBtn.addEventListener("click", resetForm);

function resetForm() {
  form.reset();
  projectIdField.value = "";
  formTitle.textContent = "Add / Update Project";
  saveBtn.textContent = "Save Project";
}

// ---------- Small helpers ----------
function showStatus(message, type) {
  formStatus.textContent = message;
  formStatus.className = `form-status ${type}`;
  formStatus.hidden = false;
  setTimeout(() => (formStatus.hidden = true), 3000);
}

// Basic escaping so project text can't break the HTML structure
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
