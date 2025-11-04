import {ApiError, asyncHandler} from '../utility/index.js';
import statusCode from '../constants/statusCode.js';
import jwt from 'jsonwebtoken';
import cookieOptions from '../constants/cookieOptions.js';

// Todo: Kindly verify this
const verifyAccessToken = async (req, res, next) => {
    try {
        const accessToken = req?.cookies?.accessToken;

        console.log(req?.cookies);

        if (!accessToken) {
            throw new ApiError(
                statusCode.UNAUTHORIZED,
                'Access token is missing!'
            );
        }

        const verifiedToken = jwt.verify(
            accessToken,
            process.env.ACCESS_TOKEN_SECRET
        );

        if (!verifiedToken) {
            throw new ApiError(
                statusCode.UNAUTHORIZED,
                'Access token validation error!'
            );
        }

        req.userId = verifiedToken?._id;
        // console.log(req.userId)
        next();
    } catch (error) {
        next(new ApiError(statusCode.UNAUTHORIZED, error));
    }
};

export {verifyAccessToken};
