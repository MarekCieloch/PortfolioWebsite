import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const employeesSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: uuidv4, // Automatic generation of UUID by default
  },
  fullName: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  jobTitle: { type: String, required: true },
  dateEmployed: { type: Date, default: Date.now },
  email: { type: String, required: true },
  phone: { type: String, required: true },
});

const Employee = mongoose.model("Employee", employeesSchema);
export default Employee;
