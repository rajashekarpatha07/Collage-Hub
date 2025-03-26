import { Faculty } from "../models/faculty.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/AsyncHanders.js";
import jwt from "jsonwebtoken";

export const verifyStudent = asyncHandler(async (req, res, next) => {
    try {
        const Token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
        if(!Token) {
            throw new ApiError(401, 'Unauthorized');
        }
        const DecodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
        const student = await Student.findById(DecodedToken?.id).select('-password -refreshtoken');
        if(!student) {
            throw new ApiError(401, 'Unauthorized');
        }
        req.student = student;

        next();

    } catch (error) {
        throw new ApiError(401,error?.message, 'Unauthorized');
    }
});

export const verifyFaculty = asyncHandler(async (req, res, next) => {
    try {
        const Token = req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '');
        if(!Token) {
            throw new ApiError(401, 'Unauthorized');
        }

        const DecodedToken = jwt.verify(Token, process.env.ACCESS_TOKEN_SECRET);
        const faculty = await Faculty.findById(DecodedToken?.id).select('-password -refreshtoken');
        if(!faculty) {
            throw new ApiError(401, 'Unauthorized');
        }
        req.faculty = faculty;

        next();
    } catch (error) {
        throw new ApiError(401,error?.message, 'Unauthorized');   
    }
});