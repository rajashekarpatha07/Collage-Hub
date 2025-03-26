import express from "express";
import { registerFaculty } from "../controllers/faculty.controller.js";
// import { verifyFaculty } from "../middlewares/auth.js";

const router = express.Router();    

router.post("/register", registerFaculty);
// router.post("/login", facultyLogin);
//Secure routes 
// router.post("/logout", verifyFaculty, facultyLogout);

export default router;