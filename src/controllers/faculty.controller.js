import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHanders.js";
import  { Faculty } from "../models/faculty.model.js";

const registerFaculty = asyncHandler(async (req, res) => {
    const { name, branch, phoneNumber, email, password } = req.body;

    if([name, branch,phoneNumber, email, password].some((field)=>{
        field?.trim() === ''
    })) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingFaculty = await Faculty.findOne({ email });
    if(existingFaculty) {
        throw new ApiError(400, 'Faculy already exists');
    }

    const faculty = await Faculty.create({
        name, branch,phoneNumber, email, password
    });

    const createdFaculty = await Faculty.findById(faculty._id).select('-password -refreshtoken');


    if(!faculty) {
        throw new ApiError(500, 'faculty not created');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdFaculty, 'Faculty created successfully'));
});

export { registerFaculty };
