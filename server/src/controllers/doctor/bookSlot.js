import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';
import Doctor from '../../models/doctor.model.js';

const bookSlot = asyncHandler(async (req, res) => {
    const {doctorId, slotNumber} = req.body;

    // Validate input
    if (!doctorId || slotNumber === undefined) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Doctor ID and slot number are required'
        );
    }

    // Validate slot number
    if (slotNumber < 0 || slotNumber >= 10) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Invalid slot number. Must be between 0 and 9'
        );
    }

    // Find doctor
    const doctor = await Doctor.findById(doctorId).select(
        '-password -refreshToken'
    );

    if (!doctor) {
        throw new ApiError(statusCode.NOT_FOUND, 'Doctor not found');
    }

    // Check and reset slots if date has changed
    doctor.checkAndResetSlots();

    // Check if the requested slot is already taken
    if (slotNumber < doctor.currSlot) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            `Slot ${slotNumber + 1} is already booked. Please choose a different slot.`
        );
    }

    // Check if slots are full
    if (doctor.currSlot >= 10) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'All slots are booked for today. Please try tomorrow.'
        );
    }

    // Book the slot by incrementing currSlot
    doctor.currSlot += 1;
    await doctor.save();

    const remainingSlots = 10 - doctor.currSlot;

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            `Slot booked successfully with ${doctor.name}`,
            {
                doctorId: doctor._id,
                doctorName: doctor.name,
                currentSlot: doctor.currSlot,
                remainingSlots: remainingSlots,
                bookedSlotNumber: slotNumber,
                bookedTime: `${8 + slotNumber}:00`,
                date: doctor.currDate,
            }
        )
    );
});

export {bookSlot};
