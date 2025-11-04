import {ApiError, ApiResponse, asyncHandler} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import Appointment from '../models/appointment.model.js';

// Put request at /something/:appointmentId
const finalizeAppointment = asyncHandler(async (req, res) => {
    const {appointmentId} = req.params;
    const {nextCheckup, medications, remarks} = req.body;

    // 🔍 Find appointment
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
        throw new ApiError(statusCode.NOT_FOUND, 'Appointment not found');
    }

    if (
        !nextCheckup &&
        (!medications || medications.length === 0) &&
        !remarks
    ) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'At least one field (nextCheckup, medications, or remarks) is required'
        );
    }

    appointment.nextCheckup = nextCheckup || appointment.nextCheckup;
    appointment.remarks = remarks || appointment.remarks;
    appointment.isCheckupComplete = true;

    appointment.checkedAt = new Date();

    await appointment.save();

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'Appointment finalized successfully',
                appointment
            )
        );
});

const getAllAppointments = asyncHandler(async (req, res) => {

    const patientId = req?.userId;

    // console.log(patientId);
    const appointments = await Appointment.find({patient: patientId});

    if (!appointments) {
        throw new ApiError(statusCode.NOT_FOUND, 'No Appointment was found!');
    }

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'All appointments was fetched!',
                appointments
            )
        );
});

export {finalizeAppointment, getAllAppointments};
