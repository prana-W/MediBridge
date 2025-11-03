import Doctor from '../../models/doctor.model.js';
import { asyncHandler, ApiError, ApiResponse } from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';

const getDoctors = asyncHandler(async (req, res) => {
    const { hospital, department } = req.body;

    // Validate input
    if (!hospital || !department) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Both hospital and department are required'
        );
    }

    const doctors = await Doctor.find({
        hospital: { $regex: new RegExp(`^${hospital}$`, 'i') },
        department: department.toLowerCase(),
    }).select('-password -refreshToken');

    if (!doctors.length) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            `No doctors found in ${department} department at ${hospital}`
        );
    }

    return res
        .status(statusCode.OK)
        .json(new ApiResponse(statusCode.OK, doctors, 'Doctors fetched successfully'));
});

export default getDoctors;
