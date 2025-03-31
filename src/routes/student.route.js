import express from "express";
import { registerStudent, studentLogin, stundetLogout, getquestionpapers, getnotes, getNotices } from "../controllers/student.controller.js";
import { verifyStudent } from "../middlewares/auth.js";




const router = express.Router();


router.post("/register", registerStudent);
router.post("/login", studentLogin);
//Secure routes
router.post("/logout", verifyStudent, stundetLogout);
router.get("/getnotes", verifyStudent, getnotes);
router.get("/getquestionpapers", verifyStudent, getquestionpapers);
router.get("/getnotices", verifyStudent, getNotices);

export default router;