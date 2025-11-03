import { ApiError, ApiResponse, asyncHandler } from '../utility/index.js';
import Hospital from '../models/hospital.model.js';
import statusCode from '../constants/statusCode.js';

//Todo: Only to be returned to logged in patient
const getHospitalsByState = asyncHandler(async (req, res) => {
    const { state } = req.params;

    if (!state) {
        throw new ApiError(statusCode.BAD_REQUEST, 'State parameter is required');
    }

    const hospitals = await Hospital.find({
        state: state.toLowerCase().trim(),
    }).select('-__v -createdAt -updatedAt');

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

// Todo: Only to be added by the admin of the hospital
const addHospital = asyncHandler(async (req, res) => {
    const { name, state } = req.body;

    if (!name || !state) {
        throw new ApiError(
            statusCode.BAD_REQUEST,
            'Hospital name and state are required.'
        );
    }

    const existingHospital = await Hospital.findOne({
        name: name.toLowerCase().trim(),
        state: state.toLowerCase().trim(),
    });

    if (existingHospital) {
        throw new ApiError(
            statusCode.CONFLICT,
            'Hospital with this name already exists in the given state.'
        );
    }

    const hospital = await Hospital.create({
        name: name.toLowerCase().trim(),
        state: state.toLowerCase().trim(),
    });

    return res
        .status(statusCode.CREATED)
        .json(
            new ApiResponse(
                statusCode.CREATED,
                'Hospital added successfully.',
                hospital
            )
        );
});

export { getHospitalsByState, addHospital };
