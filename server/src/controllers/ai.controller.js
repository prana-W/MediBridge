import {ApiResponse, asyncHandler} from '../utility/index.js';
import {handleVoiceInput} from '../utility/aiModel.js';
import statusCode from '../constants/statusCode.js';
import {ApiError} from '@google/genai';

const aiController = asyncHandler(async (req, res) => {
    const transcript = req.params?.transcript;

    if (!transcript) {
        throw new ApiError(statusCode.NOT_FOUND, 'Transcript not found');
    }

    const response = await handleVoiceInput(transcript);

    if (!response) {
        throw new ApiError(statusCode.NO_CONTENT, 'Response not found');
    }

    return res.status(200).json(new ApiResponse(200, 'AI succesfully returned the response', response));
})

export {aiController};