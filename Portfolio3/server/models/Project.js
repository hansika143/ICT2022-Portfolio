// =============================================================
// Project.js
// Mongoose schema for a portfolio project.
// Fields match the Admin form in the PDF:
// Project Title, Description, Technologies (comma separated), Project Link
// =============================================================

const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    // Stored as an array in the database even though the Admin form
    // takes a comma-separated string — we split it before saving.
    technologies: {
      type: [String],
      default: [],
    },
    // Optional GitHub / live project link, used for "View project" on the Projects page
    link: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("Project", projectSchema);
