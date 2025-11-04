import {ApiError, ApiResponse, asyncHandler} from '../../utility/index.js';
import Appointment from '../../models/appointment.model.js';
import statusCode from '../../constants/statusCode.js';

const getAllAppointments = asyncHandler(async (req, res) => {
    const doctorId = req?._id;

    const appointments = await Appointment.find({doctor: doctorId});

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

export {getAllAppointments};
