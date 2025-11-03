import { ApiError, ApiResponse, asyncHandler } from '../../utility/index.js';
import Patient from '../../models/patient.model.js';
import statusCode from '../../constants/statusCode.js';
import cookieOptions from '../../constants/cookieOptions.js';

const signupPatient = asyncHandler(async (req, res) => {
    const { name, phoneNumber, aadharNumber, password } = req?.body;

    if (!name || !phoneNumber || !aadharNumber || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const existingPatient = await Patient.findOne({
        $or: [{ phoneNumber }, { aadharNumber }],
    });

    if (existingPatient) {
        throw new ApiError(
            statusCode.CONFLICT,
            'Patient already exists. Try different phone number or Aadhaar.'
        );
    }

    const patient = await Patient.create({
        name,
        phoneNumber,
        aadharNumber,
        password,
    });

    return res.status(statusCode.CREATED).json(
        new ApiResponse(statusCode.CREATED, 'Patient registered successfully.', {
            patientId: patient?._id,
            name: patient?.name,
            phoneNumber: patient?.phoneNumber,
        })
    );
});

const loginPatient = asyncHandler(async (req, res) => {
    const { phoneNumber, aadharNumber, password } = req?.body;

    if ((!phoneNumber && !aadharNumber) || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const patient = await Patient.findOne({
        $or: [{ phoneNumber }, { aadharNumber }],
    });

    if (!patient) {
        throw new ApiError(statusCode.NOT_FOUND, 'Patient not found!');
    }

    const isPasswordMatched = await patient.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ApiError(statusCode.UNAUTHORIZED, 'Incorrect password!');
    }

    const refreshToken = await patient.generateAndUpdateRefreshToken(patient?._id);
    const accessToken = await patient.generateAccessTokenFromRefreshToken(refreshToken);

    if (!refreshToken || !accessToken) {
        throw new ApiError(statusCode.INTERNAL_SERVER_ERROR, 'Token generation failed.');
    }

    return res
        .status(statusCode.OK)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
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
        throw new ApiError(statusCode.NOT_FOUND, 'Patient not found! Please login first.');
    }

    patient.refreshToken = null;
    await patient.save();

    return res
        .status(statusCode.OK)
        .cookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
        .cookie('refreshToken', '', { ...cookieOptions, maxAge: 0 })
        .json(new ApiResponse(statusCode.OK, 'Patient logged out successfully.'));
});

export { signupPatient, loginPatient, logoutPatient };
