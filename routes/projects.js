import { Router } from "express";
import Job from "../models/Job.js"; // Ensure the Job model is imported

console.log("project.js LOADED");
const router = Router();

// Render Job Tracker directly
router.get("/projects/job-tracker", async (req, res) => {
  try {
    const jobs = await Job.find(); // Fetch all jobs from the database
    res.render("projects/jobTracker", { title: "Job Tracker", jobs }); // Pass 'jobs' to EJS
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Job Tracker: Add a new job
router.post("/projects/job-tracker/add", async (req, res) => {
  try {
    const { company, position, dateApplied, status } = req.body;
    const newJob = new Job({ company, position, dateApplied, status });
    await newJob.save();
    res.redirect("/projects/job-tracker");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding job");
  }
});

// Render Edit Job Form
router.get("/projects/job-tracker/edit/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the job ID from the URL
    const job = await Job.findById(id); // Fetch job details from the database
    if (!job) {
      return res.status(404).send("Job not found");
    }
    res.render("projects/editJob", { title: "Edit Job", job }); // Render the edit page
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Handle Edit Job Submission
router.post("/projects/job-tracker/edit/:id", async (req, res) => {
  try {
    const { id } = req.params; // Extract the job ID from the URL
    const { company, position, dateApplied, status } = req.body; // Extract form data
    await Job.findByIdAndUpdate(id, { company, position, dateApplied, status }); // Update job in database
    res.redirect("/projects/job-tracker"); // Redirect back to job tracker
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating job");
  }
});

// Job Tracker: Update job status
router.post("/projects/job-tracker/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Job.findByIdAndUpdate(id, { status });
    res.redirect("/projects/job-tracker");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating job status");
  }
});

// Job Tracker: Delete a job
router.post("/projects/job-tracker/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Job.findByIdAndDelete(id);
    res.redirect("/projects/job-tracker");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting job");
  }
});

export default router;
