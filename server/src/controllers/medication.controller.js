import { ApiError, ApiResponse, asyncHandler } from "../utility/index.js";
import statusCode from "../constants/statusCode.js";
import Medication from "../models/medication.model.js";

const getMedicationAnalytics = asyncHandler(async (req, res) => {
    const medications = await Medication.find({})
        .sort({ totalTablets: -1 })
        .select("name dosage totalTablets createdAt");

    if (!medications || medications.length === 0) {
        throw new ApiError(statusCode.NOT_FOUND, "No medications found!");
    }

    return res.status(statusCode.OK).json(
        new ApiResponse(
            statusCode.OK,
            "Medication analytics fetched successfully",
            medications
        )
    );
});

export { getMedicationAnalytics };
