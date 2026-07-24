/* =============================================================
   PROJECTS PAGE LOGIC (Interface 3)
   Fetches all projects from the backend and renders them as
   cards. Data comes from MongoDB via the Express API.
============================================================== */

// Base URL of the backend API — change if your server runs elsewhere
const API_URL = "http://localhost:5000/api/projects";

const grid = document.getElementById("projects-grid");
const emptyState = document.getElementById("projects-empty");
const errorState = document.getElementById("projects-error");

// Run once the page loads
document.addEventListener("DOMContentLoaded", loadProjects);

// ---------- Task: fetch projects from the database ----------
async function loadProjects() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Failed to fetch projects");

    const projects = await res.json();
    renderProjects(projects);
  } catch (err) {
    console.error(err);
    errorState.hidden = false;
  }
}

// ---------- Task: render each project as a card ----------
function renderProjects(projects) {
  grid.innerHTML = "";

  if (!projects || projects.length === 0) {
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  projects.forEach((project) => {
    const card = document.createElement("div");
    card.className = "project-card";

    // Build the technology tag list
    const techTags = (project.technologies || [])
      .map((tech) => `<span class="tech-tag">${escapeHtml(tech)}</span>`)
      .join("");

    // "View project" link only shows if a GitHub link was provided
    const viewLink = project.link
      ? `<a class="view-project-link" href="${escapeHtml(project.link)}" target="_blank" rel="noopener noreferrer">View project</a>`
      : "";

    card.innerHTML = `
      <h3>${escapeHtml(project.title)}</h3>
      <p>${escapeHtml(project.description)}</p>
      <div class="tech-tags">${techTags}</div>
      ${viewLink}
    `;

    grid.appendChild(card);
  });
}

// Basic escaping so project text can't break the HTML structure
function escapeHtml(str = "") {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
