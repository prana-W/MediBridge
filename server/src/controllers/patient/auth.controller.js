import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import Patient from '../../models/patient.model.js';
import statusCode from '../../constants/statusCode.js';
import cookieOptions from '../../constants/cookieOptions.js';
import jwt from 'jsonwebtoken';

const signupPatient = asyncHandler(async (req, res) => {
    const {name, phoneNumber, password, state} = req?.body;

    if (!name || !phoneNumber || !password || !state) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const existingPatient = await Patient.findOne({
        $or: [{phoneNumber}],
    });

    if (existingPatient) {
        throw new ApiError(
            statusCode.CONFLICT,
            'Patient already exists. Try different phone number.'
        );
    }

    const patient = await Patient.create({
        name,
        phoneNumber,
        password,
        state,
    });

    return res.status(statusCode.CREATED).json(
        new ApiResponse(
            statusCode.CREATED,
            'Patient registered successfully.',
            {
                patientId: patient?._id,
                name: patient?.name,
                phoneNumber: patient?.phoneNumber,
            }
        )
    );
});

const loginPatient = asyncHandler(async (req, res) => {
    const {phoneNumber, password} = req?.body;

    if (!phoneNumber || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const patient = await Patient.findOne({
        $or: [{phoneNumber}],
    }).select('+password');

    if (!patient) {
        throw new ApiError(statusCode.NOT_FOUND, 'Patient not found!');
    }

    const isPasswordMatched = await patient.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ApiError(statusCode.UNAUTHORIZED, 'Incorrect password!');
    }

    const accessToken = jwt.sign(
        {
            _id: patient?._id,
        },
        process.env.ACCESS_TOKEN_SECRET
    );

    return res
        .status(statusCode.OK)
        .cookie('accessToken', accessToken, cookieOptions)
        .json(
            new ApiResponse(statusCode.OK, 'Patient logged in successfully.', {
                name: patient?.name,
                phoneNumber: patient?.phoneNumber,
            })
        );
});

const logoutPatient = asyncHandler(async (req, res) => {
    const patient = await Patient.findById(req?.patientId);

    if (!patient) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            'Patient not found! Please login first.'
        );
    }

    patient.refreshToken = null;
    await patient.save();

    return res
        .status(statusCode.OK)
        .cookie('accessToken', '', {...cookieOptions, maxAge: 0})
        .cookie('refreshToken', '', {...cookieOptions, maxAge: 0})
        .json(
            new ApiResponse(statusCode.OK, 'Patient logged out successfully.')
        );
});

export {signupPatient, loginPatient, logoutPatient};
