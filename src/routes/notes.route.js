import express from "express";
import { addNote } from "../controllers/notes.controller.js";
import { verifyFaculty } from "../middlewares/auth.js";
import { upload } from "../middlewares/multer.middleware.js";


const Router = express.Router();

Router.post("/addnotes", verifyFaculty,upload, addNote);


export default Router;
