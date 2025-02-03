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

const API_URL = "https://secrets-api.appbrewery.com/";

//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "riku1337";
const yourPassword = "1337riku";
const yourAPIKey = "d10913fe-1227-4c7a-ac96-1223cc8d0220";
const yourBearerToken = "2ba8595d-82b6-47a4-a213-3178c7814c89";

router.get("/projects/secretsAPI", (req, res) => {
  res.render("projects/secretsAPI.ejs", { content: "API Response." });
});

router.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}` + `random`);
    const result = JSON.stringify(response.data);

    res.render("projects/secretsAPI.ejs", { content: result });
  } catch (error) {
    console.error(`Failed to make a request: ${error}`);
  }
});

router.get("/basicAuth", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}` + `all`, {
      auth: {
        username: yourUsername,
        password: yourPassword,
      },
    });
    const result = JSON.stringify(response.data);
    res.render("projects/secretsAPI.ejs", { content: result });
  } catch (error) {
    console.error(`Failed to make a request: ${error}`);
  }
});

router.get("/apiKey", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}` + `filter`, {
      params: {
        apiKey: yourAPIKey,
        score: "5",
      },
    });
    const result = JSON.stringify(response.data);
    res.render("projects/secretsAPI.ejs", { content: result });
  } catch (error) {
    console.error(`Failed to make a request: ${error}`);
  }
});

router.get("/bearerToken", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}` + `secrets/42`, {
      headers: { Authorization: `Bearer ${yourBearerToken}` },
    });
    const result = JSON.stringify(response.data);
    res.render("projects/secretsAPI.ejs", { content: result });
  } catch (error) {
    console.error(`Failed to make a request: ${error}`);
  }
});

export default router;
