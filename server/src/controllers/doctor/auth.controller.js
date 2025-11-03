import { ApiError, ApiResponse, asyncHandler } from '../utility/index.js';
import Doctor from '../../models/doctor.model.js';
import statusCode from '../../constants/statusCode.js';
import cookieOptions from '../../constants/cookieOptions.js';

const signupDoctor = asyncHandler(async (req, res) => {
    const {
        name,
        department,
        hospital,
        idCardNumber,
        workingHours,
        workingDays,
        email,
        phoneNumber,
        password,
    } = req?.body;

    if (
        !name ||
        !department ||
        !hospital ||
        !idCardNumber ||
        !workingHours ||
        !workingDays ||
        !email ||
        !phoneNumber ||
        !password
    ) {
        throw new ApiError(statusCode.BAD_REQUEST, 'All fields are required!');
    }

    const existingDoctor = await Doctor.findOne({
        $or: [{ email }, { phoneNumber }],
    });

    if (existingDoctor) {
        throw new ApiError(
            statusCode.CONFLICT,
            'Doctor already exists. Try different email, phone, or ID card.'
        );
    }

    const doctor = await Doctor.create({
        name,
        department,
        hospital,
        idCardNumber,
        workingHours,
        workingDays,
        email,
        phoneNumber,
        password,
    });

    return res.status(statusCode.CREATED).json(
        new ApiResponse(statusCode.CREATED, 'Doctor registered successfully.', {
            doctorId: doctor?._id,
            name: doctor?.name,
            department: doctor?.department,
        })
    );
});

const loginDoctor = asyncHandler(async (req, res) => {
    const { email, phoneNumber, password } = req?.body;

    if ((!email && !phoneNumber) || !password) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Email/Phone and password are required!');
    }

    const doctor = await Doctor.findOne({
        $or: [{ email }, { phoneNumber }],
    });

    if (!doctor) {
        throw new ApiError(statusCode.NOT_FOUND, 'Doctor not found!');
    }

    const isPasswordMatched = await doctor.comparePassword(password);
    if (!isPasswordMatched) {
        throw new ApiError(statusCode.UNAUTHORIZED, 'Incorrect password!');
    }

    const refreshToken = await doctor.generateAndUpdateRefreshToken(doctor?._id);
    const accessToken = await doctor.generateAccessTokenFromRefreshToken(refreshToken);

    if (!refreshToken || !accessToken) {
        throw new ApiError(statusCode.INTERNAL_SERVER_ERROR, 'Token generation failed.');
    }

    return res
        .status(statusCode.OK)
        .cookie('accessToken', accessToken, cookieOptions)
        .cookie('refreshToken', refreshToken, cookieOptions)
        .json(
            new ApiResponse(statusCode.OK, 'Doctor logged in successfully.', {
                name: doctor?.name,
                department: doctor?.department,
            })
        );
});

const logoutDoctor = asyncHandler(async (req, res) => {
    const doctor = await Doctor.findById(req?.doctorId);

    if (!doctor) {
        throw new ApiError(statusCode.NOT_FOUND, 'Doctor not found! Please login first.');
    }

    doctor.refreshToken = null;
    await doctor.save();

    return res
        .status(statusCode.OK)
        .cookie('accessToken', '', { ...cookieOptions, maxAge: 0 })
        .cookie('refreshToken', '', { ...cookieOptions, maxAge: 0 })
        .json(new ApiResponse(statusCode.OK, 'Doctor logged out successfully.'));
});

export { signupDoctor, loginDoctor, logoutDoctor };
