import { ApiError, ApiResponse, asyncHandler } from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import hospitalData from '../constants/hospitalData.js';

//Todo: Only to be returned to logged in patient
const getHospitalsByState = asyncHandler(async (req, res) => {
    const { state } = req.params;

    if (!state) {
        throw new ApiError(statusCode.BAD_REQUEST, 'State parameter is required');
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


export { getHospitalsByState };
