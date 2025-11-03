import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ApiError } from '../utility/index.js';
import statusCode from '../constants/statusCode.js';

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            unique: true,
            match: [/^[6-9]\d{9}$/, 'Invalid phone number'],
        },
        aadhar: {
            type: String,
            required: true,
            unique: true,
            match: [/^\d{12}$/, 'Aadhar number must be 12 digits'],
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },
        refreshToken: {
            type: String,
        },
        state: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        }
    },
    { timestamps: true }
);

patientSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

patientSchema.methods.generateAndUpdateRefreshToken = async function (patientId) {
    try {
        const refreshToken = jwt.sign(
            { patientId },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        const patient = await Patient.findByIdAndUpdate(
            patientId,
            { refreshToken },
            { new: true }
        );

        if (!patient) {
            throw new ApiError(statusCode.BAD_REQUEST, 'Patient not found while creating refresh token');
        }

        return refreshToken;
    } catch (error) {
        throw error;
    }
};

patientSchema.methods.generateAccessTokenFromRefreshToken = async (refreshToken) => {
    try {
        const verifiedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!verifiedRefreshToken) {
            throw new ApiError(statusCode.BAD_REQUEST, 'Invalid or expired refresh token');
        }

        const patient = await Patient.findById(verifiedRefreshToken?.patientId).select(
            '-password -refreshToken -__v'
        );

        if (!patient) {
            throw new ApiError(statusCode.BAD_REQUEST, 'Patient not found while generating access token');
        }

        const payload = {
            patientId: patient?._id,
            name: patient?.name,
            phone: patient?.phone,
            aadhar: patient?.aadhar,
        };

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
    } catch (error) {
        throw error;
    }
};

patientSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

const Patient = mongoose.model('Patient', patientSchema);
export default Patient;