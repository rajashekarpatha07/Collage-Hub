import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHanders.js";
import  { Student } from "../models/student.model.js";

const generateTokenandAccesstoken = async (studentId) => {
    try {
        const student = await Student.findById(studentId);
        const accessToken = await student.generateAccessToken();
        const refreshToken = await student.generateRefreshToken();

        student.refreshtoken = refreshToken;
        await student.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, 'Token generation failed');
    }
};


const registerStudent = asyncHandler(async (req, res) => {
    const { rollnumber, name, branch, sem, phonenumber, email, password } = req.body;

    if([rollnumber, name, branch, sem, phonenumber, email, password].some((field)=>{
        field?.trim() === ''
    })) {
        throw new ApiError(400, 'All fields are required');
    }

    const existingStudent = await Student.findOne({ rollnumber });
    if(existingStudent) {
        throw new ApiError(400, 'Student already exists');
    }

    const student = await Student.create({
        rollnumber, name, branch, sem, phonenumber, email, password
    });

    const createdStudent = await Student.findById(student._id).select('-password -refreshtoken');


    if(!student) {
        throw new ApiError(500, 'Student not created');
    }

    return res
        .status(201)
        .json(new ApiResponse(201, createdStudent, 'Student created successfully'));
});

const studentLogin = asyncHandler(async (req, res) => {
    const { rollnumber , password } = req.body;
    if(!rollnumber || !password) {
        throw new ApiError(400, 'Rollnumber and password are required to Login');
    }
    
    const student = await Student.findOne({ rollnumber })
    if(!student) {
        throw new ApiError(400, 'The user Doesn\'t exist register first');
    }

    const isPassowrdMatch = await student.isPassowordMatch(password);
    if(!isPassowrdMatch) {
        throw new ApiError(400, 'Invalid password');
    }

    const { accessToken, refreshToken } = await generateTokenandAccesstoken(student._id);
    const Loggedstudent = await Student.findById(student._id).select('-password -refreshtoken -accesstoken');

    const options = {
        httpOnly: true,
        secure:true
    }

    return res
        .status(200)
        .cookie('refreshToken', refreshToken, options)
        .cookie('accessToken', accessToken, options)
        .json(new ApiResponse(200, { refreshToken, Loggedstudent }, 'Stundent Logged in successfully'));
});

export { registerStudent, studentLogin };