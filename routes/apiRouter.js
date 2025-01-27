import express from "express";

const router = express.Router();

console.log("apiRouter.js loaded");

// READ: Route to get all employees and render the employee list
router.get("/projects/fetchapi", (req, res) => {
  res.render("projects/fetchapi", {
    title: "Marek Cieloch - Software Engineer",
  });
});
export default router;
