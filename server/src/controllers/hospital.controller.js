import {ApiError, ApiResponse, asyncHandler} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import hospitalData from '../constants/hospitalData.js';
import Patient from '../models/patient.model.js';
import Hospital from '../models/hospital.model.js';

//Todo: Only to be returned to logged in patient
const getHospitalsByState = asyncHandler(async (req, res) => {
    const patientId = req?.userId;

    const patient = await Patient.findById(patientId);

    if (!patient) {
        throw new ApiError(statusCode.BAD_REQUEST, 'Patient not found!');
    }

    const state = patient?.state;

    if (!state) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'State parameter is required'
        );
    }

    const hospitals = hospitalData.filter(
        (h) => h.state.toLowerCase() === state.toLowerCase()
    );

    if (!hospitals.length) {
        throw new ApiError(
            statusCode.NOT_FOUND,
            `No hospitals found for state "${state}"`
        );
    }

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'Hospitals fetched successfully.',
                hospitals
            )
        );
});

const getAllHospital = asyncHandler(async (req, res) => {
    const hospitals = hospitalData;

    return res
        .status(statusCode.OK)
        .json(
            new ApiResponse(
                statusCode.OK,
                'Hospitals fetched successfully.',
                hospitals
            )
        );
});

export {getHospitalsByState, getAllHospital};
