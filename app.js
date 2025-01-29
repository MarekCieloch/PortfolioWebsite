import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import mongoose from "mongoose";
import indexRoutes from "./routes/index.js";
import projectsRoutes from "./routes/projects.js";
import employeeRoutes from "./routes/employees.js";
import { v4 as uuidv4 } from "uuid";
import methodOverride from "method-override";
import apiRouting from "./routes/apiRouter.js";

dotenv.config(); // Load environment variables

mongoose.connect(
  "mongodb+srv://access:XG9Agc6GQcjLDgYT@portfoliodatabase.2xetk.mongodb.net/?retryWrites=true&w=majority&appName=PortfolioDatabase",
  {
    serverSelectionTimeoutMS: 10000, // Optional: Avoid indefinite timeouts
  }
);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Failed to connect to MongoDB", err);
});

const app = express();

// Determine __dirname with ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Make paths available to EJS files globally
app.locals.partials = {
  header: path.join(__dirname, "views/partials/header.ejs"),
  footer: path.join(__dirname, "views/partials/footer.ejs"),
};

app.use(methodOverride("_method"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  res.locals.header = "public/components/header";
  res.locals.footer = "public/components/footer";
  next();
});

// Use routes 2321
app.use("/", projectsRoutes); // Project-specific routes
app.use("/", employeeRoutes); // General routes
app.use("/", apiRouting); // General routes
app.use("/", indexRoutes); // General routes

// Route to handle contact form submission
app.post("/send-email", async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Configure Nodemailer for Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail", // Use Gmail service
      auth: {
        user: process.env.EMAIL_USER, // Your Gmail address
        pass: process.env.EMAIL_PASS, // Your App Password or Gmail password
      },
    });

    // Email options
    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`, // Your Gmail address as sender
      replyTo: email, // User's email
      to: process.env.EMAIL_USERME, // Your Gmail address as receiver
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
    };

    // Send the email
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
