import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import courseRoutes from "./routes/courseRoutes.js";
import userDataRoutes from "./routes/userDataRoutes.js";
import studentScheduleRoutes from "./routes/studentScheduleRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import submissionRoutes from "./routes/submissionRoutes.js";
import gradesRoutes from "./routes/gradesRoutes.js";
import questionRoutes from "./routes/questionRoutes.js";
import examMarksRoutes from "./routes/examMarksRoutes.js";

// Load environment variables from .env file
dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const URL = process.env.MONGODB_URI;

app.use(bodyParser.json({ limit: "50mb" })); // Increase limit as needed

// Middleware my changes ----abhi
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
); // Enable CORS
app.use(express.json()); // Parse JSON bodies
mongoose
  .connect(URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/", courseRoutes);
app.use("/api/usersData", userDataRoutes);
app.use("/api/student_schedule", studentScheduleRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/grades", gradesRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/exam_marks", examMarksRoutes);
  

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
