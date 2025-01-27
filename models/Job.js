import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  company: String,
  position: String,
  dateApplied: Date,
  status: String,
});

const Job = mongoose.model("Job", jobSchema);
export default Job;
