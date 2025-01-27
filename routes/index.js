import express from "express";

const router = express.Router();
console.log("index.js LOADED");
// Render Projects Hub
router.get("/projects", (req, res) => {
  res.render("projects", { title: "Projects Page" });
});
// Homepage route
router.get("/", (req, res) => {
  res.render("index", { title: "Marek Cieloch - Software Engineer" });
});

// Index route (optional duplicate of the homepage)
router.get("/index", (req, res) => {
  res.render("index", { title: "Marek Cieloch - Software Engineer" });
});

// Contact page
router.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact Me" });
});

export default router;
