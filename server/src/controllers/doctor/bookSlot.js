import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import statusCode from '../../constants/statusCode.js';
import Doctor from '../../models/doctor.model.js';
import Appointment from '../../models/appointment.model.js';

const bookSlot = asyncHandler(async (req, res) => {
    const {doctorId, slotNumber } = req.body;
    const patientId = req?.userId;

    if (!doctorId || slotNumber === undefined) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Doctor ID, Patient ID, and slot number are required'
        );
    }

    if (slotNumber < 0 || slotNumber >= 10) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Invalid slot number. Must be between 0 and 9'
        );
    }

    const doctor = await Doctor.findById(doctorId).select(
        '-password -refreshToken'
    );
    if (!doctor) {
        throw new ApiError(statusCode.NOT_FOUND, 'Doctor not found');
    }

    doctor.checkAndResetSlots();

    if (slotNumber < doctor.currSlot) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            `Slot ${slotNumber + 1} is already booked. Please choose a different slot.`
        );
    }

    if (doctor.currSlot >= 10) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'All slots are booked for today. Please try tomorrow.'
        );
    }

    doctor.currSlot += 1;
    await doctor.save();

    const remainingSlots = 10 - doctor.currSlot;

    const appointment = await Appointment.create({
        patient: patientId,
        doctor: doctorId,
        isCheckupComplete: false,
        nextCheckup: new Date(),
        remarks: `Slot ${slotNumber + 1} booked for ${doctor.name}`,
    });

    return res.status(statusCode.OK).json(
        new ApiResponse(statusCode.OK, 'Slot booked successfully', {
            doctorId: doctor._id,
            doctorName: doctor.name,
            patientId,
            appointmentId: appointment._id,
            bookedSlotNumber: slotNumber,
            bookedTime: `${8 + slotNumber}:00`,
            date: doctor.currDate,
            currentSlot: doctor.currSlot,
            remainingSlots,
        })
    );
});

export {bookSlot};
