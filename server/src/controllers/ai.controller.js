import {processVoiceCommand} from '../utility/aiModel.js';
import {ApiError, ApiResponse, asyncHandler} from '../utility/index.js';

const aiController = asyncHandler(async (req, res) => {
    const {transcript, language} = req.body;

    if (!transcript) {
        throw new ApiError(400, 'Transcript is required');
    }

    // Extract access token from cookies or authorization header
    const accessToken =
        req.cookies?.accessToken ||
        req.header('Authorization')?.replace('Bearer ', '');

    if (!accessToken) {
        throw new ApiError(
            401,
            'Access token is required for booking appointments'
        );
    }

    // Base URL for your backend
    const baseURL = process.env.SERVER_URL;

    // Process the voice command with authentication
    const response = await processVoiceCommand(
        transcript,
        accessToken,
        baseURL
    );

    if (language === 'en-US') {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    response?.success,
                    response?.message,
                    response?.details
                )
            );
    } else {
        return res
            .status(200)
            .json(
                new ApiResponse(
                    response?.success,
                    response?.message_hi,
                    response?.details
                )
            );
    }
});

export {aiController};
