import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import studentRoutes from "./src/routes/student.route.js";
import facultyRoutes from "./src/routes/faculty.route.js";
import notesRoutes from "./src/routes/notes.route.js";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
app.use(express.json({
    limit: "16kb"
}));
app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/faculty", facultyRoutes);   
app.use("/api/v1/notes", notesRoutes);

export default app;