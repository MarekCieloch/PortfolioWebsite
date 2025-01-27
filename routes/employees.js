import express from "express";
import Employee from "../models/Employees.js";

const router = express.Router();

console.log("employees.js loaded");

// READ: Route to get all employees and render the employee list
router.get("/projects/employees", async (req, res) => {
  try {
    const employees = await Employee.find();
    res.render("projects/employeeDatabase", { employees }); // Pass employees to the EJS template
  } catch (error) {
    res.status(500).send("Error fetching employees: " + error.message);
  }
});

// CREATE: Route to render the form for creating a new employee
router.get("/projects/employees/new", (req, res) => {
  res.render("projects/editEmployee", { employee: null }); // Render a blank form for creating a new employee
});

// CREATE: Route to create a new employee
router.post("/projects/employees", async (req, res) => {
  try {
    const { fullName, dateOfBirth, jobTitle, email, phone } = req.body;

    // Create a new employee instance
    const newEmployee = new Employee({
      fullName,
      dateOfBirth,
      jobTitle,
      email,
      phone,
    });

    // Save the employee to the database
    await newEmployee.save();

    // Redirect back to the employee list
    res.redirect("/projects/employees");
  } catch (error) {
    res.status(500).send("Error creating employee: " + error.message);
  }
});

// READ: Route to render the form for editing an existing employee
router.get("/projects/employees/edit/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);

    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    res.render("projects/editEmployee", { employee }); // Pass the employee data to the EJS form
  } catch (error) {
    res.status(500).send("Error fetching employee: " + error.message);
  }
});

// UPDATE: Route to update an employee by ID
router.put("/projects/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, dateOfBirth, jobTitle, email, phone } = req.body;

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { fullName, dateOfBirth, jobTitle, email, phone },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!updatedEmployee) {
      return res.status(404).send("Employee not found");
    }

    // Redirect back to the employee list
    res.redirect("/projects/employees");
  } catch (error) {
    res.status(500).send("Error updating employee: " + error.message);
  }
});

// Job Tracker: Delete an employee
router.post("/projects/employees/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Employee.findByIdAndDelete(id);
    res.redirect("/projects/employees");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting employee");
  }
});

export default router;
