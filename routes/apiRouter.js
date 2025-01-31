import express from "express";
import axios from "axios";

const router = express.Router();

console.log("apiRouter.js loaded");

// Middleware to serve static files
router.use(express.static("public"));

// Route to render the fetchapi project page
router.get("/projects/fetchapi", (req, res) => {
  res.render("projects/fetchapi", {
    title: "Marek Cieloch - Software Engineer",
  });
});

// Route to handle both GET and POST requests for the boredAPI project
router
  .route("/projects/boredAPI")
  .get(async (req, res) => {
    try {
      const response = await axios.get(
        "https://bored.api.lewagon.com/api/activity/"
      );
      const result = response.data;
      res.render("projects/boredAPI.ejs", { data: result });
    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("projects/boredAPI.ejs", { error: error.message });
    }
  })
  .post(async (req, res) => {
    try {
      const { type, participants } = req.body;
      const apiUrl = `https://bored.api.lewagon.com/api/activity?type=${type}&participants=${participants}`;
      const response = await axios.get(apiUrl);
      const result = response.data;

      if (result.error) {
        res.render("projects/boredAPI.ejs", {
          error: "No activities match your criteria.",
        });
      } else {
        res.render("projects/boredAPI.ejs", { data: result });
      }
    } catch (error) {
      console.error("Failed to make request:", error.message);
      res.render("projects/boredAPI.ejs", {
        error: "An error occurred. Please try again later.",
      });
    }
  });

export default router;
