import {ApiError} from '../utils/ApiError.js';
import { Notes } from '../models/notes.model.js';
import { UploadOnCloudinary } from '../utils/Cloudinary.js';
import {asyncHandler} from '../utils/AsyncHanders.js';
import {ApiResponse} from '../utils/ApiResponse.js';

const addNote = asyncHandler(async (req, res) => {
    try {
        const { title, description, subject, branch, sem, unit } = req.body;
        
        const notespath = req.files?.notes[0]?.path;

        if (!notespath) {
            return ApiError.badRequest(res, "File not provided");
        }

        const notesfileurl = await UploadOnCloudinary(notespath);
        if (!notesfileurl) {
            return ApiError.badRequest(res, "File upload failed");
        }

        // Create the note after successful upload
        const note = await Notes.create({
            title,
            description,
            subject,
            branch,
            sem,
            unit,
            fileUrl: notesfileurl.secure_url,
            uploadedBy: req.faculty.name,
        });

        return res.status(201).json(new ApiResponse(201, note, "Note added successfully"));
    } catch (error) {
        console.error("Error adding note:", error);
        return res.status(500).json(new ApiResponse(500, null, "Internal Server Error", error.message));
    }
});

export { addNote };
