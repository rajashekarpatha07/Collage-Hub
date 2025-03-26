import express from "express";
import { registerStudent, studentLogin, stundetLogout } from "../controllers/student.controller.js";
import { verifyStudent } from "../middlewares/auth.js";


const router = express.Router();


router.post("/register", registerStudent);
router.post("/login", studentLogin);
//Secure routes
router.post("/logout", verifyStudent, stundetLogout);

export default router;