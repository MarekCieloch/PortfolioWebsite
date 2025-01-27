import mongoose from "mongoose";

const employeesSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
    required: true,
    default: () => uuid4v(), // Automatic generation of UUID by default
  },
  fullName: String,
  dateOfBirth: Date,
  jobTitle: String,
  dateEmployed: Date,
  email: String,
  phone: String,
});

const Employee = mongoose.model("Employee", employeesSchema);
export default Employee;
