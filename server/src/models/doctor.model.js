import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ApiError } from '../utility/index.js';
import statusCode from '../constants/statusCode.js';

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        department: {
            type: String,
            required: true,
            enum: [
                'general',
                'dermatologist',
                'gynecologist',
                'cardiologist',
                'orthopedic',
                'pediatrician',
                'neurologist',
                'dentist',
            ],
            lowercase: true,
        },

        hospital: {
            type: String,
            required: true,
            trim: true,
        },

        idCardNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        workingHours: {
            start: { type: String, required: true }, // e.g. "09:00"
            end: { type: String, required: true },   // e.g. "17:00"
        },

        workingDays: {
            type: [String], // e.g. ["monday", "tuesday"]
            required: true,
            lowercase: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },

        phoneNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        refreshToken: {
            type: String,
            select: false,
        },
    },
    { timestamps: true }
);

doctorSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

doctorSchema.methods.generateAndUpdateRefreshToken = async function () {
    try {
        const refreshToken = jwt.sign(
            { doctorId: this._id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
        );

        this.refreshToken = refreshToken;
        await this.save({ validateBeforeSave: false });

        return refreshToken;
    } catch (error) {
        throw new ApiError(
            statusCode.INTERNAL_SERVER_ERROR,
            'Error generating refresh token'
        );
    }
};

doctorSchema.statics.generateAccessTokenFromRefreshToken = async function (refreshToken) {
    try {
        const verified = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        if (!verified) {
            throw new ApiError(statusCode.BAD_REQUEST, 'Invalid refresh token');
        }

        const doctor = await this.findById(verified.doctorId).select('-password -refreshToken -__v');
        if (!doctor) {
            throw new ApiError(statusCode.NOT_FOUND, 'Doctor not found');
        }

        const payload = {
            doctorId: doctor._id,
            name: doctor.name,
            email: doctor.email,
            department: doctor.department,
        };

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
    } catch (error) {
        throw new ApiError(statusCode.UNAUTHORIZED, 'Invalid or expired refresh token');
    }
};

doctorSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;
