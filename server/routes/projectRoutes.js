// =============================================================
// projectRoutes.js
// CRUD routes for /api/projects
// - GET    /api/projects       -> Interface 3 (Projects page) reads all
// - POST   /api/projects       -> Interface 4 (Admin) adds a project
// - PUT    /api/projects/:id   -> Interface 4 (Admin) updates a project
// - DELETE /api/projects/:id   -> Interface 4 (Admin) deletes a project
// =============================================================

const express = require("express");
const router = express.Router();
const Project = require("../models/Project");

// Task: Get all projects (newest first) — feeds the Projects page cards
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch projects", error: err.message });
  }
});

// Task: Get a single project by id — used when loading a project into the Admin edit form
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch project", error: err.message });
  }
});

// Task: Create a new project — Admin "Save Project" (create mode)
router.post("/", async (req, res) => {
  try {
    const { title, description, technologies, link } = req.body;
    const newProject = new Project({ title, description, technologies, link });
    const saved = await newProject.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: "Failed to create project", error: err.message });
  }
});

// Task: Update an existing project — Admin "Save Project" (edit mode)
router.put("/:id", async (req, res) => {
  try {
    const { title, description, technologies, link } = req.body;
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      { title, description, technologies, link },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: "Failed to update project", error: err.message });
  }
});

// Task: Delete a project — Admin "Delete" button
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete project", error: err.message });
  }
});

module.exports = router;
