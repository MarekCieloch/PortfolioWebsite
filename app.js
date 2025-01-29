import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import nodemailer from "nodemailer";
import methodOverride from "method-override";

// Import routes
import indexRoutes from "./routes/index.js";
import projectsRoutes from "./routes/projects.js";
import employeeRoutes from "./routes/employees.js";
import apiRouting from "./routes/apiRouter.js";

// Load environment variables
dotenv.config();

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const app = express();

// Get __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", [
  path.join(__dirname, "views"),
  path.join(__dirname, "views/projects"),
]);

// Global partials for all views
app.locals.header = "partials/header";
app.locals.footer = "partials/footer";

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse form data
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Use routes
app.use("/", indexRoutes);
app.use("/", projectsRoutes);
app.use("/", employeeRoutes);
app.use("/", apiRouting);

// Contact Form - Email Sending
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      replyTo: email,
      to: process.env.EMAIL_USERME,
      subject: `New Contact Form Submission from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await transporter.sendMail(mailOptions);
    res.send(
      '<h1>Email Sent Successfully!</h1><a href="/contact">Back to Contact</a>'
    );
  } catch (error) {
    console.error("Error sending email:", error);
    res
      .status(500)
      .send(
        '<h1>Error Sending Email</h1><a href="/contact">Back to Contact</a>'
      );
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
