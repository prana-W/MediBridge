import Doctor from '../../models/doctor.model.js';
import {asyncHandler, ApiError, ApiResponse} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';

const getSlots = asyncHandler(async (req, res) => {
    const {hospital, department} = req.body;

    // Validate input
    if (!hospital || !department) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Both hospital and department are required'
        );
    }

    const doctors = await Doctor.find({
        hospital: {$regex: new RegExp(`^${hospital}$`, 'i')},
        department: department.toLowerCase(),
    }).select('-password -refreshToken');

    if (!doctors.length) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            `No doctors found in ${department} department at ${hospital}`
        );
    }

    // Process doctors to check and return available slots
    const doctorsWithSlots = doctors.map((doctor) => {
        // Check and reset slots if date has changed
        doctor.checkAndResetSlots();

        const availableSlots = 10 - doctor.currSlot;

        return {
            _id: doctor._id,
            name: doctor.name,
            hospital: doctor.hospital,
            department: doctor.department,
            currentSlot: doctor.currSlot,
            availableSlots: availableSlots,
            isFullyBooked: doctor.currSlot >= 10,
        };
    });

    // Save all doctors if any slots were reset
    await Promise.all(
        doctors.map((doctor) => {
            if (doctor.isModified()) {
                return doctor.save();
            }
            return Promise.resolve();
        })
    );

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'Doctors fetched successfully',
                doctorsWithSlots
            )
        );
});

export default getSlots;
